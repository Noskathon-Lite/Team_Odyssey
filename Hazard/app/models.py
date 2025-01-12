from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'  # Use email for login
    REQUIRED_FIELDS = ['firstname', 'lastname']

    def __str__(self):
        return self.email

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

    HazardCategory = models.CharField(max_length=50, choices=HAZARD_CATEGORIES)
    description = models.CharField(max_length=500)
    address = models.CharField(max_length=50)
    image = models.ImageField(upload_to='hazards/')
    submittedAt = models.DateTimeField(auto_now_add=True)
    reportedBy = models.CharField(max_length=110, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.HazardCategory} at {self.address} ({self.status})"