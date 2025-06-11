import uuid
from datetime import datetime

from .base import Schema


class MessageSchema(Schema):
    id: uuid.UUID
    title: str
    content: str
    created: datetime

    conversation_id: uuid.UUID
    reply_to_id: uuid.UUID | None


class NewMessageSchema(Schema):
    id: uuid.UUID
    title: str
    content: str

    conversation_id: uuid.UUID
    reply_to_id: uuid.UUID | None
