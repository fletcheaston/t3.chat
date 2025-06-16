import uuid
from datetime import datetime

from .base import Schema
from .models import LargeLanguageModel


class MemberSchema(Schema):
    id: uuid.UUID
    created: datetime
    modified: datetime

    conversation_id: uuid.UUID
    user_id: uuid.UUID
    added_by_id: uuid.UUID

    llms_selected: list[LargeLanguageModel]


class NewConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tag_ids: list[uuid.UUID]


class UpdateConversationSchema(Schema):
    title: str | None = None
    tag_ids: list[uuid.UUID] | None = None
    message_branches: dict[str, bool] | None = None
