from django.db import models
from users.models import User

class Client(models.Model):
    user: models.OneToOneField = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    first_name: models.CharField = models.CharField(max_length=100, blank=True, null=True)
    last_name: models.CharField = models.CharField(max_length=100, blank=True, null=True)
    age: models.IntegerField = models.IntegerField(blank=True, null=True)
    phone: models.CharField = models.CharField(max_length=20, blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
