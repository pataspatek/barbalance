from django.urls import path
from .views import post_list, post_detail, admin_post_list_create, admin_post_detail

urlpatterns = [
    path('posts/', post_list, name='post_list'),
    path('posts/<slug:slug>/', post_detail, name='post_detail'),
    path('admin/posts/', admin_post_list_create, name='admin_post_list_create'),
    path('admin/posts/<int:pk>/', admin_post_detail, name='admin_post_detail'),
]