from typing import Literal

from channels.generic.websocket import AsyncWebsocketConsumer
from ninja import Router

from app_routes import schemas

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

        # TODO - Full bootstrap

    ####################################################################################
    async def disconnect(self, close_code) -> None:
        # Close connection
        await self.close(close_code)
