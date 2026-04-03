# EasyLaces — E-Commerce Landing Page

A bilingual (EN/EL) e-commerce landing page for EasyLaces Clip, built with Next.js, Tailwind CSS, and Stripe.

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env.local` and fill in your Stripe keys:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Your Stripe publishable key
- `STRIPE_SECRET_KEY` — Your Stripe secret key
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp number (default: 35797661053)

3. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

4. **Build for production**

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Stripe Checkout
- Framer Motion
- Lucide React Icons

## Features

- Bilingual support (English / Greek)
- Stripe Checkout integration
- Responsive design (mobile-first)
- Smooth scroll navigation
- Animated sections
- Google Maps embed
- WhatsApp integration
- Cookie consent banner
- SEO optimized with JSON-LD
