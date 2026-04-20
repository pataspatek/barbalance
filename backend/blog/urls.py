from django.urls import path
from .views import (
    article_list, article_detail,
    admin_article_list, admin_article_detail, admin_article_create, admin_article_update, admin_article_delete
)

urlpatterns = [
    # Public endpoints - for general users
    path('articles/', article_list, name='article_list'),
    path('articles/<slug:slug>/', article_detail, name='article_detail'),
    
    # Admin endpoints - for superusers
    path('admin/articles/', admin_article_list, name='admin_article_list'),
    path('admin/articles/<int:pk>/', admin_article_detail, name='admin_article_detail'),
    path('admin/articles/create/', admin_article_create, name='admin_article_create'),
    path('admin/articles/<int:pk>/update/', admin_article_update, name='admin_article_update'),
    path('admin/articles/<int:pk>/delete/', admin_article_delete, name='admin_article_delete'),
]