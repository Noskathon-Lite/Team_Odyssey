from rest_framework import serializers
from .models import User, Hazard
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'email', 'password', 'is_active', 'is_staff']

class HazardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hazard
        fields = ['id', 'HazardCategory', 'description', 'address', 'image', 'submittedAt', 'reportedBy', 'status']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'firstname', 'lastname', 'email']