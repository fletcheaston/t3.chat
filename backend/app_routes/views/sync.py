from typing import Literal

from channels.generic.websocket import AsyncWebsocketConsumer
from ninja import Router

from app_routes import schemas
from app_users.models import Conversation, ConversationTag, Message

router = Router()


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


@router.get(
    "",
    response={200: GlobalSyncTypes},
    by_alias=True,
)
def global_sync_types() -> None:
    raise NotImplementedError


class GlobalSyncConsumer(AsyncWebsocketConsumer):
    ####################################################################################
    async def connect(self) -> None:
        # Check user
        if not self.scope["user"].is_authenticated:
            await self.close()

        # Start connection
        await self.accept()

        # Full bootstrap
        # Tags
        async for value in ConversationTag.objects.filter(owner=self.scope["user"]):
            data = SyncTag(type="tag", data=value)
            await self.send(data.model_dump_json())

        # Conversations
        async for value in Conversation.objects.filter(
            owner=self.scope["user"]
        ).prefetch_related("db_tags__conversations"):
            data = SyncConversation(type="conversation", data=value)
            await self.send(data.model_dump_json())

        # Messages
        async for value in Message.objects.filter(
            conversation__owner=self.scope["user"]
        ):
            data = SyncMessage(type="message", data=value)
            await self.send(data.model_dump_json())

    ####################################################################################
    async def disconnect(self, close_code) -> None:
        # Close connection
        await self.close(close_code)
