from django.contrib import admin

from .models import CartItem, Order, OrderItem


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "quantity", "created_at")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "buyer", "status", "total_amount", "created_at")
    list_filter = ("status",)
    inlines = [OrderItemInline]
