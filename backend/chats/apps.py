from django.apps import AppConfig

from . import jobs  # noqa: F401


class AppChatConfig(AppConfig):
    name = "chats"
    verbose_name = "Chats"
