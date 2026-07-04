"""
ShopSphere API URL Routes
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='category')
router.register('products', views.ProductViewSet, basename='product')
router.register('orders', views.OrderViewSet, basename='order')
router.register('contact', views.ContactMessageViewSet, basename='contact')
router.register('admin/users', views.AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),

    # Auth
    path('auth/signup/', views.signup_view, name='signup'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/profile/', views.profile_view, name='profile'),
    path('admin/login/', views.admin_login_view, name='admin-login'),

    # Cart
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.cart_add_item, name='cart-add'),
    path('cart/update/<int:item_id>/', views.cart_update_item, name='cart-update'),
    path('cart/remove/<int:item_id>/', views.cart_remove_item, name='cart-remove'),
    path('cart/clear/', views.cart_clear, name='cart-clear'),

    # Wishlist
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/', views.wishlist_add_item, name='wishlist-add'),
    path('wishlist/remove/<int:item_id>/', views.wishlist_remove_item, name='wishlist-remove'),
    path('wishlist/move-to-cart/<int:item_id>/', views.wishlist_move_to_cart, name='wishlist-move'),

    # Dashboard
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
