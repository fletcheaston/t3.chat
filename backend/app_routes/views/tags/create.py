from ninja import Router

from app_routes import schemas
from app_users.models import ConversationTag
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
) -> ConversationTag:
    return ConversationTag.objects.create(
        id=data.id,
        title=data.title,
        color=data.color,
        owner=request.user,
    )
