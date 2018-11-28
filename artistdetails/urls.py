from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views
 
router = routers.DefaultRouter(trailing_slash=False)

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^filter/$', views.filter, name='track-filter'),
    url(r'^tracks/$', views.TrackList, name='track-list'),
    url(r'^tracks/(?P<pk>[0-9]+)/$', views.TrackDetail, name='track-detail'),
    url(r'^$', views.index, name='index'),
]