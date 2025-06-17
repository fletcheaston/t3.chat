import { useEffect } from "react";

import { z } from "zod";

import { useSettings } from "@/components/auth";

export const themeNames = [
    "Fletcher's Default",
    "Black and White",
    "White and Black",
    "Ouch My Eyes",
    "Halloween",
    "Christmas",
] as const;

export type ThemeName = (typeof themeNames)[number];

export const themeParser = z.enum(themeNames).catch("Fletcher's Default");

interface ThemeColors {
    "--primary": string;
    "--secondary": string;
    "--background": string;
    "--text": string;
    "--border": string;
}

export const themeColors: Record<ThemeName, ThemeColors> = {
    "Fletcher's Default": {
        "--primary": "#F10975",
        "--secondary": "#8580ff",
        "--background": "#201f4c",
        "--text": "#F3FEFF",
        "--border": "#F3FEFF",
    },
    "Black and White": {
        "--primary": "#F3FEFF",
        "--secondary": "#F3FEFF",
        "--background": "#272727",
        "--text": "#F3FEFF",
        "--border": "#bababa",
    },
    "White and Black": {
        "--primary": "#000000",
        "--secondary": "#000000",
        "--background": "#ffffff",
        "--text": "#000000",
        "--border": "#a5a5a5",
    },
    "Ouch My Eyes": {
        "--primary": "#3cff00",
        "--secondary": "#ff00bf",
        "--background": "#000f73",
        "--text": "#00fffb",
        "--border": "#dbff00",
    },
    Halloween: {
        "--primary": "#ff4c00",
        "--secondary": "#8c0000",
        "--background": "#000000",
        "--text": "#F3FEFF",
        "--border": "#ff4a00",
    },
    Christmas: {
        "--primary": "#dd0606",
        "--secondary": "#ff81ad",
        "--background": "#074527",
        "--text": "#F3FEFF",
        "--border": "#95c5a4",
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
