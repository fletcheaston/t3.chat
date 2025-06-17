from django.http import HttpResponse
from ninja import Router

from chats.requests import HttpRequest

router = Router(tags=["static"])


@router.get(
    "",
    auth=None,
    include_in_schema=False,
)
def index(request: HttpRequest) -> HttpResponse:
    with open("chats/frontend/index.html") as f:
        content = f.read()

    return HttpResponse(content, content_type="text/html")


@router.get(
    "{path:path}",
    auth=None,
    include_in_schema=False,
)
def catch_all(request: HttpRequest, path: str) -> HttpResponse:
    with open("chats/frontend/index.html") as f:
        content = f.read()

    return HttpResponse(content, content_type="text/html")
