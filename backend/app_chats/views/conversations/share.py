from typing import Any

import jwt
from ninja import Router

from app_chats import models, schemas
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.post(
    "/{conversation_id}/share",
    response={200: schemas.ShareLinkSchema},
    by_alias=True,
)
def generate_share_link(
    request: AuthenticatedHttpRequest,
    conversation_id: str,
) -> dict:
    """Generate a shareable link for a conversation."""
    conversation = models.Conversation.objects.get(
        id=conversation_id,
        owner=request.user,
    )

    token = conversation.generate_share_link()

    return {"token": token}


@router.post(
    "/join/{token}",
    response={200: schemas.ConversationSchema, 400: schemas.ErrorSchema},
    by_alias=True,
)
def join_conversation(
    request: AuthenticatedHttpRequest,
    data: schemas.JoinConversationSchema,
) -> Any:
    """Join a conversation using a share link."""
    try:
        conversation = models.Conversation.validate_share_link(data.token)

        # Check if user is already a member
        if not conversation.db_members.filter(user=request.user).exists():
            models.ConversationMember.objects.create(
                conversation=conversation,
                user=request.user,
                added_by=conversation.owner,
                llms_selected=[],
            )

        return conversation

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return 400, schemas.ErrorSchema(detail=schemas.ErrorMessage.INVALID_TOKEN)

    except models.Conversation.DoesNotExist:
        return 400, schemas.ErrorSchema(
            detail=schemas.ErrorMessage.RESOURCE_DOES_NOT_EXIST
        )
