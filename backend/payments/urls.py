from django.urls import path

from .views import ConfirmCheckoutView, CreateCheckoutSessionView, StripeWebhookView

urlpatterns = [
    path("checkout-session/", CreateCheckoutSessionView.as_view(), name="checkout_session"),
    path("confirm/", ConfirmCheckoutView.as_view(), name="confirm_checkout"),
    path("webhook/", StripeWebhookView.as_view(), name="stripe_webhook"),
]
