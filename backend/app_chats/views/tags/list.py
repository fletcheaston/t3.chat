from ninja import Router

from app_chats import schemas
from app_chats.models import Tag
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.get(
    "",
    response={200: list[schemas.TagSchema]},
    by_alias=True,
)
def list_my_tags(
    request: AuthenticatedHttpRequest,
) -> list[Tag]:
    return Tag.objects.filter(owner=request.user)
