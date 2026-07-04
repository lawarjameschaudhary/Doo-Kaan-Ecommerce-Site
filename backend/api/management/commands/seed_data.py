"""
Seed the database with realistic sample data for demo/presentation purposes.
Usage: python manage.py seed_data
"""
import random
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from api.models import (
    User, Category, Product, ProductImage, Review,
    Cart, Wishlist, Order, OrderItem,
)

CATEGORIES = [
    ("Electronics", "Zap"),
    ("Fashion", "Shirt"),
    ("Shoes", "Footprints"),
    ("Watches", "Watch"),
    ("Mobiles", "Smartphone"),
    ("Laptops", "Laptop"),
    ("Grocery", "ShoppingBasket"),
    ("Beauty", "Sparkles"),
    ("Home Appliances", "Refrigerator"),
    ("Books", "Book"),
]

PRODUCTS_BY_CATEGORY = {
    "Electronics": ["Wireless Earbuds Pro", "Bluetooth Speaker X200", "4K Action Camera", "Smart LED TV 43\"",
                    "Noise Cancelling Headphones", "Portable Power Bank 20000mAh"],
    "Fashion": ["Men's Slim Fit Shirt", "Women's Summer Dress", "Denim Jacket", "Casual Hoodie",
                "Formal Blazer", "Cotton T-Shirt Pack"],
    "Shoes": ["Running Sneakers", "Leather Formal Shoes", "Casual Loafers", "High-Top Sneakers",
              "Sports Sandals"],
    "Watches": ["Classic Analog Watch", "Smart Fitness Watch", "Chronograph Steel Watch", "Minimalist Leather Watch"],
    "Mobiles": ["Galaxy Nova 12", "Pixel Edge 9", "iPhone Aurora 15", "Redmi Blaze 11"],
    "Laptops": ["UltraBook Pro 14\"", "Gaming Laptop RTX Series", "Business Notebook 15\"", "Chromebook Lite"],
    "Grocery": ["Organic Rice 5kg", "Extra Virgin Olive Oil 1L", "Assorted Nuts Pack", "Green Tea Box"],
    "Beauty": ["Vitamin C Face Serum", "Matte Lipstick Set", "Hair Care Combo", "Sunscreen SPF50"],
    "Home Appliances": ["Air Fryer 5L", "Robot Vacuum Cleaner", "Microwave Oven 25L", "Electric Kettle"],
    "Books": ["The Art of Clean Code", "Modern Web Design", "Data Structures Simplified", "Business Strategy 101"],
}

BRANDS = ["Generic", "Zynex", "Nova", "Prime", "UrbanEdge", "TechNest", "StyleCraft", "HomeLine"]

FIRST_NAMES = ["Aarav", "Priya", "Rohan", "Sita", "Bishal", "Anjali", "Kiran", "Nisha", "Rajesh", "Maya",
               "Suman", "Pooja", "Deepak", "Sabina", "Arjun"]
LAST_NAMES = ["Sharma", "Thapa", "Gurung", "Rai", "Basnet", "Karki", "Adhikari", "Shrestha"]


class Command(BaseCommand):
    help = "Seed the database with sample categories, products, users, and orders."

    def handle(self, *args, **options):
        self.stdout.write("Seeding ShopSphere sample data...")

        # ---------- Categories ----------
        categories = {}
        for name, icon in CATEGORIES:
            cat, _ = Category.objects.get_or_create(
                name=name,
                defaults={
                    'icon': icon,
                    'image': f"https://source.unsplash.com/400x300/?{name.replace(' ', '-').lower()}",
                    'description': f"Shop the best {name.lower()} at unbeatable prices.",
                }
            )
            categories[name] = cat
        self.stdout.write(self.style.SUCCESS(f"  Created {len(categories)} categories."))

        # ---------- Products (30) ----------
        product_count = 0
        pool = []
        for cat_name, items in PRODUCTS_BY_CATEGORY.items():
            for item in items:
                pool.append((cat_name, item))
        random.shuffle(pool)
        pool = pool[:30] if len(pool) >= 30 else pool

        created_products = []
        for i, (cat_name, item_name) in enumerate(pool, start=1):
            price = Decimal(random.randrange(500, 25000, 100))
            has_discount = random.random() < 0.6
            discount_price = (price * Decimal(random.choice([0.7, 0.75, 0.8, 0.85, 0.9]))).quantize(Decimal("1.00")) if has_discount else None
            stock = random.choice([0, 5, 10, 15, 25, 50, 100])
            seed_img = f"https://picsum.photos/seed/shopsphere{i}/600/600"

            product, created = Product.objects.get_or_create(
                name=item_name,
                defaults={
                    'category': categories[cat_name],
                    'brand': random.choice(BRANDS),
                    'description': f"{item_name} — premium quality, built to last, and designed for everyday use. "
                                    f"A top pick in our {cat_name.lower()} collection.",
                    'specifications': {
                        "Brand": random.choice(BRANDS),
                        "Warranty": f"{random.choice([6, 12, 24])} Months",
                        "Color": random.choice(["Black", "White", "Blue", "Red", "Silver"]),
                        "Material": random.choice(["Premium Alloy", "Cotton Blend", "ABS Plastic", "Genuine Leather"]),
                    },
                    'price': price,
                    'discount_price': discount_price,
                    'thumbnail': seed_img,
                    'stock': stock,
                    'rating': round(random.uniform(3.0, 5.0), 1),
                    'num_reviews': random.randint(0, 120),
                    'is_featured': random.random() < 0.3,
                    'is_trending': random.random() < 0.3,
                    'is_flash_sale': has_discount and random.random() < 0.4,
                    'is_best_seller': random.random() < 0.25,
                    'flash_sale_ends_at': timezone.now() + timedelta(hours=random.randint(3, 48)) if has_discount else None,
                }
            )
            if created:
                for j in range(3):
                    ProductImage.objects.create(
                        product=product,
                        image_url=f"https://picsum.photos/seed/shopsphere{i}-{j}/600/600",
                        alt_text=f"{item_name} view {j+1}",
                    )
                product_count += 1
            created_products.append(product)

        self.stdout.write(self.style.SUCCESS(f"  Created {product_count} products."))

        # ---------- Users (15) ----------
        users = []
        for i in range(15):
            first = FIRST_NAMES[i % len(FIRST_NAMES)]
            last = random.choice(LAST_NAMES)
            email = f"{first.lower()}.{last.lower()}{i}@example.com"
            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': first,
                    'last_name': last,
                    'phone': f"98{random.randint(10000000, 99999999)}",
                    'address': f"{random.choice(['Baneshwor', 'Lakeside', 'New Road', 'Patan', 'Boudha'])}, Nepal",
                }
            )
            if created:
                user.set_password("password123")
                user.save()
                Cart.objects.get_or_create(user=user)
                Wishlist.objects.get_or_create(user=user)
            users.append(user)
        self.stdout.write(self.style.SUCCESS(f"  Created/verified {len(users)} users."))

        # ---------- Reviews ----------
        review_count = 0
        for product in created_products:
            for _ in range(random.randint(0, 3)):
                user = random.choice(users)
                _, created = Review.objects.get_or_create(
                    product=product, user=user,
                    defaults={
                        'rating': random.randint(3, 5),
                        'comment': random.choice([
                            "Great value for money, works as expected.",
                            "Fast delivery and good packaging.",
                            "Quality could be better but overall satisfied.",
                            "Exceeded my expectations, highly recommend!",
                            "Decent product for the price point.",
                        ]),
                    }
                )
                if created:
                    review_count += 1
        self.stdout.write(self.style.SUCCESS(f"  Created {review_count} reviews."))

        # ---------- Orders (20) ----------
        order_count = 0
        statuses = ['pending', 'processing', 'delivered', 'cancelled']
        for i in range(20):
            user = random.choice(users)
            num_items = random.randint(1, 4)
            chosen_products = random.sample(created_products, num_items)
            total = Decimal("0.00")
            order = Order.objects.create(
                user=user,
                full_name=f"{user.first_name} {user.last_name}",
                address=user.address or "Kathmandu, Nepal",
                phone=user.phone or "9800000000",
                email=user.email,
                payment_method=random.choice(['cod', 'esewa', 'khalti', 'card']),
                status=random.choice(statuses),
                total_amount=Decimal("0.00"),
            )
            order.created_at = timezone.now() - timedelta(days=random.randint(0, 30))
            for product in chosen_products:
                qty = random.randint(1, 3)
                price = product.discount_price or product.price
                OrderItem.objects.create(
                    order=order, product=product, product_name=product.name,
                    price=price, quantity=qty,
                )
                total += price * qty
            order.total_amount = total
            order.save()
            order_count += 1
        self.stdout.write(self.style.SUCCESS(f"  Created {order_count} orders."))

        self.stdout.write(self.style.SUCCESS("Seeding complete! ShopSphere is ready to demo."))
