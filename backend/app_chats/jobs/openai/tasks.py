import uuid

from celery import shared_task

from app_chats.models import Message
from app_chats.schemas import LargeLanguageModel


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1}")
def openai_gpt_4_1(message_id: uuid.UUID) -> None:
    message = Message.objects.get(id=message_id)

    Message.objects.create(
        title=message.title,
        content=f"{LargeLanguageModel.OPENAI_GPT_4_1}: {message.content}",
        author_id=message.author_id,
        conversation_id=message.conversation_id,
        reply_to=message,
    )


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1_MINI}")
def openai_gpt_4_1_mini(message_id: uuid.UUID) -> None:
    message = Message.objects.get(id=message_id)

    Message.objects.create(
        title=message.title,
        content=f"{LargeLanguageModel.OPENAI_GPT_4_1}: {message.content}",
        author_id=message.author_id,
        conversation_id=message.conversation_id,
        reply_to=message,
    )


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1_NANO}")
def openai_gpt_4_1_nano(message_id: uuid.UUID) -> None:
    message = Message.objects.get(id=message_id)

    Message.objects.create(
        title=message.title,
        content=f"{LargeLanguageModel.OPENAI_GPT_4_1}: {message.content}",
        author_id=message.author_id,
        conversation_id=message.conversation_id,
        reply_to=message,
    )
