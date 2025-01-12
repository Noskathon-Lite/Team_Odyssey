from rest_framework import serializers
from .models import User, Hazard
from .models import OTPVerification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'email', 'password', 'is_active', 'is_staff']

class HazardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hazard
        fields = ['id', 'HazardCategory', 'description', 'address', 'image', 'submittedAt', 'reportedBy', 'status']

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [ 'email', 'password']

    def validate(self, data):
       
        
        # Check if the email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})
        
        return data

    def create(self, validated_data):
        # Create a user with the provided password
        user = User.objects.create_user(
           
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTPVerification
        fields = ['email', 'otp']