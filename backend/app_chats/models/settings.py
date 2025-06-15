from django.contrib.postgres.fields import ArrayField
from django.db import models
from simple_history.models import HistoricalRecords

from app_chats import schemas
from app_utils.models import DjangoModel

from .users import User


class SettingQuerySet(models.QuerySet["Setting"]):
    pass


class Setting(DjangoModel):
    ############################################################################
    # Normal fields
    user = models.ForeignKey(
        User,
        unique=True,
        related_name="settings",
        on_delete=models.PROTECT,
    )

    llm_nickname = models.TextField(default="")
    llm_job = models.TextField(default="")
    llm_traits = ArrayField(models.TextField(), default=list)
    llm_context = models.TextField(default="")

    llms_selected = ArrayField(
        models.TextField(
            choices=[(llm.value, llm.name) for llm in schemas.LargeLanguageModel],
        ),
        blank=True,
        default=list,
    )

    ############################################################################
    # Queryset managers
    objects = SettingQuerySet.as_manager()

    history = HistoricalRecords(table_name="setting_history")

    ############################################################################
    # Meta
    class Meta:
        db_table = "setting"

    ############################################################################
    # Properties

    ############################################################################
    # Methods
