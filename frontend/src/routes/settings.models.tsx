import { createFileRoute } from "@tanstack/react-router";

import { LargeLanguageModel } from "@/api";
import { useSettings, useUpdateSetting } from "@/api/auth";
import { llmToDescription, llmToImageUrl, llmToName } from "@/api/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/accordion";
import { Card, CardContent } from "@/ui/card";
import { Switch } from "@/ui/switch";

export const Route = createFileRoute("/settings/models")({
    component: RouteComponent,
});

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
                        className="size-6 rounded"
                    />

                    <h3 className="text-xl font-semibold">{name}</h3>

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

                <p className="mt-4 text-sm">{description}</p>
            </CardContent>
        </Card>
    );
}

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <>
            <h1 className="text-4xl font-semibold">Model Settings</h1>

            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div>
                            <h2 className="text-2xl font-semibold">Available Models</h2>

                            <p>Choose which models appear in your model selector.</p>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold">OpenAI Models</h3>

                            <ModelCard llm="openai-gpt-4.1" />

                            <ModelCard llm="openai-gpt-4.1-mini" />

                            <ModelCard llm="openai-gpt-4.1-nano" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold">Test Models</h3>

                            <ModelCard llm="utils-echo" />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
}
