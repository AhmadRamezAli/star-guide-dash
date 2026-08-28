import { ZodiacSign,TimeUnit } from "./enums";
import { forcastorDto } from "./forcastor";

export interface PredictionListDto {
  id: string;
  forcastorId: string;
  date: string; // ISO string
  summary: string | null;
  timeUnit: TimeUnits;
  zodiacSign: ZodiacSign;
}

export interface PredictionDto {
  id: string;
  forcastorId: string;
  forcastor: ForcastorDto;
  date: string; // ISO string
  summary: string | null;
  description: string | null;
  timeUnit: TimeUnits;
  zodiacSign: ZodiacSign;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PredictionCreateOrUpdateDto {
  id: string | null;
  forcastorId: string;
  date: string; // ISO string
  summary: string | null;
  description: string | null;
  timeUnit: TimeUnits;
  zodiacSign: ZodiacSign;
}   



