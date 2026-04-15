from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.crypto import get_random_string


class CustomUserManager(BaseUserManager):
    def _generate_unique_username(self):
        """Generate usernames like user123456 and ensure uniqueness."""
        while True:
            candidate = f"user{get_random_string(length=6, allowed_chars='0123456789')}"
            if not self.model.objects.filter(username=candidate).exists():
                return candidate

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        if not extra_fields.get('username'):
            extra_fields['username'] = self._generate_unique_username()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager() # type: ignore

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.__class__.objects._generate_unique_username()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email