from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField  # type: ignore

class Recipe(models.Model):
    title: models.CharField = models.CharField(max_length=200)
    slug: models.SlugField = models.SlugField(unique=True, blank=True)
    description: models.TextField = models.TextField(max_length=500)
    image: CloudinaryField = CloudinaryField('image', blank=True, null=True, folder='recipes/')
    ingredients: models.TextField = models.TextField()
    content: models.TextField = models.TextField()
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title