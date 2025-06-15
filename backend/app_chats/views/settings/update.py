from ninja import Router

from app_chats import models, schemas
from app_utils.requests import AuthenticatedHttpRequest

router = Router()


@router.patch(
    "",
    response={200: schemas.SettingSchema},
    by_alias=True,
)
def update_my_settings(
    request: AuthenticatedHttpRequest,
    data: schemas.UpdateSettingSchema,
) -> models.Setting:
    setting, _ = models.Setting.objects.get_or_create(user=request.user)

    if data.llm_nickname is not None:
        setting.llm_nickname = data.llm_nickname

    if data.llm_job is not None:
        setting.llm_job = data.llm_job

    if data.llm_traits is not None:
        setting.llm_traits = data.llm_traits

    if data.llm_context is not None:
        setting.llm_context = data.llm_context
        setting.llm_traits = data.llm_traits

    if data.llms_available is not None:
        setting.llms_available = data.llms_available

    setting.save()

    return setting
