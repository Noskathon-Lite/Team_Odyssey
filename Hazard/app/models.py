from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import random, string

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email, password, and necessary fields"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    firstname = models.CharField(max_length=50, blank=True, null=True)  # Initially blank
    lastname = models.CharField(max_length=50, blank=True, null=True)   # Initially blank
    is_verified = models.BooleanField(default=False)  # Track if OTP is verified
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firstname', 'lastname']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.firstname} {self.lastname}" if self.firstname and self.lastname else self.email
    
class Hazard(models.Model):
    HAZARD_CATEGORIES = [
        ('traffic', 'Traffic'),
        ('infrastructure', 'Infrastructure'),
        ('environment', 'Environment'),
        ('others', 'Others'),
        
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('underInvestigation', 'Under Investigation'),
    ]

    HazardCategory = models.CharField(max_length=50, choices=HAZARD_CATEGORIES, default='others')
    description = models.CharField(max_length=500,default='No description provided')  # Updated from descriptionData to description
    address = models.CharField(max_length=500,default='no address')  # Updated from addressData to address
    image = models.ImageField(upload_to='hazards/')
    submittedAt = models.DateTimeField(auto_now_add=True)
    reportedBy = models.CharField(max_length=110, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.HazardCategory} at {self.address} ({self.status})"

class OTPVerification(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)

    def generate_otp(self):
        """Generate a random 6-digit OTP"""
        self.otp = ''.join(random.choices(string.digits, k=6))
        self.save()

    def __str__(self):
        return f"OTP for {self.email}"

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    city = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.latitude}, {self.longitude})"
