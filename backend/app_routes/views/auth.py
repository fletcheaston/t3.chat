from typing import Any, Literal

import httpx
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.middleware.csrf import get_token
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from ninja import Router
from pydantic import ValidationError

from app_users.models import User
from app_utils.requests import HttpRequest
from server.env import SETTINGS

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


class GitHubCallbackSchema(Schema):
    access_token: str
    token_type: Literal["bearer"]
    scope: Literal["user:email"]


class GitHubUserSchema(Schema):
    email: str
    name: str


@router.get(
    "/github-callback",
    response={200: None, 400: ErrorSchema},
    by_alias=True,
    auth=None,
)
def github_callback(request: HttpRequest, code: str) -> Any:
    # If the user is already authenticated, just redirect
    if request.user.is_authenticated:
        return

    # Authenticate with GitHub
    gh_callback_response = httpx.post(
        "https://github.com/login/oauth/access_token",
        headers={
            "Accept": "application/vnd.github+json",
        },
        json={
            "client_id": SETTINGS.GITHUB_OAUTH_CLIENT_ID,
            "client_secret": SETTINGS.GITHUB_OAUTH_CLIENT_SECRET,
            "code": code,
        },
    )

    try:
        gh_callback = GitHubCallbackSchema.model_validate(gh_callback_response.json())
    except ValidationError:
        return 400, ErrorSchema(detail=ErrorMessage.INVALID_TOKEN)

    gh_user_response = httpx.get(
        "https://api.github.com/user",
        headers={
            "Authorization": f"Bearer {gh_callback.access_token}",
            "Accept": "application/vnd.github+json",
        },
    )

    try:
        gh_user = GitHubUserSchema.model_validate(gh_user_response.json())
    except ValidationError:
        return 400, ErrorSchema(detail=ErrorMessage.INVALID_TOKEN)

    # Create the user in our database if they don't exist yet
    user, _ = User.objects.get_or_create(
        email=gh_user.email,
        name=gh_user.name,
    )

    # Log the user in
    django_login(request, user)

    # Redirect them back to the app
    return redirect("/")
