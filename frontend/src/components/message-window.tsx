import { useState } from "react";
import * as React from "react";

import { ArrowUpIcon } from "lucide-react";

import { LargeLanguageModel } from "@/api";
import { Button } from "@/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils";

export function MessageWindow(props: {
    sendMessage: (content: string, llms: Array<LargeLanguageModel>) => Promise<void>;
}) {
    /**************************************************************************/
    /* State */
    const [llms, setLlms] = useState<Array<LargeLanguageModel>>(["utils-echo"]);
    const [message, setMessage] = useState("");

    const empty = message === "";

    /**************************************************************************/
    /* Render */
    return (
        <div className="bg-background/50 rounded-t-2xl p-2 pb-0 backdrop-blur-xs">
            <div className="bg-background-light/30 mb-0 flex flex-col justify-between gap-2 rounded-t-xl p-3 backdrop-blur-xs">
                <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message here..."
                    className="max-h-48"
                />

                <div className="flex items-center justify-between">
                    <Select
                        defaultValue={"utils-echo" satisfies LargeLanguageModel}
                        onValueChange={(value) => {
                            setLlms([value as LargeLanguageModel]);
                        }}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Testing</SelectLabel>

                                <SelectItem value={"utils-echo" satisfies LargeLanguageModel}>
                                    Echo
                                </SelectItem>

                                <SelectLabel>OpenAI</SelectLabel>

                                <SelectItem value={"openai-gpt-4.1" satisfies LargeLanguageModel}>
                                    OpenAI GPT-4.1
                                </SelectItem>

                                <SelectItem
                                    value={"openai-gpt-4.1-mini" satisfies LargeLanguageModel}
                                >
                                    OpenAI GPT-4.1-mini
                                </SelectItem>

                                <SelectItem
                                    value={"openai-gpt-4.1-nano" satisfies LargeLanguageModel}
                                >
                                    OpenAI GPT-4.1-nano
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button
                        size="icon"
                        className={cn(
                            "bg-primary-light",
                            empty ? "cursor-default opacity-50" : "hover:bg-primary"
                        )}
                        onClick={() => {
                            if (!message) return;

                            const tempMessage = message;

                            setMessage("");

                            props.sendMessage(message, llms).catch(() => setMessage(tempMessage));
                        }}
                        tooltip={empty ? "Message requires text" : "Send message"}
                    >
                        <ArrowUpIcon className="text-background-dark size-5" />
                        <span className="sr-only">Send Message</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
