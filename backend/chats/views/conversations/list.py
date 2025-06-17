from ninja import Router

from chats import schemas
from chats.models import Conversation
from chats.requests import AuthenticatedHttpRequest

router = Router()


@router.get(
    "",
    response={200: list[schemas.ConversationSchema]},
    by_alias=True,
)
def list_my_conversations(request: AuthenticatedHttpRequest) -> list[Conversation]:
    return Conversation.objects.filter(owner=request.user)
