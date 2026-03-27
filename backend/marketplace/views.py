from django.db.models import Q
from django.http import FileResponse, Http404
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from orders.models import OrderItem

from .models import Product
from .permissions import IsSellerOrReadOnly
from .serializers import (
    ProductListSerializer,
    ProductSerializer,
    ReviewCreateSerializer,
    ReviewSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("seller").prefetch_related("reviews__user")
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["price", "created_at", "average_rating"]
    permission_classes = [IsSellerOrReadOnly]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        if self.action == "reviews":
            return ReviewCreateSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = self.queryset.filter(is_published=True)
        if self.request.user.is_authenticated and self.action in {"update", "partial_update", "destroy", "mine"}:
            queryset = self.queryset

        params = self.request.query_params
        search = params.get("search")
        category = params.get("category")
        tech_stack = params.get("tech_stack")
        min_price = params.get("min_price")
        max_price = params.get("max_price")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(tags__icontains=search)
            )
        if category:
            queryset = queryset.filter(category=category)
        if tech_stack:
            queryset = queryset.filter(tech_stack__icontains=tech_stack)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user, is_published=True)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        products = self.queryset.filter(seller=request.user)
        serializer = ProductListSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def reviews(self, request, slug=None):
        product = self.get_object()
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save(product=product, user=request.user)
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def download(self, request, slug=None):
        product = self.get_object()
        has_purchased = OrderItem.objects.filter(
            product=product,
            order__buyer=request.user,
            order__status="paid",
        ).exists()
        if not has_purchased and request.user != product.seller and request.user.role != "admin":
            raise Http404("You do not have access to this file.")

        file_handle = product.downloadable_file.open("rb")
        return FileResponse(file_handle, as_attachment=True, filename=product.downloadable_file.name.split("/")[-1])
