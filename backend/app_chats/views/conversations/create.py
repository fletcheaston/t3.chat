from ninja import Router

from app_chats import schemas
from app_chats.models import Conversation
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
) -> Conversation:
    conversation = Conversation(
        id=data.id,
        title=data.title,
        owner=request.user,
    )

    conversation.db_tags.set(data.tag_ids)  # ty:ignore[possibly-unbound-attribute]

    conversation.save()

    return conversation
