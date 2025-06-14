import uuid

from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.utils import timezone
from openai import OpenAI

from app_chats import models, schemas
from server.env import SETTINGS

client = OpenAI(api_key=SETTINGS.OPENAI_API_KEY)


@shared_task(name=f"openai.{schemas.LargeLanguageModel.OPENAI_GPT_4_1}")
def openai_gpt_4_1(message_id: uuid.UUID) -> None:
    message = models.Message.objects.get(id=message_id)

    # https://platform.openai.com/docs/models/gpt-4.1
    messages = models.Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s::integer);
""",
        [message_id, 1_047_576 // 4],
    )

    stream = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {
                "role": message.role,
                "content": message.content,
            }
            for message in messages
        ],
        stream=True,
    )

    new_message = models.Message.objects.create(
        id=uuid.uuid4(),
        title="",
        content="",
        llm=schemas.LargeLanguageModel.OPENAI_GPT_4_1,
        conversation_id=message.conversation_id,
        reply_to=message,
    )

    # Broadcast via channels
    channel_layer = get_channel_layer()

    for event in stream:
        for choice in event.choices:
            if choice.delta.content:
                new_message.content += choice.delta.content
                new_message.modified = timezone.now()

                async_to_sync(channel_layer.group_send)(
                    f"user-{message.conversation.owner_id}",
                    {
                        "type": "send_data",
                        "event": schemas.SyncMessage.model_validate(
                            {
                                "type": "message",
                                "data": new_message,
                            }
                        ).model_dump_safe(),
                    },
                )

    new_message.save()


@shared_task(name=f"openai.{schemas.LargeLanguageModel.OPENAI_GPT_4_1_MINI}")
def openai_gpt_4_1_mini(message_id: uuid.UUID) -> None:
    message = models.Message.objects.get(id=message_id)

    # https://platform.openai.com/docs/models/gpt-4.1
    messages = models.Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s::integer);
""",
        [message_id, 1_047_576 // 4],
    )

    stream = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": message.role,
                "content": message.content,
            }
            for message in messages
        ],
        stream=True,
    )

    new_message = models.Message.objects.create(
        id=uuid.uuid4(),
        title="",
        content="",
        llm=schemas.LargeLanguageModel.OPENAI_GPT_4_1_MINI,
        conversation_id=message.conversation_id,
        reply_to=message,
    )

    # Broadcast via channels
    channel_layer = get_channel_layer()

    for event in stream:
        for choice in event.choices:
            if choice.delta.content:
                new_message.content += choice.delta.content
                new_message.modified = timezone.now()

                async_to_sync(channel_layer.group_send)(
                    f"user-{message.conversation.owner_id}",
                    {
                        "type": "send_data",
                        "event": schemas.SyncMessage.model_validate(
                            {
                                "type": "message",
                                "data": new_message,
                            }
                        ).model_dump_safe(),
                    },
                )

    new_message.save()


@shared_task(name=f"openai.{schemas.LargeLanguageModel.OPENAI_GPT_4_1_NANO}")
def openai_gpt_4_1_nano(message_id: uuid.UUID) -> None:
    message = models.Message.objects.get(id=message_id)

    # https://platform.openai.com/docs/models/gpt-4.1
    messages = models.Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s::integer);
""",
        [message_id, 1_047_576 // 4],
    )

    stream = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {
                "role": message.role,
                "content": message.content,
            }
            for message in messages
        ],
        stream=True,
    )

    new_message = models.Message.objects.create(
        id=uuid.uuid4(),
        title="",
        content="",
        llm=schemas.LargeLanguageModel.OPENAI_GPT_4_1_NANO,
        conversation_id=message.conversation_id,
        reply_to=message,
    )

    # Broadcast via channels
    channel_layer = get_channel_layer()

    for event in stream:
        for choice in event.choices:
            if choice.delta.content:
                new_message.content += choice.delta.content
                new_message.modified = timezone.now()

                async_to_sync(channel_layer.group_send)(
                    f"user-{message.conversation.owner_id}",
                    {
                        "type": "send_data",
                        "event": schemas.SyncMessage.model_validate(
                            {
                                "type": "message",
                                "data": new_message,
                            }
                        ).model_dump_safe(),
                    },
                )

    new_message.save()
