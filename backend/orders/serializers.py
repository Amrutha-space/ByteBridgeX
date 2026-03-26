from decimal import Decimal

from rest_framework import serializers

from marketplace.models import Product
from marketplace.serializers import ProductListSerializer

from .models import CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ("id", "product", "product_id", "quantity", "created_at")
        read_only_fields = ("id", "created_at", "product")

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, is_published=True).exists():
            raise serializers.ValidationError("Selected product does not exist.")
        return value

    def create(self, validated_data):
        user = self.context["request"].user
        product_id = validated_data.pop("product_id")
        quantity = validated_data.get("quantity", 1)
        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product_id=product_id,
            defaults={"quantity": quantity},
        )
        if not created:
            cart_item.quantity = quantity
            cart_item.save(update_fields=["quantity"])
        return cart_item


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "product", "price", "quantity")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ("id", "status", "total_amount", "stripe_session_id", "items", "created_at")


class CheckoutPreviewSerializer(serializers.Serializer):
    cart_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    item_count = serializers.IntegerField()

    @staticmethod
    def from_cart(cart_items):
        total = sum(Decimal(item.product.price) * item.quantity for item in cart_items)
        return {
            "cart_total": total,
            "item_count": sum(item.quantity for item in cart_items),
        }
