from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, HazardViewSet, HomeAPIView ,LoginAPIView, ProtectedAPIView, RegisterAPIView, GenerateOTPAPIView, VerifyOTPAPIView# Import the correct viewsets

# Create a router and register your viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'hazards', HazardViewSet)

urlpatterns = [
    path('', HomeAPIView.as_view(), name='api_home'),  # Home route
    path('api/', include(router.urls)),  # Include the viewsets' routes under /api/
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/protected/', ProtectedAPIView.as_view(), name='protected'),
    path('generate-otp/', GenerateOTPAPIView.as_view(), name='generate_otp'),
    path('api/verify-otp/', VerifyOTPAPIView.as_view(), name='verify-otp'),
]
