from typing import Any

from ninja import Router

from app_chats import schemas
from app_chats.jobs.openai.tasks import (
    openai_gpt_4_1,
    openai_gpt_4_1_mini,
    openai_gpt_4_1_nano,
)
from app_chats.jobs.utils.tasks import echo
from app_chats.models import Conversation, Message
from app_utils.requests import AuthenticatedHttpRequest

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

    ############################################################################
    # Check which LLMs were requested
    if schemas.LargeLanguageModel.UTILS_ECHO in data.llms:
        echo.delay_on_commit(message.id)

    if schemas.LargeLanguageModel.OPENAI_GPT_4_1 in data.llms:
        openai_gpt_4_1.delay_on_commit(message.id)

    if schemas.LargeLanguageModel.OPENAI_GPT_4_1_MINI in data.llms:
        openai_gpt_4_1_mini.delay_on_commit(message.id)

    if schemas.LargeLanguageModel.OPENAI_GPT_4_1_NANO in data.llms:
        openai_gpt_4_1_nano.delay_on_commit(message.id)

    return message
