from ninja import Router

from app_chats import models, schemas
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.post(
    "",
    response={200: schemas.ConversationSchema},
    by_alias=True,
)
def create_conversation(
    request: AuthenticatedHttpRequest,
    data: schemas.NewConversationSchema,
) -> models.Conversation:
    conversation = models.Conversation(
        id=data.id,
        title=data.title,
        owner=request.user,
    )

    conversation.db_tags.set(data.tag_ids)  # ty:ignore[possibly-unbound-attribute]

    conversation.save()

    models.ConversationMember.objects.create(
        conversation=conversation,
        user=request.user,
        added_by=request.user,
        llms_selected=[],
    )

    return conversation
