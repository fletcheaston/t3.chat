from django.db import models
from simple_history.models import HistoricalRecords

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
