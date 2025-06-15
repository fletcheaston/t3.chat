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

    llms_available = ArrayField(
        models.TextField(
            choices=[(llm.value, llm.name) for llm in schemas.LargeLanguageModel],
        ),
        blank=True,
        default=list,
    )

    # visual_theme = models.TextField(default="")
    # visual_theme_primary_override = models.TextField(default="")
    # visual_theme_secondary_override = models.TextField(default="")

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
    @property
    def developer_prompt(self) -> str:
        prompts = ["You are a helpful assistant.You may respond with markdown content."]

        if self.llm_nickname:
            prompts.append(f"The user's preferred name is '{self.llm_nickname}'.")

        if self.llm_job:
            prompts.append(f"The user's job is '{self.llm_job}'.")

        if self.llm_traits:
            prompts.append(
                f"The user has asked that you conform to these traits: '{', '.join(self.llm_traits)}'."
            )

        if self.llm_context:
            prompts.append(
                f"The user has provided additional context: '{self.llm_context}'."
            )

        return " ".join(prompts)

    ############################################################################
    # Methods
