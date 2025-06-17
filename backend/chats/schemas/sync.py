from typing import Literal

from chats import schemas


class SyncMessageMetadata(schemas.Schema):
    type: Literal["message-metadata"]
    data: schemas.MessageMetadataSchema


class SyncMessage(schemas.Schema):
    type: Literal["message"]
    data: schemas.MessageSchema


class SyncConversation(schemas.Schema):
    type: Literal["conversation"]
    data: schemas.ConversationSchema


class SyncMember(schemas.Schema):
    type: Literal["member"]
    data: schemas.MemberSchema


class SyncUser(schemas.Schema):
    type: Literal["user"]
    data: schemas.UserSchema


GlobalSyncTypes = (
    SyncMessageMetadata | SyncMessage | SyncConversation | SyncMember | SyncUser
)


class SendDataEvent(schemas.Schema):
    event: list[GlobalSyncTypes]
