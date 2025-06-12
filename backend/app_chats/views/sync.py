from datetime import datetime
from typing import Any

from channels.generic.websocket import AsyncWebsocketConsumer
from ninja import Router

from app_chats import schemas
from app_chats.models import Conversation, Message, Tag, User
from app_utils.requests import AuthenticatedHttpRequest

router = Router(tags=["sync"])


@router.get(
    "",
    response={200: schemas.GlobalSyncTypes},
    by_alias=True,
)
def global_sync_types() -> None:
    raise NotImplementedError


@router.get(
    "/bootstrap",
    response={200: list[schemas.GlobalSyncTypes]},
    by_alias=True,
)
def global_sync_bootstrap(
    request: AuthenticatedHttpRequest,
    timestamp: datetime | None = None,
) -> Any:
    data: list[schemas.GlobalSyncTypes] = []

    ############################################################################
    # Tags
    tags = Tag.objects.filter(owner=request.user)

    if timestamp is not None:
        tags = tags.filter(modified__gte=timestamp)

    for value in tags:
        data.append(schemas.SyncTag(type="tag", data=value))

    ############################################################################
    # Conversations
    conversations = Conversation.objects.filter(owner=request.user).prefetch_related(
        "db_tags__conversations"
    )

    if timestamp is not None:
        conversations = conversations.filter(modified__gte=timestamp)

    for value in conversations:
        data.append(schemas.SyncConversation(type="conversation", data=value))

    ############################################################################
    # Messages
    messages = Message.objects.filter(conversation__owner=request.user)

    if timestamp is not None:
        messages = messages.filter(modified__gte=timestamp)

    for value in messages:
        data.append(schemas.SyncMessage(type="message", data=value))

    return data


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

    ####################################################################################
    async def disconnect(self, close_code) -> None:
        # Close connection
        await self.close(close_code)

    ####################################################################################
    async def send_data(self, event: Any) -> None:
        data = schemas.SendDataEvent.model_validate(event)
        await self.send(data.event.model_dump_json(by_alias=True))
