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

admin.site.register(Conversation, SimpleHistoryAdmin)
admin.site.register(ConversationMember, SimpleHistoryAdmin)
admin.site.register(Tag, SimpleHistoryAdmin)
admin.site.register(ConversationToTag, SimpleHistoryAdmin)

admin.site.register(Message, SimpleHistoryAdmin)

admin.site.register(User, SimpleHistoryAdmin)
