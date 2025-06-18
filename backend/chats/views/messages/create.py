from typing import Any

from ninja import Router

from chats import schemas
from chats.jobs.queue import queue_task
from chats.models import Conversation, Message
from chats.requests import AuthenticatedHttpRequest

router = Router()


@router.post(
    "",
    response={200: schemas.MessageSchema, 404: schemas.ErrorSchema},
    by_alias=True,
)
def create_message(
    request: AuthenticatedHttpRequest,
    data: schemas.NewMessageSchema,
) -> Any:
    conversation = Conversation.objects.filter(
        id=data.conversation_id,
        owner_id=request.user.id,
    ).first()

    if conversation is None:
        return 404, schemas.ErrorSchema(
            detail=schemas.ErrorMessage.RESOURCE_DOES_NOT_EXIST
        )

    reply_to: Message | None = None

    if data.reply_to_id is not None:
        reply_to = Message.objects.filter(
            id=data.reply_to_id,
            conversation=conversation,
        ).first()

        if reply_to is None:
            return 404, schemas.ErrorSchema(
                detail=schemas.ErrorMessage.RESOURCE_DOES_NOT_EXIST
            )

    message = Message.objects.create(
        id=data.id,
        title=data.title,
        content=data.content,
        author=request.user,
        conversation=conversation,
        reply_to=reply_to,
    )

    queue_task(message.id, data.llms)

    return message
