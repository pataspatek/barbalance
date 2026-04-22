from django.urls import path
from . import views

urlpatterns = [
    path('', views.client_list, name='client_list'),
    path('create/', views.client_create, name='client_create'),
    path('<str:username>/', views.client_detail, name='client_detail'),
    path('<str:username>/update/', views.client_update, name='client_update'),
    path('<str:username>/delete/', views.client_delete, name='client_delete'),
]
