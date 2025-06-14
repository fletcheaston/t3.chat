from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import models
from simple_history.models import HistoricalRecords

from app_chats import schemas
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
                "event": schemas.SyncConversation.model_validate(
                    {
                        "type": "conversation",
                        "data": self,
                    }
                ).model_dump_safe(),
            },
        )


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
    def save(self, *args, **kwargs) -> None:
        super().save(*args, **kwargs)

        # Broadcast via channels
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user-{self.owner_id}",
            {
                "type": "send_data",
                "event": schemas.SyncTag.model_validate(
                    {
                        "type": "tag",
                        "data": self,
                    }
                ).model_dump_safe(),
            },
        )


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
    def save(self, *args, **kwargs) -> None:
        super().save(*args, **kwargs)

        value = self.conversation

        # Broadcast via channels
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user-{value.owner_id}",
            {
                "type": "send_data",
                "event": schemas.SyncConversation.model_validate(
                    {
                        "type": "conversation",
                        "data": value,
                    }
                ).model_dump_safe(),
            },
        )

    def delete(self, *args, **kwargs) -> None:
        # Grab the conversation before it's wiped
        value = self.conversation

        # Run the actual delete
        super().delete(*args, **kwargs)

        # Refresh the conversation so we pull down relevant tags
        value.refresh_from_db()

        # Broadcast via channels
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user-{value.owner_id}",
            {
                "type": "send_data",
                "event": schemas.SyncConversation.model_validate(
                    {
                        "type": "conversation",
                        "data": value,
                    }
                ).model_dump_safe(),
            },
        )


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
