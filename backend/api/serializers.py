"""
ShopSphere DRF Serializers
---------------------------
Converts model instances <-> JSON for the REST API.
"""
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import (
    User, Category, Product, ProductImage, Review,
    Cart, CartItem, Wishlist, WishlistItem,
    Order, OrderItem, ContactMessage,
)


# ---------- Auth / User ----------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'address', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return data

    def create(self, validated_data):
        name = validated_data.pop('name')
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        first_name, *rest = name.split(' ', 1)
        last_name = rest[0] if rest else ''
        user = User(
            username=validated_data['email'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()
        Cart.objects.create(user=user)
        Wishlist.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        data['user'] = user
        return data


# ---------- Category ----------

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image', 'description', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()


# ---------- Product ----------

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product grids/listings."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percent = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'brand', 'price',
            'discount_price', 'discount_percent', 'thumbnail', 'stock', 'in_stock',
            'rating', 'num_reviews', 'is_featured', 'is_trending', 'is_flash_sale',
            'is_best_seller',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the product detail page."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    discount_percent = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    related_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'brand', 'description',
            'specifications', 'price', 'discount_price', 'discount_percent', 'thumbnail',
            'stock', 'in_stock', 'rating', 'num_reviews', 'is_featured', 'is_trending',
            'is_flash_sale', 'is_best_seller', 'flash_sale_ends_at', 'images', 'reviews',
            'related_products', 'created_at',
        ]

    def get_related_products(self, obj):
        related = Product.objects.filter(category=obj.category).exclude(id=obj.id)[:4]
        return ProductListSerializer(related, many=True).data


# ---------- Cart ----------

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    subtotal = serializers.ReadOnlyField()
    unit_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'total_items']


# ---------- Wishlist ----------

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id', 'added_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'items']


# ---------- Orders ----------

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer_name', 'full_name', 'address', 'phone', 'email',
            'payment_method', 'status', 'total_amount', 'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'total_amount', 'status']


class CreateOrderSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    address = serializers.CharField()
    phone = serializers.CharField()
    email = serializers.EmailField()
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_CHOICES)


# ---------- Contact ----------

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['is_read', 'created_at']
