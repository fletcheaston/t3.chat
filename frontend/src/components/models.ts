import { LargeLanguageModel } from "@/api/client";

import conicalFlaskIcon from "/media/conical-flask.png";
import openAiIcon from "/media/openai.png";

export const llmToName: Record<LargeLanguageModel, string> = {
    "openai-gpt-4.1": "OpenAI GPT-4.1",
    "openai-gpt-4.1-mini": "OpenAI GPT-4.1 Mini",
    "openai-gpt-4.1-nano": "OpenAI GPT-4.1 Nano",
    "utils-echo": "Echo",
};

export const llmToImageUrl: Record<LargeLanguageModel, string> = {
    "openai-gpt-4.1": openAiIcon,
    "openai-gpt-4.1-mini": openAiIcon,
    "openai-gpt-4.1-nano": openAiIcon,
    "utils-echo": conicalFlaskIcon,
};

export const llmToDescription: Record<LargeLanguageModel, string> = {
    "openai-gpt-4.1":
        "GPT-4.1 is a flagship large language model optimized for advanced instruction following, real-world software engineering, and long-context reasoning. It outperforms GPT-4o and GPT-4.5 across coding (54.6% SWE-bench Verified), instruction compliance (87.4% IFEval), and multimodal understanding benchmarks.",
    "openai-gpt-4.1-mini":
        "GPT-4.1 Mini is a mid-sized model delivering performance competitive with GPT-4o at substantially lower latency. It has a very large context window and scores 45.1% on hard instruction evals, 35.8% on MultiChallenge, and 84.1% on IFEval. Mini also shows strong coding ability (e.g., 31.6% on Aider's polyglot diff benchmark) and vision understanding.",
    "openai-gpt-4.1-nano":
        "For tasks that demand low latency, GPT‑4.1 Nano is the fastest model in the GPT-4.1 series. It delivers exceptional performance at a small size with its 1 million token context window, and scores 80.1% on MMLU, 50.3% on GPQA, and 9.8% on Aider polyglot coding – even higher than GPT‑4o mini. It's ideal for tasks like classification or autocompletion.",
    "utils-echo":
        "A model exclusively used for testing. Send a message to this model and get your message back approximately one second later.",
};
