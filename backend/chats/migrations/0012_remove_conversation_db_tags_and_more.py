# Generated by Django 5.2.2 on 2025-06-16 07:28

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("chats", "0011_conversationmember_hidden_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="conversation",
            name="db_tags",
        ),
        migrations.RemoveField(
            model_name="historicalconversationtotag",
            name="conversation",
        ),
        migrations.RemoveField(
            model_name="historicalconversationtotag",
            name="history_user",
        ),
        migrations.RemoveField(
            model_name="historicalconversationtotag",
            name="tag",
        ),
        migrations.RemoveField(
            model_name="historicaltag",
            name="history_user",
        ),
        migrations.RemoveField(
            model_name="historicaltag",
            name="owner",
        ),
        migrations.RemoveField(
            model_name="tag",
            name="owner",
        ),
        migrations.DeleteModel(
            name="ConversationToTag",
        ),
        migrations.DeleteModel(
            name="HistoricalConversationToTag",
        ),
        migrations.DeleteModel(
            name="HistoricalTag",
        ),
        migrations.DeleteModel(
            name="Tag",
        ),
    ]
