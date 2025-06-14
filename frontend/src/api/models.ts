import { LargeLanguageModel } from "@/api/client";

import openAiIcon from "/media/openai.png";

export const llmToName: Record<LargeLanguageModel, string> = {
    "openai-gpt-4.1": "OpenAI GPT-4.1",
    "openai-gpt-4.1-mini": "OpenAI GPT-4.1 Mini",
    "openai-gpt-4.1-nano": "OpenAI GPT-4.1 Nano",
    "utils-echo": "Test Echo",
};

export const llmToImageUrl: Record<LargeLanguageModel, string | null> = {
    "openai-gpt-4.1": openAiIcon,
    "openai-gpt-4.1-mini": openAiIcon,
    "openai-gpt-4.1-nano": openAiIcon,
    "utils-echo": null,
};
