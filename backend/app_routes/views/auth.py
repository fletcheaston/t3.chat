from typing import Any

from django.contrib.auth import logout as django_logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from ninja import Router

from app_utils.requests import HttpRequest

from .schemas import ErrorMessage, ErrorSchema, Schema

router = Router(tags=["auth"])


class AuthUserSchema(Schema):
    name: str
    email: str


class CsrfAuthUserSchema(Schema):
    csrf_token: str
    auth_user: AuthUserSchema


@router.get(
    "/login",
    response={200: CsrfAuthUserSchema, 401: ErrorSchema},
    by_alias=True,
    auth=None,
)
def check_login(request: HttpRequest) -> Any:
    if request.user.is_authenticated:
        return {
            "csrf_token": get_token(request),
            "auth_user": request.user,
        }

    return 401, ErrorSchema(detail=ErrorMessage.UNAUTHENTICATED_USER)


@router.post(
    "/logout",
    response={200: None},
    by_alias=True,
    auth=None,
)
@csrf_exempt
def logout(request: HttpRequest) -> Any:
    django_logout(request)
