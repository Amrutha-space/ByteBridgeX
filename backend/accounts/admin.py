from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("email", "username", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
    ordering = ("email",)
    search_fields = ("email", "username")

    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Marketplace", {"fields": ("role", "bio", "avatar_url")}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ("Marketplace", {"fields": ("email", "role", "bio", "avatar_url")}),
    )
