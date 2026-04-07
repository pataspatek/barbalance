from django.db import models
from users.models import User

class Client(models.Model):
    user: models.OneToOneField = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    phone: models.CharField = models.CharField(max_length=20, blank=True, null=True)
    company: models.CharField = models.CharField(max_length=255, blank=True, null=True)
    address: models.CharField = models.CharField(max_length=255, blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
