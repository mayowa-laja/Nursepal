# Generated by Django 5.0 on 2024-03-03 23:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nursepal', '0008_medication_quantity'),
    ]

    operations = [
        migrations.RenameField(
            model_name='symptoms',
            old_name='symptomDescripton',
            new_name='symptomDescription',
        ),
    ]