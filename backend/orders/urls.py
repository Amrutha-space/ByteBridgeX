from rest_framework.routers import DefaultRouter

from .views import CartViewSet, OrderViewSet

router = DefaultRouter()
router.register("cart", CartViewSet, basename="cart")
router.register("", OrderViewSet, basename="order")

urlpatterns = router.urls
