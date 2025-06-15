from typing import Literal

from app_chats import schemas


class SyncMessageMetadata(schemas.Schema):
    type: Literal["message-metadata"]
    data: schemas.MessageMetadataSchema


class SyncMessage(schemas.Schema):
    type: Literal["message"]
    data: schemas.MessageSchema


class SyncConversation(schemas.Schema):
    type: Literal["conversation"]
    data: schemas.ConversationSchema


class SyncTag(schemas.Schema):
    type: Literal["tag"]
    data: schemas.TagSchema


class SyncUser(schemas.Schema):
    type: Literal["user"]
    data: schemas.UserSchema


class SyncSettingSchema(schemas.Schema):
    type: Literal["setting"]
    data: schemas.SettingSchema


GlobalSyncTypes = (
    SyncMessageMetadata | SyncMessage | SyncConversation | SyncTag | SyncUser
)


class SendDataEvent(schemas.Schema):
    event: list[GlobalSyncTypes]
