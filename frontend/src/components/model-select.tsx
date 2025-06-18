import * as React from "react";

import { LargeLanguageModel } from "@/api";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";

export function ModelSelect(props: {
    llms: Array<LargeLanguageModel>;
    setLlms: (value: Array<LargeLanguageModel>) => void;
}) {
    /**************************************************************************/
    /* Render */
    return (
        <Select
            value={props.llms[0]}
            onValueChange={(value) => {
                props.setLlms([value as LargeLanguageModel]);
            }}
        >
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select a model" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Testing</SelectLabel>

                    <SelectItem value={"utils-echo" satisfies LargeLanguageModel}>Echo</SelectItem>

                    <SelectLabel>OpenAI</SelectLabel>

                    <SelectItem value={"openai-gpt-4.1" satisfies LargeLanguageModel}>
                        OpenAI GPT-4.1
                    </SelectItem>

                    <SelectItem value={"openai-gpt-4.1-mini" satisfies LargeLanguageModel}>
                        OpenAI GPT-4.1-mini
                    </SelectItem>

                    <SelectItem value={"openai-gpt-4.1-nano" satisfies LargeLanguageModel}>
                        OpenAI GPT-4.1-nano
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
