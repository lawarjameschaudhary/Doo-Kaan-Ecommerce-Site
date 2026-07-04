"""
ShopSphere API Views
---------------------
ViewSets and function/class-based views exposing REST endpoints for
authentication, products, categories, cart, wishlist, orders, reviews,
contact messages and dashboard statistics.
"""
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from rest_framework import viewsets, generics, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    User, Category, Product, Review, Cart, CartItem,
    Wishlist, WishlistItem, Order, OrderItem, ContactMessage,
)
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ReviewSerializer, CartSerializer, CartItemSerializer,
    WishlistSerializer, WishlistItemSerializer,
    OrderSerializer, CreateOrderSerializer, ContactMessageSerializer,
)


# ---------------- AUTH ----------------

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_view(request):
    """Hardcoded admin login as per project spec (admin / admin123)."""
    username = request.data.get('username')
    password = request.data.get('password')
    if username == 'admin' and password == 'admin123':
        return Response({'success': True, 'message': 'Admin authenticated.'})
    return Response({'success': False, 'message': 'Invalid admin credentials.'},
                     status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response(UserSerializer(request.user).data)


# ---------------- CATEGORY ----------------

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


# ---------------- PRODUCT ----------------

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('images', 'reviews').all()
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'brand', 'is_featured', 'is_trending', 'is_flash_sale', 'is_best_seller']
    search_fields = ['name', 'category__name', 'brand', 'description']
    ordering_fields = ['price', 'rating', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        min_price = params.get('min_price')
        max_price = params.get('max_price')
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)

        min_rating = params.get('min_rating')
        if min_rating:
            qs = qs.filter(rating__gte=min_rating)

        availability = params.get('availability')
        if availability == 'in_stock':
            qs = qs.filter(stock__gt=0)
        elif availability == 'out_of_stock':
            qs = qs.filter(stock=0)

        sort = params.get('sort')
        if sort == 'price_low':
            qs = qs.order_by('price')
        elif sort == 'price_high':
            qs = qs.order_by('-price')
        elif sort == 'popular':
            qs = qs.order_by('-rating', '-num_reviews')
        elif sort == 'newest':
            qs = qs.order_by('-created_at')

        return qs

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:8]
        return Response(ProductListSerializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        qs = self.get_queryset().filter(is_trending=True)[:8]
        return Response(ProductListSerializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def flash_sale(self, request):
        qs = self.get_queryset().filter(is_flash_sale=True)[:8]
        return Response(ProductListSerializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def best_sellers(self, request):
        qs = self.get_queryset().filter(is_best_seller=True)[:8]
        return Response(ProductListSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, slug=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, product=product)
            agg = product.reviews.aggregate(avg=Sum('rating') / Count('id'), count=Count('id'))
            product.rating = round(agg['avg'] or 0, 1)
            product.num_reviews = agg['count'] or 0
            product.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- CART ----------------

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cart_add_item(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    product = Product.objects.get(id=product_id)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': quantity})
    if not created:
        item.quantity += quantity
        item.save()
    return Response(CartSerializer(cart).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cart_update_item(request, item_id):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    item = CartItem.objects.get(id=item_id, cart=cart)
    quantity = int(request.data.get('quantity', item.quantity))
    if quantity <= 0:
        item.delete()
    else:
        item.quantity = quantity
        item.save()
    return Response(CartSerializer(cart).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_remove_item(request, item_id):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    CartItem.objects.filter(id=item_id, cart=cart).delete()
    return Response(CartSerializer(cart).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_clear(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart.items.all().delete()
    return Response(CartSerializer(cart).data)


# ---------------- WISHLIST ----------------

class WishlistView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wishlist, _ = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_add_item(request):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    WishlistItem.objects.get_or_create(wishlist=wishlist, product=product)
    return Response(WishlistSerializer(wishlist).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_remove_item(request, item_id):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    WishlistItem.objects.filter(id=item_id, wishlist=wishlist).delete()
    return Response(WishlistSerializer(wishlist).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_move_to_cart(request, item_id):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    wishlist_item = WishlistItem.objects.get(id=item_id, wishlist=wishlist)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=wishlist_item.product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    wishlist_item.delete()
    return Response({
        'cart': CartSerializer(cart).data,
        'wishlist': WishlistSerializer(wishlist).data,
    })


# ---------------- ORDERS ----------------

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = Order.objects.create(
            user=request.user,
            full_name=data['full_name'],
            address=data['address'],
            phone=data['phone'],
            email=data['email'],
            payment_method=data['payment_method'],
            total_amount=cart.total,
        )
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                price=item.unit_price,
                quantity=item.quantity,
            )
        cart.items.all().delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)


# ---------------- CONTACT ----------------

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]


# ---------------- ADMIN: USERS ----------------

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(is_superuser=False).order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # relies on hardcoded admin login on frontend
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


# ---------------- DASHBOARD STATS ----------------

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_users = User.objects.filter(is_superuser=False).count()
    total_revenue = Order.objects.filter(status='delivered').aggregate(s=Sum('total_amount'))['s'] or 0

    last_7_days = timezone.now() - timedelta(days=7)
    sales_by_day = []
    for i in range(6, -1, -1):
        day = timezone.now() - timedelta(days=i)
        day_total = Order.objects.filter(created_at__date=day.date()).aggregate(s=Sum('total_amount'))['s'] or 0
        sales_by_day.append({'date': day.strftime('%b %d'), 'total': float(day_total)})

    top_categories = (
        Category.objects.annotate(count=Count('products'))
        .values('name', 'count')
        .order_by('-count')[:6]
    )

    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
    recent_users = User.objects.filter(is_superuser=False).order_by('-date_joined')[:5]

    return Response({
        'total_products': total_products,
        'total_orders': total_orders,
        'total_users': total_users,
        'total_revenue': float(total_revenue),
        'sales_by_day': sales_by_day,
        'top_categories': list(top_categories),
        'recent_orders': OrderSerializer(recent_orders, many=True).data,
        'recent_users': UserSerializer(recent_users, many=True).data,
        'order_status_breakdown': list(
            Order.objects.values('status').annotate(count=Count('id'))
        ),
    })
