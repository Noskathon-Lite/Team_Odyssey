# Generated by Django 5.1.4 on 2025-01-12 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_user_is_verified_alter_user_firstname_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='otpverification',
            name='firstname',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='otpverification',
            name='lastname',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
