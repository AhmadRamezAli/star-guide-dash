import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getImageUrl(fileName?: string | null): string {
  if (!fileName) return "/placeholder-avatar.png"; 
  if (fileName.startsWith("http")) return fileName;

  // Ensure this matches the port your C# backend runs on
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  // Append the MediaController routing pattern
  return `${cleanBase}/api/media/${fileName}`;
}