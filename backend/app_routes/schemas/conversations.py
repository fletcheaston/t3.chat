import uuid

from .base import Schema
from .conversation_tags import ConversationTagSchema


class ConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tags: list[ConversationTagSchema]


class NewConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tag_ids: list[uuid.UUID]


class UpdateConversationSchema(Schema):
    title: str
    tag_ids: list[uuid.UUID]
