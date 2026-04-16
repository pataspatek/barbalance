from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField  # type: ignore

class Recipe(models.Model):
    title: models.CharField = models.CharField(max_length=200, unique=True)
    slug: models.SlugField = models.SlugField(unique=True, blank=True)
    description: models.TextField = models.TextField(blank=True, null=True)
    image: CloudinaryField = CloudinaryField('image', blank=True, null=True, folder='recipes/')
    ingredients: models.TextField = models.TextField(blank=True, null=True)
    content: models.TextField = models.TextField(blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def _build_unique_slug(self):
        return slugify(self.title) or 'recipe'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._build_unique_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title