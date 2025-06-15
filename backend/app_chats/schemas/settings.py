import uuid
from datetime import datetime

from .base import Schema
from .models import LargeLanguageModel


class SettingSchema(Schema):
    id: uuid.UUID
    created: datetime
    modified: datetime

    llm_nickname: str
    llm_job: str
    llm_traits: list[str]
    llm_context: str
    llms_available: list[LargeLanguageModel]


class UpdateSettingSchema(Schema):
    llm_nickname: str | None = None
    llm_job: str | None = None
    llm_traits: list[str] | None = None
    llm_context: str | None = None
    llms_available: list[LargeLanguageModel] | None = None
