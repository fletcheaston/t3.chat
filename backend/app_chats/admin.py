from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from .models import (
    Conversation,
    ConversationMember,
    ConversationToTag,
    Message,
    Tag,
    User,
)

# Disable this action across the whole admin panel
admin.site.disable_action("delete_selected")


class ConversationAdmin(SimpleHistoryAdmin):
    ordering = ["created"]
    list_display = ["id", "created", "title", "owner"]


admin.site.register(Conversation, ConversationAdmin)
admin.site.register(ConversationMember, SimpleHistoryAdmin)
admin.site.register(Tag, SimpleHistoryAdmin)
admin.site.register(ConversationToTag, SimpleHistoryAdmin)


class MessageAdmin(SimpleHistoryAdmin):
    ordering = ["-created"]
    list_display = ["id", "reply_to_id", "conversation_id", "created", "author", "llm"]


admin.site.register(Message, MessageAdmin)


class UserAdmin(SimpleHistoryAdmin):
    list_display = ["id", "name", "email", "username", "last_login"]


admin.site.register(User, UserAdmin)
