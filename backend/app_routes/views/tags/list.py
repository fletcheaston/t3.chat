from ninja import Router

from app_routes import schemas
from app_users.models import ConversationTag
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.get(
    "",
    response={200: list[schemas.TagSchema]},
    by_alias=True,
)
def list_my_tags(
    request: AuthenticatedHttpRequest,
) -> list[ConversationTag]:
    return ConversationTag.objects.filter(owner=request.user)
