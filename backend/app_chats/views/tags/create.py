from ninja import Router

from app_chats import schemas
from app_chats.models import Tag
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.post(
    "",
    response={200: schemas.TagSchema},
    by_alias=True,
)
def create_tag(
    request: AuthenticatedHttpRequest,
    data: schemas.NewTagSchema,
) -> Tag:
    return Tag.objects.create(
        id=data.id,
        title=data.title,
        color=data.color,
        owner=request.user,
    )
