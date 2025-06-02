import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { devtools } from "zustand/middleware";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const zustandDevtools =
  process.env.NODE_ENV === "development" ? devtools : (fn) => fn;
