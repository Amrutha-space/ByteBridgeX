from decimal import Decimal

import stripe
from django.conf import settings
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import CartItem, Order, OrderItem
from orders.serializers import OrderSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


def mark_order_paid(order):
    if order.status != Order.Status.PAID:
        order.status = Order.Status.PAID
        order.save(update_fields=["status"])
    CartItem.objects.filter(user=order.buyer).delete()


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart_items = list(
            CartItem.objects.select_related("product", "product__seller").filter(user=request.user)
        )
        if not cart_items:
            return Response({"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        line_items = []
        total = Decimal("0.00")
        for item in cart_items:
            amount = Decimal(item.product.price) * item.quantity
            total += amount
            line_items.append(
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": item.product.title,
                            "description": item.product.short_description,
                        },
                        "unit_amount": int(Decimal(item.product.price) * 100),
                    },
                    "quantity": item.quantity,
                }
            )

        order = Order.objects.create(buyer=request.user, total_amount=total, status=Order.Status.PENDING)
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                seller=item.product.seller,
                price=item.product.price,
                quantity=item.quantity,
            )

        if settings.STRIPE_SECRET_KEY:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=line_items,
                success_url=f"{settings.STRIPE_SUCCESS_URL}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=settings.STRIPE_CANCEL_URL,
                metadata={"order_id": order.id, "buyer_id": request.user.id},
            )
            order.stripe_session_id = session.id
            order.save(update_fields=["stripe_session_id"])
            return Response({"session_id": session.id, "url": session.url}, status=status.HTTP_201_CREATED)

        # Local fallback for development when Stripe keys are not configured.
        order.status = Order.Status.PAID
        order.save(update_fields=["status"])
        CartItem.objects.filter(user=request.user).delete()
        return Response(
            {"session_id": f"local-{order.id}", "url": f"{settings.STRIPE_SUCCESS_URL}?local_order={order.id}"},
            status=status.HTTP_201_CREATED,
        )


class ConfirmCheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        session_id = request.data.get("session_id")
        if not session_id:
            return Response({"detail": "session_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.select_for_update().get(stripe_session_id=session_id, buyer=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if settings.STRIPE_SECRET_KEY:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status != "paid":
                order.status = Order.Status.FAILED
                order.save(update_fields=["status"])
                return Response({"detail": "Payment not completed."}, status=status.HTTP_400_BAD_REQUEST)

        mark_order_paid(order)
        return Response(OrderSerializer(order).data)


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    @transaction.atomic
    def post(self, request):
        payload = request.body
        signature = request.META.get("HTTP_STRIPE_SIGNATURE", "")

        if not settings.STRIPE_WEBHOOK_SECRET:
            return Response(
                {"detail": "Webhook secret is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=signature,
                secret=settings.STRIPE_WEBHOOK_SECRET,
            )
        except ValueError:
            return Response({"detail": "Invalid payload."}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response({"detail": "Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            session_id = session.get("id")
            if session_id:
                order = (
                    Order.objects.select_for_update()
                    .filter(stripe_session_id=session_id)
                    .first()
                )
                if order:
                    mark_order_paid(order)

        return Response({"received": True}, status=status.HTTP_200_OK)
