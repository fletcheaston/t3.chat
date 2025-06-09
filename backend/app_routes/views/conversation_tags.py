import uuid

from ninja import Router
from pydantic_extra_types.color import Color

from app_users.models import ConversationTag
from app_utils.requests import AuthenticatedHttpRequest

from .schemas import Schema

router = Router(tags=["conversation tags"])


class ConversationTagSchema(Schema):
    id: uuid.UUID
    title: str
    color: Color


@router.get(
    "",
    response={200: list[ConversationTagSchema]},
    by_alias=True,
)
def list_my_conversation_tags(
    request: AuthenticatedHttpRequest,
) -> list[ConversationTag]:
    return ConversationTag.objects.filter(owner=request.user)


class NewConversationTagSchema(Schema):
    id: uuid.UUID
    title: str
    color: Color


@router.post(
    "",
    response={200: ConversationTagSchema},
    by_alias=True,
)
def create_conversation_tag(
    request: AuthenticatedHttpRequest,
    data: NewConversationTagSchema,
) -> ConversationTag:
    return ConversationTag.objects.create(
        id=data.id,
        title=data.title,
        color=data.color,
        owner=request.user,
    )


class UpdateConversationTagSchema(Schema):
    title: str
    color: Color


@router.put(
    "/{tag_id}",
    response={200: ConversationTagSchema},
    by_alias=True,
)
def update_conversation_tag(
    request: AuthenticatedHttpRequest,
    tag_id: uuid.UUID,
    data: UpdateConversationTagSchema,
) -> ConversationTag:
    tag = ConversationTag.objects.get(id=tag_id, owner=request.user)

    tag.title = data.title
    tag.color = data.color
    tag.save()

    return tag
