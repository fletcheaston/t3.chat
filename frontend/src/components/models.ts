import { LargeLanguageModel } from "@/api/client";

import conicalFlaskIcon from "/media/conical-flask.png";
import geminiIcon from "/media/gemini.png";
import openAiIcon from "/media/openai.png";

export const llmToName: Record<LargeLanguageModel, string> = {
    "utils-echo": "Echo",
    "openai-gpt-4.1": "OpenAI GPT-4.1",
    "openai-gpt-4.1-mini": "OpenAI GPT-4.1 Mini",
    "openai-gpt-4.1-nano": "OpenAI GPT-4.1 Nano",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
    "gemini-2.0-flash-lite": "Gemini 2.0 Flash-Lite",
    "gemini-2.5-pro": "Gemini 2.5 Pro",
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
};

export const llmToImageUrl: Record<LargeLanguageModel, string> = {
    "utils-echo": conicalFlaskIcon,
    "openai-gpt-4.1": openAiIcon,
    "openai-gpt-4.1-mini": openAiIcon,
    "openai-gpt-4.1-nano": openAiIcon,
    "gemini-2.0-flash": geminiIcon,
    "gemini-2.0-flash-lite": geminiIcon,
    "gemini-2.5-pro": geminiIcon,
    "gemini-2.5-flash": geminiIcon,
    "gemini-2.5-flash-lite": geminiIcon,
};

export const llmToDescription: Record<LargeLanguageModel, string> = {
    "utils-echo":
        "A model exclusively used for testing. Send a message to this model and get your message back approximately one second later.",
    "openai-gpt-4.1":
        "GPT-4.1 is a flagship large language model optimized for advanced instruction following, real-world software engineering, and long-context reasoning. It outperforms GPT-4o and GPT-4.5 across coding (54.6% SWE-bench Verified), instruction compliance (87.4% IFEval), and multimodal understanding benchmarks.",
    "openai-gpt-4.1-mini":
        "GPT-4.1 Mini is a mid-sized model delivering performance competitive with GPT-4o at substantially lower latency. It has a very large context window and scores 45.1% on hard instruction evals, 35.8% on MultiChallenge, and 84.1% on IFEval. Mini also shows strong coding ability (e.g., 31.6% on Aider's polyglot diff benchmark) and vision understanding.",
    "openai-gpt-4.1-nano":
        "For tasks that demand low latency, GPT‑4.1 Nano is the fastest model in the GPT-4.1 series. It delivers exceptional performance at a small size with its 1 million token context window, and scores 80.1% on MMLU, 50.3% on GPQA, and 9.8% on Aider polyglot coding – even higher than GPT‑4o mini. It's ideal for tasks like classification or autocompletion.",
    "gemini-2.0-flash":
        "Google's flagship model, known for speed and accuracy (and also web search!). Not quite as smart as Claude 3.5 Sonnet, but WAY faster and cheaper. Also has an insanely large context window (it can handle a lot of data).",
    "gemini-2.0-flash-lite":
        "Similar to 2.0 Flash, but even faster. Not as smart, but still good at most things.",
    "gemini-2.5-pro":
        "Google's most advanced model, excelling at complex reasoning and problem-solving. Particularly strong at tackling difficult code challenges, mathematical proofs, and STEM problems. With its massive context window, it can deeply analyze large codebases, datasets and technical documents to provide comprehensive solutions.",
    "gemini-2.5-flash":
        "Google's state of the art fast model, known for speed and accuracy (and also web search!). Not quite as smart as Claude Sonnet, but WAY faster and cheaper. Also has an insanely large context window (it can handle a lot of data).",
    "gemini-2.5-flash-lite":
        "Gemini 2.5 Flash-Lite is a member of the Gemini 2.5 series of models, a suite of highly-capable, natively multimodal models. Gemini 2.5 Flash-Lite is Google’s most cost-efficient model, striking a balance between efficiency and quality.",
};
