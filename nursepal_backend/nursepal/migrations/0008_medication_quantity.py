# Generated by Django 5.0 on 2024-02-26 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursepal', '0007_remove_vitals_bloodpressure_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='medication',
            name='quantity',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
