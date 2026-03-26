# ByteBridgeX

ByteBridgeX is a production-oriented developer marketplace where teams can buy and sell code components, UI kits, APIs, templates, and AI models with immersive previews, seller tooling, and Stripe-backed checkout.

## Stack

- Frontend: Next.js App Router, Tailwind CSS, Framer Motion, Three.js, Axios
- Backend: Django, Django REST Framework, SimpleJWT
- Database: PostgreSQL
- Storage: AWS S3 with local media fallback
- Payments: Stripe Checkout

## Project Structure

```text
/bytebridgex
  /frontend
  /backend
  /docs
  docker-compose.yml
  README.md
```

## 1. Local Setup Commands

### Start PostgreSQL

Use Docker:

```bash
cd /Users/amrutha/DimensionProjects/SmartBill-AI/bytebridgex
docker compose up -d
```

Or use a local PostgreSQL installation:

```bash
createuser -s bytebridgex
createdb bytebridgex -O bytebridgex
```

### Backend Setup

```bash
cd /Users/amrutha/DimensionProjects/SmartBill-AI/bytebridgex/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd /Users/amrutha/DimensionProjects/SmartBill-AI/bytebridgex/frontend
cp .env.example .env.local
npm install
npm run lint
npx next build --webpack
npm run dev
```

## 2. Environment Files

Backend: [`backend/.env.example`](/Users/amrutha/DimensionProjects/SmartBill-AI/bytebridgex/backend/.env.example)

Frontend: [`frontend/.env.example`](/Users/amrutha/DimensionProjects/SmartBill-AI/bytebridgex/frontend/.env.example)

Key variables:

- `DATABASE_URL`: PostgreSQL connection string
- `DJANGO_CORS_ALLOWED_ORIGINS`: frontend origin list
- `AWS_*`: S3 storage credentials and bucket settings
- `STRIPE_SECRET_KEY`: backend Stripe secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: frontend Stripe publishable key
- `NEXT_PUBLIC_API_BASE_URL`: backend API base URL

## 3. Core Features

- JWT authentication with buyer/seller/admin roles
- Product catalog with search and filters
- Product detail pages with reviews and ratings
- Seller dashboard with product uploads and earnings
- Persistent cart with checkout flow
- Stripe Checkout session creation and payment confirmation
- Download-protected purchased files
- Three.js-powered 3D product preview
- Django admin for moderation

## 4. API Overview

- `POST /api/auth/signup/`
- `POST /api/auth/login/`
- `GET /api/auth/me/`
- `GET /api/marketplace/products/`
- `POST /api/marketplace/products/`
- `GET /api/marketplace/products/mine/`
- `POST /api/marketplace/products/{slug}/reviews/`
- `GET|POST|PATCH|DELETE /api/orders/cart/`
- `GET /api/orders/earnings/`
- `POST /api/payments/checkout-session/`
- `POST /api/payments/confirm/`

## 5. Verification

Verified in this workspace:

- `python manage.py check`
- `python manage.py makemigrations`
- `npm run lint`
- `npx next build --webpack`

Note: the local PostgreSQL service was not running in this environment, so `python manage.py migrate` and `runserver` still need a live database before they can complete.

## 6. Deployment

See [`docs/deployment.md`](/Users/amrutha/DimensionProjects/SmartBill-AI/bytebridgex/docs/deployment.md) for Vercel and Render steps.
