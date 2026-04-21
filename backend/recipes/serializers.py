from cloudinary.utils import cloudinary_url  # type: ignore
from rest_framework import serializers

from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    image_upload = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Recipe
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'image',
            'image_url',
            'image_upload',
            'ingredients',
            'content',
            'created_at',
            'updated_at',
        ]

    def get_image_url(self, obj):
        image_value = obj.image
        if not image_value:
            return None

        image_url = getattr(image_value, 'url', None)
        if image_url:
            # Zajistit HTTPS místo HTTP
            return image_url.replace('http://', 'https://')

        public_id = getattr(image_value, 'public_id', None)
        if not public_id and isinstance(image_value, str):
            public_id = image_value.strip()
        if not public_id:
            return None

        generated_url, _ = cloudinary_url(public_id, secure=True)
        if generated_url:
            return generated_url
        return None

    def create(self, validated_data):
        image_upload = validated_data.pop('image_upload', None)
        recipe = Recipe.objects.create(**validated_data)
        if image_upload:
            recipe.image = image_upload
            recipe.save()
        return recipe

    def update(self, instance, validated_data):
        image_upload = validated_data.pop('image_upload', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image_upload:
            instance.image = image_upload
        instance.save()
        return instance

