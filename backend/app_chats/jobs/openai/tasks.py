import uuid

from celery import shared_task
from openai import OpenAI

from app_chats.models import Message
from app_chats.schemas import LargeLanguageModel
from server.env import SETTINGS

client = OpenAI(api_key=SETTINGS.OPENAI_API_KEY)


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1}")
def openai_gpt_4_1(message_id: uuid.UUID) -> None:
    # https://platform.openai.com/docs/models/gpt-4.1
    messages = Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s);
""",
        [message_id, 1_047_576 / 4],
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

    for event in stream:
        print(event)


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1_MINI}")
def openai_gpt_4_1_mini(message_id: uuid.UUID) -> None:
    # https://platform.openai.com/docs/models/gpt-4.1-mini
    messages = Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s);
""",
        [message_id, 1_047_576 / 4],
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
        print(event)


@shared_task(name=f"openai.{LargeLanguageModel.OPENAI_GPT_4_1_NANO}")
def openai_gpt_4_1_nano(message_id: uuid.UUID) -> None:
    # https://platform.openai.com/docs/models/gpt-4.1-nano
    messages = Message.objects.raw(
        """
SELECT
    *
FROM
    threaded_messages(%s, %s);
""",
        [message_id, 128_000 / 4],
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
        print(event)
