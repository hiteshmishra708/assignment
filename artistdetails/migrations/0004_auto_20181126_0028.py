# Generated by Django 2.0.4 on 2018-11-25 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artistdetails', '0003_auto_20181125_1934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tracks',
            name='country',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='tracks',
            name='genreName',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='tracks',
            name='releaseDate',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='tracks',
            name='trackName',
            field=models.CharField(max_length=100),
        ),
    ]
