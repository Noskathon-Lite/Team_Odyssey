from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, HazardViewSet, HomeAPIView, LoginAPIView, ProtectedAPIView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'hazards', HazardViewSet)

urlpatterns = [
    path('', HomeAPIView.as_view(), name='home'),
    path('api/', include(router.urls)),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/protected/', ProtectedAPIView.as_view(), name='protected'),
]