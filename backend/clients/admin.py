from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['user', 'first_name', 'last_name', 'age', 'phone', 'created_at']
    list_filter = ['created_at', 'age']
    search_fields = ['user__email', 'first_name', 'last_name', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('User Info', {'fields': ('user',)}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'age', 'phone')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )