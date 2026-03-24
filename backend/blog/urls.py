from django.urls import path
from .views import post_list, post_detail

urlpatterns = [
    path('posts/', post_list, name='post_list'),
    path('posts/<slug:slug>/', post_detail, name='post_detail'),
]