import uuid
from datetime import datetime

from .base import Schema
from .tags import TagSchema


class ConversationSchema(Schema):
    id: uuid.UUID
    created: datetime
    modified: datetime

    title: str
    tags: list[TagSchema]
    created: datetime

    message_branches: dict[str, bool]


class NewConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tag_ids: list[uuid.UUID]


class UpdateConversationSchema(Schema):
    title: str | None = None
    tag_ids: list[uuid.UUID] | None = None
    message_branches: dict[str, bool] | None = None
