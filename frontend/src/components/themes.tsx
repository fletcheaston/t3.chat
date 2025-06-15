import { useEffect } from "react";

import { z } from "zod";

import { useSettings } from "@/components/auth";

export const themeNames = ["Default", "Acid Headache", "Halloween", "Christmas"] as const;

export type ThemeName = (typeof themeNames)[number];

export const themeParser = z.enum(themeNames).catch("Default");

interface ThemeColors {
    "--primary": string;
    "--secondary": string;
    "--background": string;
    "--text": string;
    "--border": string;
}

export const themeColors: Record<ThemeName, ThemeColors> = {
    Default: {
        "--primary": "#F10975",
        "--secondary": "#8D37D3",
        "--background": "#42597C",
        "--text": "#F3FEFF",
        "--border": "#F3FEFF",
    },
    "Acid Headache": {
        "--primary": "#5AEC2F",
        "--secondary": "#EC9A2F",
        "--background": "#0F143E",
        "--text": "#C7F8BE",
        "--border": "#FF0041",
    },
    Halloween: {
        "--primary": "#F10975",
        "--secondary": "#8D37D3",
        "--background": "#42597C",
        "--text": "#F3FEFF",
        "--border": "#F3FEFF",
    },
    Christmas: {
        "--primary": "#F10975",
        "--secondary": "#8D37D3",
        "--background": "#42597C",
        "--text": "#F3FEFF",
        "--border": "#F3FEFF",
    },
} as const;

export function useTheme() {
    /**************************************************************************/
    /* Effects */
    const settings = useSettings();

    useEffect(() => {
        const baseTheme = themeParser.parse(settings.visualTheme);

        const theme = { ...themeColors[baseTheme] };

        if (settings.visualThemePrimaryOverride) {
            theme["--primary"] = settings.visualThemePrimaryOverride;
        }
        if (settings.visualThemeSecondaryOverride) {
            theme["--secondary"] = settings.visualThemeSecondaryOverride;
        }

        if (settings.visualThemeBackgroundOverride) {
            theme["--background"] = settings.visualThemeBackgroundOverride;
        }

        if (settings.visualThemeTextOverride) {
            theme["--text"] = settings.visualThemeTextOverride;
        }

        if (settings.visualThemeBorderOverride) {
            theme["--border"] = settings.visualThemeBorderOverride;
        }

        document.documentElement.style.setProperty("--primary", theme["--primary"]);
        document.documentElement.style.setProperty("--secondary", theme["--secondary"]);
        document.documentElement.style.setProperty("--background", theme["--background"]);
        document.documentElement.style.setProperty("--text", theme["--text"]);
        document.documentElement.style.setProperty("--border", theme["--border"]);
    }, [
        settings.visualTheme,
        settings.visualThemePrimaryOverride,
        settings.visualThemeSecondaryOverride,
        settings.visualThemeBackgroundOverride,
        settings.visualThemeTextOverride,
        settings.visualThemeBorderOverride,
    ]);
}
