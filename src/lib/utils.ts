import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getImageUrl(path?: string | null): string {
  // 1. Handle empty paths with a default fallback image
  if (!path) return "/placeholder-avatar.png"; // Ensure you have a placeholder in your /public folder

  // 2. Handle paths that are already absolute (e.g., external links)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // 3. Get the current backend URL from Vite environment variables
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  // 4. Sanitize slashes to prevent "http://localhost:5001//StaticFiles/..."
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${cleanBase}${cleanPath}`;
}