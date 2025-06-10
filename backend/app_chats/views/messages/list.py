from ninja import Router

from app_chats import schemas
from app_chats.models import Message
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.get(
    "",
    response={200: list[schemas.MessageSchema]},
    by_alias=True,
)
def list_my_messages(request: AuthenticatedHttpRequest) -> list[Message]:
    return Message.objects.filter(conversation__owner=request.user)
