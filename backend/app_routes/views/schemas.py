from enum import StrEnum

from app_utils.schemas import BaseModel


class Schema(BaseModel):
    pass


class ErrorMessage(StrEnum):
    UNAUTHENTICATED_USER = "User is unauthenticated."
    INVALID_TOKEN = "Invalid auth token."
    RESOURCE_DOES_NOT_EXIST = "Resource does not exist."


class ErrorSchema(Schema):
    detail: ErrorMessage
