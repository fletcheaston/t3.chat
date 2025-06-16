import uuid

from ninja import Router

from app_chats import schemas
from app_chats.models import Conversation
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.patch(
    "/{conversation_id}",
    response={200: schemas.ConversationSchema},
    by_alias=True,
)
def update_conversation(
    request: AuthenticatedHttpRequest,
    conversation_id: uuid.UUID,
    data: schemas.UpdateConversationSchema,
) -> Conversation:
    conversation = Conversation.objects.get(
        id=conversation_id,
        owner=request.user,
    )

    if data.title is not None:
        conversation.title = data.title

    if data.message_branches is not None:
        conversation.message_branches = data.message_branches

    conversation.save()

    return conversation
