# Deployment Guide

## Vercel Frontend

1. Import the `frontend` directory as a Vercel project.
2. Set the framework preset to Next.js.
3. Add environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Use the build command:

```bash
npx next build --webpack
```

5. Use the output defaults from Vercel and deploy.

## Render Backend

1. Create a new Web Service from the `backend` directory.
2. Runtime: Python 3.13
3. Build command:

```bash
pip install -r requirements.txt && python manage.py migrate
```

4. Start command:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

5. Add environment variables:
   - `DEBUG=False`
   - `DJANGO_SECRET_KEY`
   - `DJANGO_ALLOWED_HOSTS`
   - `DJANGO_CORS_ALLOWED_ORIGINS`
   - `DJANGO_CSRF_TRUSTED_ORIGINS`
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_SUCCESS_URL`
   - `STRIPE_CANCEL_URL`
   - `AWS_STORAGE_BUCKET_NAME`
   - `AWS_S3_REGION_NAME`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_ENDPOINT_URL` if needed
   - `AWS_S3_CUSTOM_DOMAIN` if needed

## PostgreSQL

- Use a managed Render PostgreSQL instance or another hosted PostgreSQL service.
- Copy its external connection string into `DATABASE_URL`.

## Stripe

1. Create a Stripe test-mode product flow with test API keys.
2. Set the backend `STRIPE_SECRET_KEY`.
3. Set the frontend `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Configure success and cancel URLs to point to:
   - `/checkout/success`
   - `/checkout/cancel`
5. Configure a webhook endpoint on the backend:
   - `/api/payments/webhook/`
   - subscribe to `checkout.session.completed`

## S3 Storage

1. Create a private S3 bucket for digital downloads and preview assets.
2. Add the AWS credentials to the backend environment.
3. Leave the AWS fields blank in development to use the local media fallback.
