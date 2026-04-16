from django.urls import path
from .views import (
    post_list, post_detail,
    admin_post_list, admin_post_detail, admin_post_create, admin_post_update, admin_post_delete
)

urlpatterns = [
    # Public endpoints
    path('posts/', post_list, name='post_list'),
    path('posts/<slug:slug>/', post_detail, name='post_detail'),
    
    # Admin endpoints
    path('admin/posts/', admin_post_list, name='admin_post_list'),
    path('admin/posts/<int:pk>/', admin_post_detail, name='admin_post_detail'),
    path('admin/posts/create/', admin_post_create, name='admin_post_create'),
    path('admin/posts/<int:pk>/update/', admin_post_update, name='admin_post_update'),
    path('admin/posts/<int:pk>/delete/', admin_post_delete, name='admin_post_delete'),
]