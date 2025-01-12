from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import User, Hazard, OTPVerification
from .serializers import UserSerializer, HazardSerializer, RegistrationSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView


# Define UserViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Define HazardViewSet
class HazardViewSet(viewsets.ModelViewSet):
    queryset = Hazard.objects.all()
    serializer_class = HazardSerializer

# Define HomeAPIView
class HomeAPIView(APIView):
    def get(self, request):
        return Response({"message": "Welcome to the API!"})

# Define LoginAPIView
class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            })
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Define ProtectedAPIView for testing token-based authentication
class ProtectedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated!"})

# Register a new user
class RegisterAPIView(APIView):
    def post(self, request):
        # Step 1: Register user details (email, password, etc.)
        serializer = RegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the user instance
            user = serializer.save()

            # Step 2: Generate OTP for the user
            otp_verification = OTPVerification.objects.create(email=user.email)
            otp_verification.generate_otp()

            # Step 3: Send OTP to user's email
            send_mail(
                subject='Your OTP Code',
                message=f'Your OTP code is {otp_verification.otp}. It is valid for 5 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
            )

            return Response({"message": "User registered successfully! Please verify OTP to complete registration."}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Generate OTP for email verification
class GenerateOTPAPIView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_verification = OTPVerification.objects.create(email=email)
            otp_verification.generate_otp()

            # Send OTP to user's email
            send_mail(
                subject='Your OTP Code',
                message=f'Your OTP code is {otp_verification.otp}. It is valid for 5 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
            )

            return Response({"message": "OTP sent successfully to the email!"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Verify OTP for user
class VerifyOTPAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_verification = OTPVerification.objects.filter(email=email, otp=otp, is_verified=False).first()

            if not otp_verification:
                return Response({"error": "Invalid OTP or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if OTP is expired (5 minutes)
            if timezone.now() - otp_verification.created_at > timedelta(minutes=5):
                otp_verification.delete()
                return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

            otp_verification.is_verified = True
            otp_verification.save()

            # Now update the User object with the required fields
            user = User.objects.get(email=email)
            user.firstname = request.data.get('firstname')
            user.lastname = request.data.get('lastname')
            user.save()

            return Response({"message": "OTP verified and user information updated."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
