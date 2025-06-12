import uuid

from .base import Schema


class UserSchema(Schema):
    id: uuid.UUID
    name: str
    image_url: str


class CsrfAuthUserSchema(Schema):
    csrf_token: str
    user: UserSchema
