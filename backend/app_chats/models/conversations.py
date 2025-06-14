from typing import TYPE_CHECKING

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models
from simple_history.models import HistoricalRecords

from app_chats import schemas
from app_utils.models import DjangoModel

from .users import User

if TYPE_CHECKING:
    from .tags import Tag


class ConversationQuerySet(models.QuerySet["Conversation"]):
    pass


class Conversation(DjangoModel):
    ############################################################################
    # Normal fields
    title = models.TextField()

    owner = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
    )

    db_tags = models.ManyToManyField(
        "Tag",
        related_name="conversations",
        through="ConversationToTag",
    )

    ############################################################################
    # Queryset managers
    objects = ConversationQuerySet.as_manager()

    history = HistoricalRecords(table_name="conversation_history")

    ############################################################################
    # Meta
    class Meta:
        db_table = "conversation"

    ############################################################################
    # Properties
    @property
    def tags(self) -> list["Tag"]:
        return self.db_tags.all()

    ############################################################################
    # Methods
    def __str__(self) -> str:
        return f"{self.title}"

    def save(self, *args, **kwargs) -> None:
        super().save(*args, **kwargs)

        # Broadcast via channels
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user-{self.owner_id}",
            {
                "type": "send_data",
                "event": [
                    schemas.SyncConversation.model_validate(
                        {
                            "type": "conversation",
                            "data": self,
                        }
                    ).model_dump_safe()
                ],
            },
        )
