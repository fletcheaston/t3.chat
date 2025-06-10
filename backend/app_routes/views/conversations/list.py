from ninja import Router

from app_routes import schemas
from app_users.models import Conversation
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.get(
    "",
    response={200: list[schemas.ConversationSchema]},
    by_alias=True,
)
def list_my_conversations(request: AuthenticatedHttpRequest) -> list[Conversation]:
    return Conversation.objects.filter(owner=request.user).prefetch_related(
        "db_tags__conversations"
    )
