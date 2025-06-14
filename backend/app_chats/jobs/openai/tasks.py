import logging
import uuid

from celery import shared_task
from openai import OpenAI

from app_chats.models import Message
from app_chats.schemas import LargeLanguageModel
from server.env import SETTINGS

client = OpenAI(api_key=SETTINGS.OPENAI_API_KEY)


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1}")
def openai_gpt_4_1(message_id: uuid.UUID) -> None:
    message = Message.objects.get(id=message_id)

    # https://platform.openai.com/docs/models/gpt-4.1
    messages = Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s::integer);
""",
        [message_id, 1_047_576 // 4],
    )

    logging.warning(f"{messages=}")

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

    new_message = Message.objects.create(
        id=uuid.uuid4(),
        title="",
        content="",
        llm=LargeLanguageModel.OPENAI_GPT_4_1,
        conversation_id=message.conversation_id,
        reply_to=message,
    )

    content = ""

    for event in stream:
        for choice in event.choices:
            if choice.delta.content:
                content += choice.delta.content

    new_message.content = content
    new_message.save()


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1_MINI}")
def openai_gpt_4_1_mini(message_id: uuid.UUID) -> None:
    # https://platform.openai.com/docs/models/gpt-4.1-mini
    messages = Message.objects.raw(
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

    for event in stream:
        logging.warning(event)


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1_NANO}")
def openai_gpt_4_1_nano(message_id: uuid.UUID) -> None:
    # https://platform.openai.com/docs/models/gpt-4.1-nano
    messages = Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s::integer);
""",
        [message_id, 128_000 // 4],
    )

    stream = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[
            {
                "role": message.role,
                "content": message.content,
            }
            for message in messages
        ],
        stream=True,
    )

    for event in stream:
        logging.warning(event)
