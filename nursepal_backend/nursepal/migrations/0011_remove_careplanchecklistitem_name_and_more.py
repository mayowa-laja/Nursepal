# Generated by Django 5.0 on 2024-03-10 20:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursepal', '0010_remove_medication_frequency_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='careplanchecklistitem',
            name='name',
        ),
        migrations.AddField(
            model_name='careplanchecklistitem',
            name='predefined_item',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='nursepal.predefinedchecklistitem'),
        ),
    ]