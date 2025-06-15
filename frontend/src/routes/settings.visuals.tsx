import * as React from "react";

import { useDebouncedCallback } from "@react-hookz/web";
import { createFileRoute } from "@tanstack/react-router";

import { useSettings, useUpdateSetting } from "@/components/auth";
import { themeColors, themeNames, themeParser } from "@/components/themes";
import { Button } from "@/ui/button";
import { ColorPicker } from "@/ui/color-picker";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

export const Route = createFileRoute("/settings/visuals")({
    component: RouteComponent,
});

function ColorOverride(props: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    onReset: () => void;
}) {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex max-w-96 items-center gap-2">
            <ColorPicker
                id={props.name}
                value={props.value}
                onChange={props.onChange}
            />

            <Label
                htmlFor={props.name}
                className="m-0"
            >
                {props.name} Color Override
            </Label>

            <div className="grow" />

            <Button
                size="custom"
                variant="default"
                className="px-3 py-1 text-sm"
                tooltip={null}
                onClick={props.onReset}
            >
                Reset
            </Button>
        </div>
    );
}

function Theme() {
    /**************************************************************************/
    /* State */
    const settings = useSettings();
    const updateSettings = useUpdateSetting();

    const parsedThemeName = themeParser.parse(settings.visualTheme);

    // Primary
    const primary =
        settings.visualThemePrimaryOverride || themeColors[parsedThemeName]["--primary"];

    const updatePrimary = useDebouncedCallback(
        (value: string) => {
            updateSettings("visualThemePrimaryOverride", value);
        },
        [updateSettings],
        500
    );

    // Secondary
    const secondary =
        settings.visualThemeSecondaryOverride || themeColors[parsedThemeName]["--secondary"];

    const updateSecondary = useDebouncedCallback(
        (value: string) => {
            updateSettings("visualThemeSecondaryOverride", value);
        },
        [updateSettings],
        500
    );

    // Background
    const background =
        settings.visualThemeBackgroundOverride || themeColors[parsedThemeName]["--background"];

    const updateBackground = useDebouncedCallback(
        (value: string) => {
            updateSettings("visualThemeBackgroundOverride", value);
        },
        [updateSettings],
        500
    );

    // Text
    const text = settings.visualThemeTextOverride || themeColors[parsedThemeName]["--text"];

    const updateText = useDebouncedCallback(
        (value: string) => {
            updateSettings("visualThemeTextOverride", value);
        },
        [updateSettings],
        500
    );

    // Border
    const border = settings.visualThemeBorderOverride || themeColors[parsedThemeName]["--border"];

    const updateBorder = useDebouncedCallback(
        (value: string) => {
            updateSettings("visualThemeBorderOverride", value);
        },
        [updateSettings],
        1000
    );

    /**************************************************************************/
    /* Render */
    return (
        <div>
            <Label
                htmlFor="theme"
                className="mb-1 pl-2"
            >
                Theme
            </Label>

            <Select
                defaultValue={parsedThemeName}
                onValueChange={(value) => {
                    const parsedValue = themeParser.parse(value);

                    updateSettings("visualTheme", parsedValue);
                }}
            >
                <SelectTrigger className="hover:bg-background w-36">
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>

                <SelectContent>
                    {themeNames.map((themeName) => {
                        return (
                            <SelectItem
                                key={themeName}
                                value={themeName}
                            >
                                {themeName}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>

            <div className="mt-2 flex flex-col gap-4 pl-2">
                <ColorOverride
                    name="Primary"
                    value={primary}
                    onChange={updatePrimary}
                    onReset={() => {
                        updateSettings("visualThemePrimaryOverride", "");
                    }}
                />

                <ColorOverride
                    name="Secondary"
                    value={secondary}
                    onChange={updateSecondary}
                    onReset={() => {
                        updateSettings("visualThemeSecondaryOverride", "");
                    }}
                />

                <ColorOverride
                    name="Background"
                    value={background}
                    onChange={updateBackground}
                    onReset={() => {
                        updateSettings("visualThemeBackgroundOverride", "");
                    }}
                />

                <ColorOverride
                    name="Text"
                    value={text}
                    onChange={updateText}
                    onReset={() => {
                        updateSettings("visualThemeTextOverride", "");
                    }}
                />

                <ColorOverride
                    name="Border"
                    value={border}
                    onChange={updateBorder}
                    onReset={() => {
                        updateSettings("visualThemeBorderOverride", "");
                    }}
                />
            </div>
        </div>
    );
}

function RouteComponent() {
    return (
        <div className="pb-8">
            <h1 className="text-4xl font-semibold">Visual Settings</h1>

            <div className="my-4 flex flex-col gap-6">
                <Theme />
            </div>
        </div>
    );
}
