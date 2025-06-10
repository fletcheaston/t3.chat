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
    title = models.TextField()

    content = models.TextField()

    author = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
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

    ############################################################################
    # Methods
    def save(self, *args, **kwargs) -> None:
        super().save(*args, **kwargs)

        # Broadcast via channels
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user-{self.author_id}",
            {
                "type": "send_data",
                "event": schemas.SyncMessage.model_validate(
                    {
                        "type": "message",
                        "data": self,
                    }
                ).model_dump_safe(),
            },
        )
