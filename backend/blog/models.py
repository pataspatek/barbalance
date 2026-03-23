from django.db import models
from django.utils.text import slugify
import os

def recipe_image_path(instance, filename):
    """Generate file path for recipe images using the recipe slug"""
    ext = os.path.splitext(filename)[1]  # Get file extension
    return f'recipes/{instance.slug}{ext}'

class Recipe(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(max_length=500)
    image = models.ImageField(upload_to=recipe_image_path)
    ingredients = models.TextField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title