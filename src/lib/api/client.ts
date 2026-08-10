const API_BASE_KEY = "zodiac.apiBase";

export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(API_BASE_KEY);
    if (stored) return stored.replace(/\/+$/, "");
  }
  const fromEnv = import.meta.env["VITE_API_BASE_URL"] as string | undefined;
  return (fromEnv ?? "").replace(/\/+$/, "");
}

export function setApiBase(value: string) {
  window.localStorage.setItem(API_BASE_KEY, value.replace(/\/+$/, ""));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Backend wraps everything in Result<T>; tolerate the common shapes. */
function unwrapResult<T>(body: unknown): T {
  if (body && typeof body === "object") {
    const r = body as Record<string, unknown>;
    const failed = r["isSuccess"] === false || r["succeeded"] === false || r["isFailure"] === true;
    if (failed) {
      const err = r["error"] ?? r["errors"] ?? r["message"];
      throw new ApiError(
        typeof err === "string" ? err : JSON.stringify(err ?? "Request failed"),
        400,
      );
    }
    for (const key of ["value", "data", "result"]) {
      if (key in r) return r[key] as T;
    }
  }
  return body as T;
}

function buildQuery(params: Record<string, unknown> | undefined) {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key.charAt(0).toUpperCase() + key.slice(1), String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(
  path: string,
  init: RequestInit & { params?: Record<string, unknown> } = {},
): Promise<T> {
  const base = getApiBase();
  if (!base) throw new ApiError("API base URL is not configured", 0);

  const { params, ...rest } = init;
  const res = await fetch(`${base}${path}${buildQuery(params)}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(rest.headers ?? {}),
    },
  });

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object"
        ? ((body as Record<string, unknown>)["title"] as string) ||
          ((body as Record<string, unknown>)["detail"] as string) ||
          JSON.stringify(body)
        : String(body || res.statusText);
    throw new ApiError(message, res.status);
  }

  return unwrapResult<T>(body);
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(path, { method: "GET", params }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
};
