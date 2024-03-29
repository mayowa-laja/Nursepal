# Generated by Django 5.0 on 2024-02-24 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursepal', '0005_predefinedchecklistitem_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vitals',
            name='bloodPressure',
            field=models.CharField(max_length=15),
        ),
        migrations.AlterField(
            model_name='vitals',
            name='heartRate',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='vitals',
            name='respiratoryRate',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='vitals',
            name='temperature',
            field=models.DecimalField(decimal_places=2, max_digits=5),
        ),
    ]
