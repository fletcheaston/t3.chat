from django.db import models
from simple_history.models import HistoricalRecords

from app_utils.models import DjangoModel

from .users import User


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


class TagQuerySet(models.QuerySet["Tag"]):
    pass


class Tag(DjangoModel):
    ############################################################################
    # Normal fields
    title = models.TextField()

    color = models.TextField()

    owner = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
    )

    ############################################################################
    # Queryset managers
    objects = TagQuerySet.as_manager()

    history = HistoricalRecords(table_name="tag_history")

    ############################################################################
    # Meta
    class Meta:
        db_table = "tag"

    ############################################################################
    # Properties

    ############################################################################
    # Methods


class ConversationToTagQuerySet(models.QuerySet["ConversationToTag"]):
    pass


class ConversationToTag(DjangoModel):
    ############################################################################
    # Normal fields
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.PROTECT,
    )

    tag = models.ForeignKey(
        Tag,
        on_delete=models.PROTECT,
    )

    ############################################################################
    # Queryset managers
    objects = ConversationToTagQuerySet.as_manager()

    history = HistoricalRecords(table_name="conversation_to_tag_history")

    ############################################################################
    # Meta
    class Meta:
        db_table = "conversation_to_tag"

    ############################################################################
    # Properties

    ############################################################################
    # Methods


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
