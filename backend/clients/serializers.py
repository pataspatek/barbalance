from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Client
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'age', 'phone', 'created_at', 'updated_at']
