import uuid

from ninja import Router

from app_chats import schemas
from app_chats.models import Tag
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.put(
    "/{tag_id}",
    response={200: schemas.TagSchema},
    by_alias=True,
)
def update_tag(
    request: AuthenticatedHttpRequest,
    tag_id: uuid.UUID,
    data: schemas.UpdateTagSchema,
) -> Tag:
    tag = Tag.objects.get(id=tag_id, owner=request.user)

    tag.title = data.title
    tag.color = data.color
    tag.save()

    return tag
