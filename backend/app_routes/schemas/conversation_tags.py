import uuid

from pydantic_extra_types.color import Color

from .base import Schema


class ConversationTagSchema(Schema):
    id: uuid.UUID
    title: str
    color: Color


class NewConversationTagSchema(Schema):
    id: uuid.UUID
    title: str
    color: Color


class UpdateConversationTagSchema(Schema):
    title: str
    color: Color
