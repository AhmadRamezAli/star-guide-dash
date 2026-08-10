// Mirrors the backend contracts (Forcasting.Contract.*).

export const TIME_UNITS = ["Day", "Week", "Month", "Year"] as const;
export type TimeUnit = (typeof TIME_UNITS)[number];

export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;
export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export type ForecasterListDto = {
  id: string;
  name: string;
  rate?: number | null;
};

export type ForecasterDto = {
  id: string;
  name: string;
  imagePath?: string | null;
  description?: string | null;
  rate?: number | null;
};

/** ForcastorCreateOrUpdateDto — `id` omitted on create, required on update. */
export type ForecasterCreateInput = {
  name: string;
  description: string;
  imagePath?: string;
  rate?: number | null;
};
export type ForecasterUpdateInput = ForecasterCreateInput & { id: string };

export type ForecasterQuery = {
  keyword?: string;
  rate?: number;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type PredictionListDto = {
  id: string;
  forcastorId: string;
  date: string;
  summary: string;
  timeUnit: TimeUnit | number;
  zodiacSign: ZodiacSign | number;
};

export type PredictionDto = PredictionListDto & {
  forcastor?: ForecasterDto | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
};

/** PredicationCreateOrUpdateDto — `id` omitted on create, required on update. */
export type PredictionCreateInput = {
  forcastorId: string;
  date: string;
  summary: string;
  description: string;
  timeUnit: TimeUnit;
  zodiacSign: ZodiacSign;
};
export type PredictionUpdateInput = PredictionCreateInput & { id: string };

export type PredictionQuery = {
  date?: string;
  keyword?: string;
  timeUnit?: TimeUnit;
  zodiacSign?: ZodiacSign;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
};
