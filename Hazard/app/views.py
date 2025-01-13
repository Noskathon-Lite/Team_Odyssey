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
import base64



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
        firstname = request.data.get('firstname')
        lastname = request.data.get('lastname')

        if not email or not password or not firstname or not lastname:
            return Response({"error": "Email, password, first name, and last name are required."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Create OTPVerification instance
        otp_verification = OTPVerification.objects.create(
            email=email, firstname=firstname, lastname=lastname
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
    API to generate a map image with a pinpointed location and return it as bytecode.
    """

    def post(self, request):
        try:
            # Step 1: Validate input
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')

            if latitude is None or longitude is None:
                return Response({"error": "Latitude and longitude are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Step 2: Generate map
            location_point = (latitude, longitude)
            try:
                G = ox.graph_from_point(location_point, dist=500, network_type='all')
            except Exception as e:
                return Response({"error": f"Error fetching data from OSM: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if G is None or len(G.nodes) == 0:
                return Response({"error": "No data elements in server response. Check query location/filters and log."}, status=status.HTTP_400_BAD_REQUEST)

            fig, ax = ox.plot_graph(G, show=False, close=False)
            ax.scatter(longitude, latitude, c='red', s=100, zorder=5)  # Pinpoint the location

            # Step 3: Save map to a PNG image
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            plt.close(fig)
            buf.seek(0)

            # Step 4: Convert image to bytecode
            image_bytecode = base64.b64encode(buf.read()).decode('utf-8')

            return Response({"image_bytecode": image_bytecode}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)