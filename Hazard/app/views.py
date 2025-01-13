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
from django.http import HttpResponse
import io
import matplotlib.pyplot as plt
import osmnx as ox


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

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

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
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('firstname')
        last_name = request.data.get('lastname')

        if not email or not password or not first_name or not last_name:
            return Response({"error": "Email, password, first name, and last name are required."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Create OTPVerification instance
        otp_verification = OTPVerification.objects.create(
            email=email, firstname=first_name, lastname=last_name
        )
        otp_verification.generate_otp()

        # Step 2: Send OTP to user's email
        send_mail(
            subject='Your OTP Code',
            message=f'Your OTP code is {otp_verification.otp}. It is valid for 5 minutes.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )

        return Response({"message": "User registered successfully! Please verify OTP to complete registration."}, 
                        status=status.HTTP_201_CREATED)


# Generate OTP for email verification
class GenerateOTPAPIView(APIView):
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
        otp = request.data.get('otp')

        if not otp:
            return Response({"error": "OTP is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_verification = OTPVerification.objects.filter(otp=otp, is_verified=False).first()

            if not otp_verification:
                return Response({"error": "Invalid OTP or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if OTP is expired
            if timezone.now() - otp_verification.created_at > timedelta(minutes=5):
                otp_verification.delete()
                return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

            # Mark OTP as verified
            otp_verification.is_verified = True
            otp_verification.save()

            # Create User instance
            user = User.objects.create(
                email=otp_verification.email,
                firstname=otp_verification.firstname,
                lastname=otp_verification.lastname
            )
            user.set_password(otp_verification.otp)  # Set password to OTP (hashed)
            user.save()

            return Response({"message": "OTP verified and user information saved."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateMapAPIView(APIView):
    """
    API to generate a map image with a pinpointed location and return it as a PNG image.
    """

    def post(self, request):
        try:
            # Step 1: Validate input
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')

            if not latitude or not longitude:
                return Response(
                    {"error": "Both latitude and longitude are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                # Convert inputs to float
                latitude = float(latitude)
                longitude = float(longitude)
            except ValueError:
                return Response(
                    {"error": "Latitude and longitude must be valid numbers."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Step 2: Generate map with OSMNX
            radius = 500  # Fixed radius of 500 meters
            graph = ox.graph_from_point((latitude, longitude), dist=radius, network_type="drive")
            nodes, edges = ox.graph_to_gdfs(graph)

            # Step 3: Plot the map
            fig, ax = plt.subplots(figsize=(10, 10))
            edges.plot(ax=ax, linewidth=0.5, color="gray")
            ax.scatter(longitude, latitude, color="red", s=100, label="Exact Location")
            ax.legend()
            ax.set_title("Map with Exact Location")

            # Step 4: Save the plot to a BytesIO stream
            img_bytes = io.BytesIO()
            plt.savefig(img_bytes, format="png", bbox_inches="tight")
            plt.close(fig)  # Free memory
            img_bytes.seek(0)

            # Step 5: Return the image as a response
            return HttpResponse(img_bytes, content_type="image/png")

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)