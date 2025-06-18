from ninja import Router

from chats import models, schemas
from chats.jobs.openai.tasks import (
    openai_gpt_4_1,
    openai_gpt_4_1_mini,
    openai_gpt_4_1_nano,
)
from chats.jobs.utils.tasks import echo
from chats.requests import AuthenticatedHttpRequest

router = Router()


@router.post(
    "",
    response={200: schemas.ConversationSchema},
    by_alias=True,
)
def create_conversation(
    request: AuthenticatedHttpRequest,
    data: schemas.NewConversationSchema,
) -> models.Conversation:
    conversation = models.Conversation.objects.create(
        id=data.id,
        title=data.title,
        owner=request.user,
    )

    models.ConversationMember.objects.create(
        id=data.member_id,
        conversation=conversation,
        user=request.user,
        added_by=request.user,
        llms_selected=data.llms,
    )

    models.Message.objects.create(
        id=data.message_id,
        title=data.message_title,
        content=data.message_content,
        author=request.user,
        conversation=conversation,
    )

    ############################################################################
    # Check which LLMs were requested
    if schemas.LargeLanguageModel.UTILS_ECHO in data.llms:
        echo.delay_on_commit(data.message_id)

    if schemas.LargeLanguageModel.OPENAI_GPT_4_1 in data.llms:
        openai_gpt_4_1.delay_on_commit(data.message_id)

    if schemas.LargeLanguageModel.OPENAI_GPT_4_1_MINI in data.llms:
        openai_gpt_4_1_mini.delay_on_commit(data.message_id)

    if schemas.LargeLanguageModel.OPENAI_GPT_4_1_NANO in data.llms:
        openai_gpt_4_1_nano.delay_on_commit(data.message_id)

    return conversation
