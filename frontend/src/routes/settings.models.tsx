import { createFileRoute } from "@tanstack/react-router";
import { BanIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { LargeLanguageModel } from "@/api";
import { useSettings, useUpdateSetting, useUser } from "@/api/auth";
import { llmToDescription, llmToImageUrl, llmToName } from "@/api/models";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Switch } from "@/ui/switch";
import { Textarea } from "@/ui/textarea";

export const Route = createFileRoute("/settings/models")({
    component: RouteComponent,
});

function Nickname() {
    /**************************************************************************/
    /* State */
    const settings = useSettings();
    const updateSettings = useUpdateSetting();

    const user = useUser();

    /**************************************************************************/
    /* Render */
    return (
        <div>
            <Label htmlFor="nickname">What should the models call you?</Label>

            <Input
                id="nickname"
                placeholder={user.name}
                defaultValue={settings.llmNickname}
                className="text-pantone-lighter"
                onBlur={(event) => {
                    if (event.target.value !== settings.llmNickname) {
                        updateSettings("llmNickname", event.target.value);
                    }
                }}
            />
        </div>
    );
}

function Job() {
    /**************************************************************************/
    /* State */
    const settings = useSettings();
    const updateSettings = useUpdateSetting();

    /**************************************************************************/
    /* Render */
    return (
        <div>
            <Label htmlFor="job">What do you do?</Label>

            <Input
                id="job"
                placeholder="Engineer, student, etc."
                defaultValue={settings.llmJob}
                className="text-pantone-lighter"
                onBlur={(event) => {
                    if (event.target.value !== settings.llmJob) {
                        updateSettings("llmJob", event.target.value);
                    }
                }}
            />
        </div>
    );
}

const exampleTraits = [
    "friendly",
    "witty",
    "concise",
    "curious",
    "empathetic",
    "creative",
    "patient",
] as const;

function Traits() {
    /**************************************************************************/
    /* State */
    const settings = useSettings();
    const updateSettings = useUpdateSetting();

    const filteredExampleTraits = exampleTraits.filter(
        (trait) => !settings.llmTraits.includes(trait)
    );

    /**************************************************************************/
    /* Render */
    return (
        <div>
            <Label htmlFor="trait">What traits should the models have?</Label>

            <div className="border-silver rounded-md border">
                {settings.llmTraits.length > 0 ? (
                    <div className="border-b-silver-dull flex gap-1 border-b px-1 py-1 text-sm">
                        {settings.llmTraits.map((trait) => {
                            return (
                                <Button
                                    key={trait}
                                    variant="default"
                                    size="custom"
                                    className="bg-pantone-lighter hover:bg-pantone hover:border-pantone border-pantone-lighter text-gunmetal-dark h-fit gap-1.5 py-0.5 pr-1 pl-2 text-xs"
                                    tooltip={`Remove trait "${trait}"`}
                                    onClick={() => {
                                        updateSettings(
                                            "llmTraits",
                                            settings.llmTraits.filter(
                                                (llmTrait) => llmTrait !== trait
                                            )
                                        );
                                    }}
                                >
                                    {trait}

                                    <BanIcon />
                                </Button>
                            );
                        })}
                    </div>
                ) : null}

                <Input
                    id="trait"
                    placeholder="Type a trait and press Enter or Tab"
                    className="text-pantone-lighter border-none"
                    onKeyDown={(event) => {
                        const value = event.currentTarget.value;

                        if (event.key === "Enter" || event.key === "Tab") {
                            event.preventDefault();
                            event.stopPropagation();

                            if (!value) {
                                toast.warning("Please enter a trait first");
                                return;
                            }

                            updateSettings("llmTraits", [...settings.llmTraits, value]);
                            event.currentTarget.value = "";
                        }
                    }}
                />
            </div>

            {filteredExampleTraits.length > 0 ? (
                <div className="mt-2 flex gap-1">
                    {filteredExampleTraits.map((trait) => {
                        return (
                            <Button
                                key={trait}
                                variant="default"
                                size="custom"
                                className="bg-pantone-lighter hover:bg-pantone hover:border-pantone border-pantone-lighter text-gunmetal-dark h-fit gap-1.5 py-0.5 pr-1 pl-2 text-xs"
                                tooltip={`Add trait "${trait}"`}
                                onClick={() => {
                                    updateSettings("llmTraits", [...settings.llmTraits, trait]);
                                }}
                            >
                                {trait}

                                <PlusIcon />
                            </Button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

function Context() {
    /**************************************************************************/
    /* State */
    const settings = useSettings();
    const updateSettings = useUpdateSetting();

    /**************************************************************************/
    /* Render */
    return (
        <div>
            <Label htmlFor="context">What else do you want the models to know about you?</Label>

            <Textarea
                id="context"
                placeholder="Interests, values, or preferences to keep in mind"
                defaultValue={settings.llmContext}
                className="text-pantone-lighter border-silver min-h-32 resize-y rounded-md border px-2 py-1.5"
                onBlur={(event) => {
                    if (event.target.value !== settings.llmContext) {
                        updateSettings("llmContext", event.target.value);
                    }
                }}
            />
        </div>
    );
}

function ModelCard(props: { llm: LargeLanguageModel }) {
    /**************************************************************************/
    /* State */
    const settings = useSettings();
    const updateSettings = useUpdateSetting();

    const name = llmToName[props.llm];
    const imageUrl = llmToImageUrl[props.llm];
    const description = llmToDescription[props.llm];

    /**************************************************************************/
    /* Render */
    return (
        <Card>
            <CardContent>
                <div className="flex items-center gap-2">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="size-5 rounded"
                    />

                    <h4 className="text-base font-semibold">{name}</h4>

                    <div className="grow" />

                    <Switch
                        checked={settings.llmsAvailable.includes(props.llm)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                updateSettings("llmsAvailable", [
                                    ...settings.llmsAvailable,
                                    props.llm,
                                ]);
                            } else {
                                updateSettings(
                                    "llmsAvailable",
                                    settings.llmsAvailable.filter((llm) => llm !== props.llm)
                                );
                            }
                        }}
                    />
                </div>

                <p className="mt-2 text-sm">{description}</p>
            </CardContent>
        </Card>
    );
}

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <div className="pb-8">
            <h1 className="text-4xl font-semibold">Model Settings</h1>

            <div className="mt-4">
                <h2 className="text-2xl font-semibold">Prompt Customization</h2>
            </div>

            <div className="my-4 flex flex-col gap-6">
                <Nickname />

                <Job />

                <Traits />

                <Context />
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold">Available Models</h2>

                <p>
                    Choose which models appear in your model selector. This will not affect any
                    existing chats.
                </p>
            </div>

            <div className="my-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">OpenAI Models</h3>

                    <ModelCard llm="openai-gpt-4.1" />

                    <ModelCard llm="openai-gpt-4.1-mini" />

                    <ModelCard llm="openai-gpt-4.1-nano" />
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Test Models</h3>

                    <ModelCard llm="utils-echo" />
                </div>
            </div>
        </div>
    );
}
