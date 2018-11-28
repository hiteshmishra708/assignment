from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Artists, Tracks
from . import serializers
from rest_framework.decorators import api_view
from datetime import datetime
from django.db.models import Q

def index(request, path=''):
    """
    The home page. This displays the single-page app.
    """
    return render(request, 'index.html')

@api_view(['GET', 'POST'])
def TrackList(request):
    """
    List all tracks, or create a new snippet.
    """
    if request.method == 'GET':
        tracks = Tracks.objects.all()
        serializer = serializers.TracksSerializer(tracks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            artist, created = Artists.objects.get_or_create(artistName=request.data["artistName"])
            request.data["artist_id"] = artist.artistId
            serializer = serializers.TrackAddSerializer(data=request.data)
            response = None
            try:
                request.data["releaseDate"] = datetime.strptime(request.data["releaseDate"], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d")
            except:
                print("date is formated")
            if serializer.is_valid():
                serializer.save()
                response = {
                    "response": "SUCCESS",
                    "ArtistId": artist.artistId,
                    "message": "Artist added successfully"
                }
                return Response(response)
        except:
            response = {
                "response": "FAIL"
            }
            return Response(response)

@api_view(['POST'])
def filter(request):
    """
    Filter all tracks or artist id or release date.
    """
    try:
        try:
            request.data["releaseDate"] = datetime.strptime(request.data["releaseDate"], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d")
        except:
            print("date is formated")
        tracks = Tracks.objects.filter(Q(artist_id=request.data["artist_id"]) & Q(releaseDate__range=["1990-01-01", request.data["releaseDate"]]))
        serializer = serializers.TracksSerializer(tracks, many=True)
        msg = None
        if len(serializer.data) > 0:
            msg = "Tracks found"
        else:
            msg = "Tracks not found"
        response = {
                "response": "SUCCESS",
                "message": msg,
                "records": serializer.data,
            }
        return Response(response)
    except:
        response = {
            "response": "FAIL"
        }
        return Response(response)


@api_view(['GET', 'PUT', 'DELETE'])
def TrackDetail(request, pk):
    """
    Retrieve, update or delete a tracks instance.
    """
    try:
        track = Tracks.objects.get(pk=pk)

        if request.method == 'GET':
            serializer = serializers.TracksSerializer(track)
            response = {
                "response": "SUCCESS",
                "trackName": serializer.data["trackName"],
                "country": serializer.data["country"],
                "primaryGenreName": serializer.data["genreName"]
            }
            return Response(response)

        elif request.method == 'PUT':
            data = {
                "artistId": request.data["artist_id"],
                "artistName": request.data["artistName"]
            }
            artist = Artists.objects.get(artistId=request.data["artist_id"])
            serializer = serializers.ArtistsSerializer(artist, data=data)
            response = None
            try:
                request.data["releaseDate"] = datetime.strptime(request.data["releaseDate"], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d")
            except:
                print("date is formated")
            if serializer.is_valid():
                serializer.save()
            serializer = serializers.TrackAddSerializer(track, data=request.data)
            if serializer.is_valid():
                serializer.save()
                response = {
                    "response": "SUCCESS",
                    "message": "Artist record updated successfully"
                }
                return Response(response)

        elif request.method == 'DELETE':
            track.delete()
            response = {
                "response": "SUCCESS",
                "message": "Artist record deleted successfully"
            }
            return Response(response)
    except:
        response = {
            "response": "FAIL"
        }
        return Response(response)