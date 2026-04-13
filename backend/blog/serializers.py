from html import unescape
import os
import re

import cloudinary  # type: ignore
import cloudinary.uploader  # type: ignore
from cloudinary.utils import cloudinary_url  # type: ignore
from django.utils.html import escape, strip_tags
from rest_framework import serializers

from .models import Recipe


def _text_to_html_paragraphs(value):
    lines = [line.strip() for line in (value or '').splitlines() if line.strip()]
    if not lines:
        return ''
    return ''.join(f'<p>{escape(line)}</p>' for line in lines)


def _ingredients_text_to_html(value):
    lines = [line.strip() for line in (value or '').splitlines() if line.strip()]
    if not lines:
        return ''
    list_items = ''.join(f'<li>{escape(line)}</li>' for line in lines)
    return f'<ul>{list_items}</ul>'


def _ingredients_html_to_text(value):
    if not value:
        return ''
    matches = re.findall(r'<li[^>]*>(.*?)</li>', value, flags=re.IGNORECASE | re.DOTALL)
    if not matches:
        return strip_tags(value)
    return '\n'.join(unescape(strip_tags(match)).strip() for match in matches if strip_tags(match).strip())


def _destroy_cloudinary_image(image_field):
    if not image_field:
        return
    public_id = getattr(image_field, 'public_id', None)
    if not public_id and isinstance(image_field, str):
        public_id = image_field.strip()
    if not public_id:
        return
    try:
        cloudinary.uploader.destroy(public_id)
    except Exception:
        # Ignore cleanup errors to avoid blocking successful writes.
        pass


class RecipeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'image',
            'image_url',
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
            return image_url

        public_id = getattr(image_value, 'public_id', None)
        if not public_id and isinstance(image_value, str):
            public_id = image_value.strip()
        if not public_id:
            return None

        generated_url, _ = cloudinary_url(public_id, secure=True)
        if generated_url:
            return generated_url
        return None


class RecipeAdminSerializer(RecipeSerializer):
    description_text = serializers.CharField(write_only=True, required=False, allow_blank=True)
    ingredients_text = serializers.CharField(write_only=True, required=False, allow_blank=True)
    content_text = serializers.CharField(write_only=True, required=False, allow_blank=True)
    image_upload = serializers.ImageField(write_only=True, required=False, allow_null=True)
    plain_description = serializers.SerializerMethodField(read_only=True)
    plain_ingredients = serializers.SerializerMethodField(read_only=True)
    plain_content = serializers.SerializerMethodField(read_only=True)

    class Meta(RecipeSerializer.Meta):
        fields = RecipeSerializer.Meta.fields + [
            'description_text',
            'ingredients_text',
            'content_text',
            'image_upload',
            'plain_description',
            'plain_ingredients',
            'plain_content',
        ]
        extra_kwargs = {
            'description': {'required': False},
            'ingredients': {'required': False},
            'content': {'required': False},
            'image': {'required': False, 'allow_null': True},
        }

    def get_plain_description(self, obj):
        return strip_tags(obj.description or '').strip()

    def get_plain_ingredients(self, obj):
        return _ingredients_html_to_text(obj.ingredients or '')

    def get_plain_content(self, obj):
        return strip_tags(obj.content or '').strip()

    def validate(self, attrs):
        image_upload = attrs.get('image_upload')

        description_text = attrs.pop('description_text', None)
        ingredients_text = attrs.pop('ingredients_text', None)
        content_text = attrs.pop('content_text', None)

        if description_text is not None:
            attrs['description'] = _text_to_html_paragraphs(description_text)

        if ingredients_text is not None:
            attrs['ingredients'] = _ingredients_text_to_html(ingredients_text)

        if content_text is not None:
            attrs['content'] = _text_to_html_paragraphs(content_text)

        if self.instance is None:
            if not attrs.get('description'):
                raise serializers.ValidationError({'description': 'Description is required.'})
            if not attrs.get('ingredients'):
                raise serializers.ValidationError({'ingredients': 'Ingredients are required.'})
            if not image_upload and not attrs.get('image'):
                raise serializers.ValidationError({'image': 'Image file upload is required.'})

        # For create only: if instructions are omitted, mirror description.
        # For update, keep existing content unless caller explicitly sends content_text.
        if self.instance is None and not attrs.get('content'):
            attrs['content'] = attrs.get('description', '')

        return attrs

    def validate_image_upload(self, value):
        if value is None:
            return value

        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('Image must be 10MB or smaller.')

        valid_types = {'image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp'}
        valid_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        extension = os.path.splitext(value.name or '')[1].lower()

        if value.content_type not in valid_types and extension not in valid_extensions:
            raise serializers.ValidationError('Only jpg, jpeg, png, and webp images are allowed.')

        return value

    def _upload_image(self, image_upload=None):
        if image_upload:
            cfg = cloudinary.config()
            if not cfg.cloud_name or not cfg.api_key or not cfg.api_secret:
                raise serializers.ValidationError(
                    'Cloudinary is not configured on backend. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
                )
            result = cloudinary.uploader.upload(image_upload, folder='recipes')
            return result.get('public_id')
        return None

    def create(self, validated_data):
        image_upload = validated_data.pop('image_upload', None)

        if image_upload:
            try:
                uploaded_public_id = self._upload_image(image_upload=image_upload)
                if uploaded_public_id:
                    validated_data['image'] = uploaded_public_id
            except Exception as exc:
                raise serializers.ValidationError({'image': f'Image upload failed: {exc}'})

        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_upload = validated_data.pop('image_upload', None)

        if image_upload:
            try:
                uploaded_public_id = self._upload_image(image_upload=image_upload)
                if uploaded_public_id:
                    _destroy_cloudinary_image(instance.image)
                    validated_data['image'] = uploaded_public_id
            except Exception as exc:
                raise serializers.ValidationError({'image': f'Image upload failed: {exc}'})

        return super().update(instance, validated_data)