from typing import Literal

from app_chats import schemas


class SyncMessage(schemas.Schema):
    type: Literal["message"]
    data: schemas.MessageSchema


class SyncConversation(schemas.Schema):
    type: Literal["conversation"]
    data: schemas.ConversationSchema


class SyncTag(schemas.Schema):
    type: Literal["tag"]
    data: schemas.TagSchema


GlobalSyncTypes = SyncMessage | SyncConversation | SyncTag


class SendDataEvent(schemas.Schema):
    event: GlobalSyncTypes
