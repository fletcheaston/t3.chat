# Generated by Django 5.2.2 on 2025-06-18 09:33

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chats", "0014_historicalsetting_visual_branch_vertical_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="historicalmessage",
            name="llm_completed",
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name="historicalmessage",
            name="tokens",
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name="message",
            name="llm_completed",
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name="message",
            name="tokens",
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
