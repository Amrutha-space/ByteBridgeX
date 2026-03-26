from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CartItem, Order
from .serializers import CartItemSerializer, CheckoutPreviewSerializer, OrderSerializer


class CartViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.select_related("product", "product__seller").filter(user=self.request.user)

    def get_object(self):
        return self.get_queryset().get(pk=self.kwargs["pk"])

    @action(detail=False, methods=["get"])
    def summary(self, request):
        serializer = CheckoutPreviewSerializer(CheckoutPreviewSerializer.from_cart(self.get_queryset()))
        return Response(serializer.data)


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.prefetch_related("items__product", "items__seller").filter(buyer=self.request.user)

    @action(detail=False, methods=["get"])
    def earnings(self, request):
        if request.user.role not in {"seller", "admin"}:
            return Response({"detail": "Seller access required."}, status=status.HTTP_403_FORBIDDEN)

        sales = []
        total = 0
        for order in Order.objects.prefetch_related("items__product").filter(status="paid", items__seller=request.user).distinct():
            for item in order.items.filter(seller=request.user):
                amount = item.price * item.quantity
                total += amount
                sales.append(
                    {
                        "order_id": order.id,
                        "product_title": item.product.title,
                        "amount": amount,
                        "quantity": item.quantity,
                        "created_at": order.created_at,
                    }
                )
        return Response({"total_earnings": total, "sales": sales})
