import uuid
from datetime import datetime

from .base import Schema
from .tags import TagSchema


class ConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tags: list[TagSchema]
    created: datetime


class NewConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tag_ids: list[uuid.UUID]


class UpdateConversationSchema(Schema):
    title: str
    tag_ids: list[uuid.UUID]
