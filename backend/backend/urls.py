"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recipes/', include('recipes.urls')),
    path('api/auth/', include('users.urls')),
    path('api/clients/', include('clients.urls')),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('ckeditor5/', include('django_ckeditor_5.urls')),
]
