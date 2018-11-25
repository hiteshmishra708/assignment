from django.db import models

class Artists(models.Model):
    artistId = models.AutoField(primary_key=True)
    artistName = models.CharField(max_length=25)

class Tracks(models.Model):
    trackId = models.AutoField(primary_key=True)
    artist_id = models.ForeignKey(Artists, on_delete=models.CASCADE)
    trackName = models.CharField(max_length=100)
    country = models.CharField(max_length=100, null=True)
    genreName = models.CharField(max_length=100, null=True)
    releaseDate = models.DateField(null=True)