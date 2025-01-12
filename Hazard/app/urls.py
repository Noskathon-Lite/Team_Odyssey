from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, HazardViewSet, HomeAPIView  # Import the correct viewsets

# Create a router and register your viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'hazards', HazardViewSet)

urlpatterns = [
    path('', HomeAPIView.as_view(), name='api_home'),  # Home route
    path('api/', include(router.urls)),  # Include the viewsets' routes under /api/
]
