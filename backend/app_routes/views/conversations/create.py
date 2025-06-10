from ninja import Router

from app_routes import schemas
from app_users.models import Conversation
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
    conversation = Conversation.objects.create(
        id=data.id,
        title=data.title,
        owner=request.user,
    )

    conversation.db_tags.set(data.tag_ids)

    return conversation
