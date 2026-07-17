# Doo-Kaan 🛍️
### Everything You Need in One Place

A full-stack eCommerce web application built as a BSc CSIT Final Year College Project, demonstrating
modern full-stack development practices with a clean, modular, and scalable architecture.

---

## 🧱 Tech Stack

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Frontend   | React.js (Vite), React Router, Tailwind CSS, Axios, Context API, Lucide Icons, Recharts |
| Backend    | Django, Django REST Framework                            |
| Database   | SQLite (development)                                      |
| Auth       | Token Authentication (DRF), hardcoded admin login          |

---

## 📁 Project Structure

```
shopsphere/
│
├── backend/                   Django REST API
│   ├── api/
│   │   ├── models.py          Database models (User, Product, Order, ...)
│   │   ├── serializers.py     DRF serializers
│   │   ├── views.py           ViewSets & API views
│   │   ├── urls.py            API routes
│   │   ├── admin.py           Django admin registration
│   │   └── management/commands/seed_data.py   Sample data generator
│   ├── config/                 Django project settings & root urls
│   ├── media/                  Uploaded media (created at runtime)
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                   React storefront + admin panel
│   ├── src/
│   │   ├── components/         Reusable UI (product cards, layout, chatbot, admin widgets)
│   │   ├── pages/               Route-level pages (Home, Products, Cart, Admin/*, ...)
│   │   ├── layouts/             MainLayout (storefront) & AdminLayout (dashboard)
│   │   ├── context/              AuthContext, CartContext, WishlistContext, ThemeContext
│   │   ├── hooks/                 useFetch, useDebounce, useScrollTop
│   │   ├── services/api.js        Central Axios instance + API service layer
│   │   ├── utils/format.js        Formatting helpers (price, date, status colors)
│   │   ├── App.jsx                 Route definitions
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Backend Setup

```bash
cd backend

# 1. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
python manage.py makemigrations
python manage.py migrate

# 4. Seed sample data (10 categories, 30 products, 15 users, 20 orders)
python manage.py seed_data

# 5. (Optional) Create a Django superuser for /django-admin/
python manage.py createsuperuser

# 6. Run the development server
python manage.py runserver
```

The API will be available at **http://127.0.0.1:8000/api/**
Django admin (optional, separate from the app's own Admin Panel): **http://127.0.0.1:8000/django-admin/**

### Seeded demo users
All seeded customers use the password `password123` (emails follow the pattern `firstname.lastname{n}@example.com`,
visible via `/django-admin/` or the admin panel's Customers page).

---

## 💻 Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env if your backend runs on a different host/port

# 3. Run the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Environment Variables (`frontend/.env`)
```
VITE_API_URL=http://127.0.0.1:8000/api
```

### Build for production
```bash
npm run build
```
Output is generated in `frontend/dist/`.

---

## 🔑 Admin Panel Access

The Admin Panel is a completely separate interface from the customer storefront.

- URL: **http://localhost:5173/admin/login**
- Username: `admin`
- Password: `admin123`

> These credentials are intentionally hardcoded per the project specification (no real authentication
> backend is required for the admin panel — it simply sets a local flag after a successful check against
> the `/api/admin/login/` endpoint).

From the Admin Dashboard you can manage:
- **Products** — add, edit, delete, search, and set flags (featured/trending/flash sale/best seller)
- **Categories** — full CRUD
- **Orders** — view details, update status (Pending → Processing → Delivered / Cancelled), delete
- **Customers** — view and search registered users, delete accounts
- **Messages** — view messages submitted through the Contact page
- **Analytics** — order status breakdown & products-per-category charts
- **Settings** — store info & theme toggle (demo only)

---

## 📡 API Documentation

Base URL: `/api/`

### Authentication
| Method | Endpoint              | Description                       |
|--------|------------------------|-----------------------------------|
| POST   | `/auth/signup/`        | Register a new customer account   |
| POST   | `/auth/login/`         | Log in and receive an auth token  |
| GET    | `/auth/profile/`       | Get the logged-in user's profile  |
| POST   | `/admin/login/`        | Hardcoded admin login             |

### Products & Categories
| Method | Endpoint                         | Description                            |
|--------|-----------------------------------|-----------------------------------------|
| GET    | `/products/`                      | List products (search, filter, sort, paginate) |
| GET    | `/products/{slug}/`               | Product detail (images, reviews, related) |
| POST   | `/products/`                      | Create a product (admin)               |
| PUT    | `/products/{slug}/`               | Update a product (admin)               |
| DELETE | `/products/{slug}/`               | Delete a product (admin)               |
| GET    | `/products/featured/`             | Featured products                      |
| GET    | `/products/trending/`             | Trending products                      |
| GET    | `/products/flash_sale/`           | Flash sale products                    |
| GET    | `/products/best_sellers/`         | Best-selling products                  |
| POST   | `/products/{slug}/add_review/`    | Submit a review (auth required)        |
| GET    | `/categories/`                    | List categories                        |
| POST/PUT/DELETE | `/categories/{slug}/`    | Category CRUD (admin)                  |

**Product list query params:** `search`, `category__slug`, `min_price`, `max_price`, `min_rating`,
`availability` (`in_stock`/`out_of_stock`), `sort` (`price_low`/`price_high`/`popular`/`newest`), `page`.

### Cart (auth required)
| Method | Endpoint                          | Description            |
|--------|-------------------------------------|-------------------------|
| GET    | `/cart/`                            | Get current user's cart |
| POST   | `/cart/add/`                        | Add item `{product_id, quantity}` |
| PATCH  | `/cart/update/{item_id}/`           | Update item quantity    |
| DELETE | `/cart/remove/{item_id}/`           | Remove an item          |
| DELETE | `/cart/clear/`                      | Empty the cart          |

### Wishlist (auth required)
| Method | Endpoint                                    | Description         |
|--------|------------------------------------------------|-----------------------|
| GET    | `/wishlist/`                                   | Get wishlist          |
| POST   | `/wishlist/add/`                               | Add item `{product_id}` |
| DELETE | `/wishlist/remove/{item_id}/`                  | Remove item            |
| POST   | `/wishlist/move-to-cart/{item_id}/`            | Move item to cart      |

### Orders
| Method | Endpoint                          | Description                            |
|--------|-------------------------------------|------------------------------------------|
| GET    | `/orders/`                          | List orders (own orders, or all if admin) |
| POST   | `/orders/`                          | Place an order from the current cart      |
| PATCH  | `/orders/{id}/update_status/`       | Update order status (admin)               |
| DELETE | `/orders/{id}/`                     | Delete an order (admin)                   |

### Contact & Dashboard
| Method | Endpoint               | Description                    |
|--------|-------------------------|----------------------------------|
| POST   | `/contact/`             | Submit a contact message        |
| GET    | `/contact/`             | List messages (admin)           |
| GET    | `/admin/users/`         | List customers (admin)          |
| GET    | `/dashboard/stats/`     | Aggregate dashboard statistics  |

All authenticated requests must include the header:
```
Authorization: Token <token>
```

---

## ✨ Key Features

- Fully responsive, mobile-first UI with dark/light mode, skeleton loaders, and smooth animations
- Product grid with filtering (category, price, rating, availability), search, and sorting
- Product detail page with image gallery, specifications, reviews, and related products
- Cart & Wishlist powered by React Context API, backed by real REST endpoints
- Checkout flow with billing form and 4 payment method options (COD, eSewa, Khalti, Card)
- Customer authentication (signup/login) with frontend validation, stored via token + localStorage
- Separate hardcoded Admin Panel with sidebar navigation, dashboard charts (Recharts), and full CRUD
  for products, categories, and orders, plus customer and message management
- Rule-based floating chatbot with typing animation, suggested questions, and chat history
- Recently viewed products tracking (localStorage), scroll-to-top button, toast notifications

---

## 🧪 Sample / Seeded Data

Running `python manage.py seed_data` generates:
- 10 categories (Electronics, Fashion, Shoes, Watches, Mobiles, Laptops, Grocery, Beauty, Home Appliances, Books)
- 30 products with realistic prices, discounts, stock levels, and specifications
- 15 customer users (password: `password123`)
- ~20–45 product reviews
- 20 orders across all order statuses

The command is idempotent for categories/products/users (uses `get_or_create`), so it's safe to re-run.

---

## 📌 Notes for Presentation / Viva

- The backend and frontend are fully decoupled — they only communicate through the documented REST API.
- No payment gateway is integrated; checkout simply records the chosen payment method and shows an
  "Order Placed Successfully" confirmation, as specified in the project brief.
- The Admin Panel login is intentionally hardcoded (`admin` / `admin123`) rather than tied to a real
  user account, per the project requirements — it's a separate, simple gate in front of `/admin/*` routes.
- The chatbot is fully rule-based (keyword matching) — no external AI API calls are made.

---

Built for academic demonstration of full-stack development (React + Django REST Framework) — BSc CSIT
Final Year Project.
