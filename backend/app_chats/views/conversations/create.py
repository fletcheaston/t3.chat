from ninja import Router

from app_chats import models, schemas
from app_utils.requests import AuthenticatedHttpRequest

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
        conversation=conversation,
        user=request.user,
        added_by=request.user,
        llms_selected=[],
    )

    return conversation
