from django.urls import path
from . import views

app_name = 'location'

urlpatterns = [
    path('add/', views.add_location, name='add_location'),
    path('', views.location_list, name='location_list'),
]
