from typing import Literal

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models
from simple_history.models import HistoricalRecords

from app_chats import schemas
from app_utils.models import DjangoModel

from .conversation import Conversation
from .users import User


class MessageQuerySet(models.QuerySet["Message"]):
    pass


class Message(DjangoModel):
    ############################################################################
    # Normal fields
    title = models.TextField(blank=True)

    content = models.TextField()

    author = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
    )

    llm = models.TextField(
        null=True,
        blank=True,
        choices=[(llm.value, llm.name) for llm in schemas.LargeLanguageModel],
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.PROTECT,
    )

    reply_to = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
    )

    ############################################################################
    # Queryset managers
    objects = MessageQuerySet.as_manager()

    history = HistoricalRecords(table_name="message_history")

    ############################################################################
    # Meta
    class Meta:
        db_table = "message"

    ############################################################################
    # Properties
    @property
    def role(self) -> Literal["assistant", "user"]:
        if self.llm:
            return "assistant"

        return "user"

    ############################################################################
    # Methods
    def save(self, *args, **kwargs) -> None:
        if self.llm is None and self.author_id is None:
            raise ValueError("Must set either LLM or Author")

        if self.llm is not None and self.author_id is not None:
            raise ValueError("Can set either LLM or Author but not both")

        super().save(*args, **kwargs)

        # Broadcast via channels
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user-{self.conversation.owner_id}",
            {
                "type": "send_data",
                "event": [
                    schemas.SyncMessageMetadata.model_validate(
                        {
                            "type": "message-metadata",
                            "data": self,
                        }
                    ).model_dump_safe(),
                    schemas.SyncMessage.model_validate(
                        {
                            "type": "message",
                            "data": self,
                        }
                    ).model_dump_safe(),
                ],
            },
        )
