import json

from django.db.models import Avg
from django.utils.text import slugify
from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Product, Review


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ("id", "user", "rating", "comment", "created_at")
        read_only_fields = ("id", "created_at", "user")


class ProductSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    downloadable_file = serializers.FileField(write_only=True, required=False)
    preview_image = serializers.SerializerMethodField()
    preview_image_file = serializers.ImageField(
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "seller",
            "title",
            "slug",
            "description",
            "short_description",
            "category",
            "tech_stack",
            "tags",
            "price",
            "average_rating",
            "review_count",
            "preview_image",
            "preview_image_file",
            "downloadable_file",
            "preview_model_url",
            "is_published",
            "reviews",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "seller",
            "average_rating",
            "review_count",
            "reviews",
            "created_at",
            "updated_at",
            "preview_image",
        )

    def get_preview_image(self, obj):
        try:
            return obj.preview_image.url if obj.preview_image else None
        except Exception:
            return None

    def _normalize_json_list(self, value):
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                return [item.strip() for item in value.split(",") if item.strip()]
        raise serializers.ValidationError("Expected a list or a JSON list string.")

    def validate_slug(self, value):
        if Product.objects.filter(slug=value).exclude(
            pk=self.instance.pk if self.instance else None
        ).exists():
            raise serializers.ValidationError("This slug is already in use.")
        return value

    def validate_tech_stack(self, value):
        return self._normalize_json_list(value)

    def validate_tags(self, value):
        return self._normalize_json_list(value)

    def create(self, validated_data):
        preview_image_file = validated_data.pop("preview_image_file", None)
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify(validated_data["title"])
        if preview_image_file is not None:
            validated_data["preview_image"] = preview_image_file
        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        preview_image_file = validated_data.pop("preview_image_file", None)
        if not validated_data.get("slug") and validated_data.get("title"):
            validated_data["slug"] = slugify(validated_data["title"])
        if preview_image_file is not None:
            validated_data["preview_image"] = preview_image_file
        return super().update(instance, validated_data)


class ProductListSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    preview_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "seller",
            "title",
            "slug",
            "short_description",
            "category",
            "tech_stack",
            "tags",
            "price",
            "average_rating",
            "review_count",
            "preview_image",
            "preview_model_url",
            "created_at",
        )

    def get_preview_image(self, obj):
        try:
            return obj.preview_image.url if obj.preview_image else None
        except Exception:
            return None


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("rating", "comment")

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        review = Review.objects.create(**validated_data)
        product = review.product
        aggregate = product.reviews.aggregate(avg=Avg("rating"))
        product.average_rating = aggregate["avg"] or 0
        product.review_count = product.reviews.count()
        product.save(update_fields=["average_rating", "review_count"])
        return review
