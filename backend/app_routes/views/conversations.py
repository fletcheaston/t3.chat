import uuid

from ninja import Router

from app_users.models import Conversation
from app_utils.requests import AuthenticatedHttpRequest

from .conversation_tags import ConversationTagSchema
from .schemas import Schema

router = Router(tags=["conversation"])


class ConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tags: list[ConversationTagSchema]


@router.get(
    "",
    response={200: list[ConversationSchema]},
    by_alias=True,
)
def list_my_conversations(request: AuthenticatedHttpRequest) -> list[Conversation]:
    return Conversation.objects.filter(owner=request.user).prefetch_related(
        "db_tags__conversations"
    )


class NewConversationSchema(Schema):
    id: uuid.UUID
    title: str
    tag_ids: list[uuid.UUID]


@router.post(
    "",
    response={200: ConversationSchema},
    by_alias=True,
)
def create_conversation(
    request: AuthenticatedHttpRequest,
    data: NewConversationSchema,
) -> Conversation:
    conversation = Conversation.objects.create(
        id=data.id,
        title=data.title,
        owner=request.user,
    )

    conversation.db_tags.set(data.tag_ids)

    return conversation


class UpdateConversationSchema(Schema):
    title: str
    tag_ids: list[uuid.UUID]


@router.put(
    "/{conversation_id}",
    response={200: ConversationSchema},
    by_alias=True,
)
def update_conversation(
    request: AuthenticatedHttpRequest,
    conversation_id: uuid.UUID,
    data: UpdateConversationSchema,
) -> Conversation:
    conversation = Conversation.objects.get(
        id=conversation_id,
        owner=request.user,
    )

    conversation.title = data.title
    conversation.db_tags.set(data.tag_ids)

    conversation.save()

    return conversation
