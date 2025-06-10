from .base import Schema


class AuthUserSchema(Schema):
    name: str
    email: str


class CsrfAuthUserSchema(Schema):
    csrf_token: str
    auth_user: AuthUserSchema
