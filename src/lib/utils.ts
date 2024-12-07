import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToISO(date: Date) {
  const padZero = (num: number) => String(num).padStart(2, '0');

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getDayName(date: Date, locale: string = "nl") {
  return date.toLocaleDateString(locale, {weekday: 'long'});
}

export function sameDay(d1: Date, d2: Date) {
  return d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}