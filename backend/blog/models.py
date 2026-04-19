from django.db import models
from cloudinary.models import CloudinaryField # type: ignore


class Article(models.Model):
    title: models.CharField = models.CharField(max_length=200, unique=True)
    slug: models.SlugField = models.SlugField(unique=True, blank=True)
    content: models.TextField = models.TextField()
    image: CloudinaryField = CloudinaryField('image', folder='blog/', blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
