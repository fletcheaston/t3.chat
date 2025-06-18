from ninja import Router

from chats import models, schemas
from chats.jobs.queue import queue_task
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

    queue_task(data.message_id, data.llms)

    return conversation
