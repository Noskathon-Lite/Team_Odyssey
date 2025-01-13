# Generated by Django 5.1.4 on 2025-01-13 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_alter_hazard_hazardcategory_alter_hazard_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hazard',
            name='address',
            field=models.CharField(default='no address', max_length=500),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128, verbose_name='password'),
        ),
    ]
