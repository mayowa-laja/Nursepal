# Generated by Django 5.0 on 2024-02-24 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursepal', '0006_alter_vitals_bloodpressure_alter_vitals_heartrate_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vitals',
            name='bloodPressure',
        ),
        migrations.AddField(
            model_name='vitals',
            name='diastolicBloodPressure',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='vitals',
            name='systolicBloodPressure',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]