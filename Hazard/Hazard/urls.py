from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin path
    path('', include('app.urls')),  # Root path, which will now call the HomeAPIView
]
