import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";
import type {
  ForecasterDto,
  ForecasterListDto,
  ForecasterQuery,
  ForecasterCreateInput,
  ForecasterUpdateInput,
  PredictionDto,
  PredictionListDto,
  PredictionQuery,
  PredictionCreateInput,
  PredictionUpdateInput,
} from "./types";
import { TIME_UNITS, ZODIAC_SIGNS, type TimeUnit, type ZodiacSign } from "./types";

export const forecasterKeys = {
  all: ["forecasters"] as const,
  list: (query: ForecasterQuery) => ["forecasters", "list", query] as const,
  detail: (id: string) => ["forecasters", "detail", id] as const,
};

export const predictionKeys = {
  all: ["predictions"] as const,
  list: (query: PredictionQuery) => ["predictions", "list", query] as const,
  detail: (id: string) => ["predictions", "detail", id] as const,
};

export const forecastersQuery = (query: ForecasterQuery) =>
  queryOptions({
    queryKey: forecasterKeys.list(query),
    queryFn: () => api.get<ForecasterListDto[]>("/api/Forcastor/get-list", query),
  });

export const forecasterQuery = (id: string) =>
  queryOptions({
    queryKey: forecasterKeys.detail(id),
    queryFn: () => api.get<ForecasterDto>(`/api/Forcastor/${id}`),
    enabled: !!id,
  });

export const createForecaster = (input: ForecasterCreateInput) =>
  api.post<ForecasterDto>("/api/Forcastor/create", input);

export const updateForecaster = (input: ForecasterUpdateInput) =>
  api.post<ForecasterDto>("/api/Forcastor/update", input);

export const predictionsQuery = (query: PredictionQuery) =>
  queryOptions({
    queryKey: predictionKeys.list(query),
    queryFn: async () => {
      const rows = await api.get<PredictionListDto[]>("/api/Prediction/get-all", query);
      return (rows ?? []).map(normalizePrediction);
    },
  });

export const predictionQuery = (id: string) =>
  queryOptions({
    queryKey: predictionKeys.detail(id),
    queryFn: async () => normalizePrediction(await api.get<PredictionDto>(`/api/Prediction/${id}`)),
    enabled: !!id,
  });

export const createPrediction = (input: PredictionCreateInput) =>
  api.post<PredictionDto>("/api/Prediction/create", input);

export const updatePrediction = (input: PredictionUpdateInput) =>
  api.post<PredictionDto>("/api/Prediction/update", input);

/** Backends may serialize enums as ints; normalize to their string names. */
export function normalizePrediction<T extends PredictionListDto>(row: T): T {
  return {
    ...row,
    timeUnit: (typeof row.timeUnit === "number"
      ? (TIME_UNITS[row.timeUnit] ?? TIME_UNITS[0])
      : row.timeUnit) as TimeUnit,
    zodiacSign: (typeof row.zodiacSign === "number"
      ? (ZODIAC_SIGNS[row.zodiacSign] ?? ZODIAC_SIGNS[0])
      : row.zodiacSign) as ZodiacSign,
  };
}
