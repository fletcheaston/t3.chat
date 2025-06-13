import uuid

from celery import shared_task

from app_chats.models import Message


@shared_task(name="utils.echo")
def echo(message_id: uuid.UUID) -> None:
    message = Message.objects.get(id=message_id)

    Message.objects.create(
        title=message.title,
        content=f"Echo: {message.content}",
        author_id=message.author_id,
        conversation_id=message.conversation_id,
        reply_to=message,
    )
