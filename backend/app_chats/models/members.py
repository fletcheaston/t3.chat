from django.db import models
from simple_history.models import HistoricalRecords

from app_utils.models import DjangoModel

from .conversations import Conversation
from .users import User


class ConversationMemberQuerySet(models.QuerySet["ConversationMember"]):
    pass


class ConversationMember(DjangoModel):
    ############################################################################
    # Normal fields
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.PROTECT,
    )

    user = models.ForeignKey(
        User,
        related_name="conversations",
        on_delete=models.PROTECT,
    )

    added_by = models.ForeignKey(
        User,
        related_name="+",
        on_delete=models.PROTECT,
    )

    ############################################################################
    # Queryset managers
    objects = ConversationMemberQuerySet.as_manager()

    history = HistoricalRecords(table_name="conversation_member_history")

    ############################################################################
    # Meta
    class Meta:
        db_table = "conversation_member"

    ############################################################################
    # Properties

    ############################################################################
    # Methods
