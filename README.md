# ByteBridgeX

**ByteBridgeX** is a full-stack developer marketplace where developers can **buy, sell, and explore code assets** such as UI kits, APIs, templates, and AI models — with secure payments and immersive previews. It's a place where Code meets Commerce.

> Built as a production-grade application with scalable architecture, real-world features, and modern tech stack.
---
## 🌐 Live Demo

👉 **Frontend (User App):**
https://byte-bridge-x.vercel.app/

👉 **API Base URL:**
https://bytebridgex.onrender.com/

🔐 **Demo Credentials** 
Email: [demo@bytebridge.com](mailto:demo@bytebridge.com)
Password: demo123
---

##  Key Features

*  JWT Authentication (User / Seller / Admin roles)
*  Developer marketplace (buy & sell assets)
*  Advanced search and filtering
*  Reviews & ratings system
*  Seller dashboard (uploads, earnings tracking)
*  Persistent cart & checkout flow
*  Stripe payment integration
*  Secure file downloads after purchase
*  3D product previews using Three.js
*  Admin panel for moderation
---

##  Tech Stack

**Frontend**

* Next.js (App Router)
* Tailwind CSS
* Framer Motion
* Three.js

**Backend**

* Django
* Django REST Framework
* JWT (SimpleJWT)

**Infrastructure**

* PostgreSQL
* AWS S3 (file storage)
* Stripe (payments)
* Vercel (frontend deployment)
* Render (backend deployment)

---

## 📁 Project Structure

```
bytebridgex/
  ├── frontend/
  ├── backend/
  ├── docs/
  ├── docker-compose.yml
  └── README.md
```

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```
git clone <https://github.com/Amrutha-space/ByteBridgeX>
cd bytebridgex
```

### 2️⃣ Backend Setup

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3️⃣ Frontend Setup

```
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

---

## 🔑 Environment Variables

**Backend**

* DATABASE_URL
* AWS credentials
* STRIPE_SECRET_KEY

**Frontend**

* NEXT_PUBLIC_API_BASE_URL
* STRIPE_PUBLISHABLE_KEY

---

## 📡 API Overview

* Auth: `/api/auth/`
* Products: `/api/marketplace/products/`
* Cart & Orders: `/api/orders/`
* Payments: `/api/payments/`

---

## 🚀 Deployment

* Frontend → Vercel
* Backend → Render
* Database → PostgreSQL

Detailed steps in: `docs/deployment.md`

---

## 📌 Future Improvements

* AI-powered product recommendations
* Real-time notifications
* Microservices architecture
* Analytics dashboard

---

## 👨‍💻 Author

Amrutha A 
CSE
