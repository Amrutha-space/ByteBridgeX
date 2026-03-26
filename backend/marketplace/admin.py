from django.contrib import admin

from .models import Product, Review


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "seller", "category", "price", "is_published", "created_at")
    list_filter = ("category", "is_published")
    search_fields = ("title", "description", "slug")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "created_at")
    search_fields = ("product__title", "user__email")
