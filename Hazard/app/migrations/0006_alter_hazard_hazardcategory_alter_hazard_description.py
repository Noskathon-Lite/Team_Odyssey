# Generated by Django 5.1.4 on 2025-01-13 03:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_hazard_hazardcategory_alter_hazard_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hazard',
            name='HazardCategory',
            field=models.CharField(choices=[('traffic', 'Traffic'), ('infrastructure', 'Infrastructure'), ('environment', 'Environment'), ('others', 'Others')], default='others', max_length=50),
        ),
        migrations.AlterField(
            model_name='hazard',
            name='description',
            field=models.CharField(default='No description provided', max_length=500),
        ),
    ]
