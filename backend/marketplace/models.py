import os
import uuid

from django.conf import settings
from django.db import models


def product_asset_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return f"products/{instance.seller_id}/{uuid.uuid4()}{extension}"


def preview_asset_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return f"products/previews/{instance.seller_id}/{uuid.uuid4()}{extension}"


class Product(models.Model):
    class Category(models.TextChoices):
        REACT = "react", "React"
        AI = "ai", "AI"
        BACKEND = "backend", "Backend"
        UI_KITS = "ui-kits", "UI Kits"
        TEMPLATES = "templates", "Templates"

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=280)
    category = models.CharField(max_length=32, choices=Category.choices)
    tech_stack = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    preview_image = models.ImageField(upload_to=preview_asset_path, blank=True, null=True)
    downloadable_file = models.FileField(upload_to=product_asset_path)
    preview_model_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.title


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        unique_together = ("product", "user")

    def __str__(self):
        return f"{self.product.title}: {self.rating}"
