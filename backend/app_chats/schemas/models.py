from enum import StrEnum


class LargeLanguageModel(StrEnum):
    UTILS_ECHO = "utils-echo"

    OPENAI_GPT_4_1 = "openai-gpt-4.1"
    OPENAI_GPT_4_1_MINI = "openai-gpt-4.1-mini"
    OPENAI_GPT_4_1_NANO = "openai-gpt-4.1-nano"

    # OPENAI_GPT_4O_MINI = "openai-gpt-4o-mini"
    #
    # OPENAI_O1_MINI = "openai-o1-mini"
    # OPENAI_O3 = "openai-o3"
    # OPENAI_O3_MINI = "openai-o3-mini"
    # OPENAI_O4_MINI = "openai-o4-mini"
    #
    # OPENAI_GPT_4O_MINI_SEARCH_PREVIEW = "openai-gpt-4o-mini-search-preview"
