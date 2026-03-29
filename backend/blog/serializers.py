from rest_framework import serializers
from .models import Recipe

class RecipeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'slug', 'description', 'image', 'image_url', 'ingredients', 'content', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None