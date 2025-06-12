import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(timestamp: string | Date): string {
    let realTimestamp;

    if (typeof timestamp === "string") {
        if (timestamp.includes("T")) {
            realTimestamp = new Date(Date.parse(timestamp));
        } else {
            realTimestamp = new Date(Date.parse(`${timestamp}T00:00:00`));
        }
    } else {
        realTimestamp = timestamp;
    }

    return realTimestamp.toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
}

export function formatDatetime(timestamp: string | Date): string {
    const realTimestamp =
        typeof timestamp === "string" ? new Date(Date.parse(timestamp)) : timestamp;

    const time = realTimestamp.toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const date = realTimestamp.toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `${time}, ${date}`;
}
