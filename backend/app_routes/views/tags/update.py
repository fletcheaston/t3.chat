import uuid

from ninja import Router

from app_routes import schemas
from app_users.models import ConversationTag
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
) -> ConversationTag:
    tag = ConversationTag.objects.get(id=tag_id, owner=request.user)

    tag.title = data.title
    tag.color = data.color
    tag.save()

    return tag
