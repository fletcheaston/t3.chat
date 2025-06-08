import os

from aenum import StrEnum, extend_enum
from django.http import HttpResponse
from ninja import Router

from app_utils.requests import HttpRequest

router = Router(tags=["static"])


@router.get(
    "",
    auth=None,
    include_in_schema=False,
)
def index_html(request: HttpRequest) -> HttpResponse:
    with open("app_routes/static/index.html") as f:
        content = f.read()

    return HttpResponse(content, content_type="text/html")


class StaticPath(StrEnum):
    pass


for root, _, files in os.walk("app_routes/static"):
    for file in files:
        file_path = os.path.join(root, file).replace("app_routes/static/", "")

        extend_enum(
            StaticPath,
            file_path,
            file_path,
        )


@router.get(
    "{path:path_enum}",
    auth=None,
    include_in_schema=False,
)
def static(request: HttpRequest, path_enum: StaticPath) -> HttpResponse:
    path = f"app_routes/static/{path_enum.value}"

    if path.endswith(".html"):
        with open(path) as f:
            content = f.read()

        return HttpResponse(content, content_type="text/html")

    if path.endswith(".js"):
        with open(path) as f:
            content = f.read()

        return HttpResponse(content, content_type="text/javascript")

    if path.endswith(".css"):
        with open(path) as f:
            content = f.read()

        return HttpResponse(content, content_type="text/css")

    if path.endswith(".ico"):
        with open(path, "rb") as f:
            content = f.read()

        return HttpResponse(content, content_type="image/x-icon")

    if path.endswith(".png"):
        with open(path, "rb") as f:
            content = f.read()

        return HttpResponse(content, content_type="image/png")

    raise ValueError(f"Unsupported path: {path}")
