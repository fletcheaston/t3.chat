import uuid

from ninja import Router

from app_routes import schemas
from app_users.models import Conversation
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.put(
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

    conversation.title = data.title
    conversation.db_tags.set(data.tag_ids)

    conversation.save()

    return conversation
