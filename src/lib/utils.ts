import { IntervalType } from '@/types/enum';

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

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

export function formatTimestampToInterval(timestamp: string, interval: IntervalType) {
    const date = new Date(timestamp);
    const padZero = (num: number) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    switch (interval) {
        case 'minute':
            return `${hours}:${minutes}`;
        case '5 minute':
            return `${hours}:${minutes}`;
        case 'hour':
            return `${hours}:${minutes}`;
        case 'day':
            return `${day}-${month}`;
        case 'week':
            return `${day}-${month}`;
    }
}

export function getDayName(date: Date, locale: string = "nl") {
    return date.toLocaleDateString(locale, {weekday: 'long'});
}

export function sameDay(d1: Date, d2: Date) {
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

}

export function filterObject<T extends object, U extends keyof T>(obj: T, keys: U[]): Pick<T, U> {
    const result = {} as Pick<T, U>;
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}

export function dayDifference(d1: Date, d2: Date) {
    const diff = d1.getTime() - d2.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
}