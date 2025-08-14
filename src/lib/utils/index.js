import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { devtools } from "zustand/middleware";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-xxs"],
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const zustandDevtools =
  process.env.NODE_ENV === "development" ? devtools : (fn) => fn;

export const isExcelFile = (file) => {
  const allowedTypes = [
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  const isExcel =
    allowedTypes.includes(fileType) ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx");
  return isExcel;
};
