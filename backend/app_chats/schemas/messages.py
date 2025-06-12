import uuid
from datetime import datetime

from .base import Schema


class MessageSchema(Schema):
    id: uuid.UUID
    created: datetime
    modified: datetime

    title: str
    content: str

    conversation_id: uuid.UUID
    reply_to_id: uuid.UUID | None
    author_id: uuid.UUID


class NewMessageSchema(Schema):
    id: uuid.UUID
    title: str
    content: str

    conversation_id: uuid.UUID
    reply_to_id: uuid.UUID | None
