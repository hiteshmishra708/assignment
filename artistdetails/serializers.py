from rest_framework import serializers
from .models import Artists, Tracks
from django.core.validators import URLValidator

class ArtistsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artists
        fields = ('artistId', 'artistName')

class TracksFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracks
        fields = ('artist_id', 'releaseDate')

class TrackAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracks
        fields = ('artist_id', 'trackName', 'releaseDate')

class TracksSerializer(serializers.ModelSerializer):
    artist = ArtistsSerializer(source='artist_id')
    class Meta:
        model = Tracks
        fields = ('artist', 'trackId', 'trackName', 'country', 'genreName', 'releaseDate')
