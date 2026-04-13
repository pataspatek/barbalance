from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField  # type: ignore
from django_ckeditor_5.fields import CKEditor5Field # type: ignore

class Recipe(models.Model):
    title: models.CharField = models.CharField(max_length=200)
    slug: models.SlugField = models.SlugField(unique=True, blank=True)
    description: CKEditor5Field = CKEditor5Field('description', config_name='default')
    image: CloudinaryField = CloudinaryField('image', blank=True, null=True, folder='recipes/')
    ingredients: CKEditor5Field = CKEditor5Field('ingredients', config_name='default')
    content: CKEditor5Field = CKEditor5Field('content', config_name='extends')
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def _build_unique_slug(self):
        base_slug = slugify(self.title) or 'recipe'
        candidate = base_slug
        suffix = 2

        while Recipe.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
            candidate = f'{base_slug}-{suffix}'
            suffix += 1

        return candidate

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._build_unique_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title