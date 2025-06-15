from typing import Any

from django.middleware.csrf import get_token
from ninja import Router

from app_chats import models, schemas
from app_utils.requests import HttpRequest

router = Router()


@router.get(
    "/whoami",
    response={200: schemas.CsrfAuthUserSchema, 401: schemas.ErrorSchema},
    by_alias=True,
    auth=None,
)
def who_am_i(request: HttpRequest) -> Any:
    if request.user.is_authenticated:
        setting, _ = models.Setting.objects.get_or_create(user=request.user)

        return {
            "csrf_token": get_token(request),
            "user": request.user,
            "settings": setting,
        }

    return 401, schemas.ErrorSchema(detail=schemas.ErrorMessage.UNAUTHENTICATED_USER)
