from typing import Any

from channels.generic.websocket import AsyncWebsocketConsumer
from ninja import Router

from app_chats import schemas
from app_chats.models import Conversation, Message, Tag, User

router = Router()


@router.get(
    "",
    response={200: schemas.GlobalSyncTypes},
    by_alias=True,
)
def global_sync_types() -> None:
    raise NotImplementedError


class GlobalSyncConsumer(AsyncWebsocketConsumer):
    user: User
    group_name: str

    ####################################################################################
    async def connect(self) -> None:
        # Check user
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        # Start connection
        self.group_name = f"user-{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Full bootstrap
        # Tags
        async for value in Tag.objects.filter(owner=self.user):
            data = schemas.SyncTag(type="tag", data=value)
            await self.send(data.model_dump_json(by_alias=True))

        # Conversations
        async for value in Conversation.objects.filter(
            owner=self.user
        ).prefetch_related("db_tags__conversations"):
            data = schemas.SyncConversation(type="conversation", data=value)
            await self.send(data.model_dump_json(by_alias=True))

        # Messages
        async for value in Message.objects.filter(conversation__owner=self.user):
            data = schemas.SyncMessage(type="message", data=value)
            await self.send(data.model_dump_json(by_alias=True))

    ####################################################################################
    async def disconnect(self, close_code) -> None:
        # Close connection
        await self.close(close_code)

    ####################################################################################
    async def send_data(self, event: Any) -> None:
        data = schemas.SendDataEvent.model_validate(event)
        await self.send(data.event.model_dump_json(by_alias=True))
