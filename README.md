# ShopFlow — Full-Stack E-Commerce

A mini e-commerce platform with a customer storefront and an admin panel, sharing one API.

- **Frontend** — Next.js 16 (App Router, TypeScript, React 19, Tailwind CSS, React Query)
- **Backend** — NestJS 11 (TypeScript) + MongoDB (Mongoose), JWT auth, role-based access

```
shopFlow/
├── frontend/   # Next.js storefront + admin UI
└── backend/    # NestJS REST API (/api)
```

## Prerequisites
- Node.js 20+
- MongoDB — a local instance (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas cluster

## Getting started

### 1. Backend (API → http://localhost:4000/api)
```bash
cd backend
npm install
cp .env.example .env        # then set MONGO_URI / JWT_SECRET
npm run seed                # seed categories, products, users, orders
npm run start:dev
```

### 2. Frontend (→ http://localhost:3000)
```bash
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev
```

Open **http://localhost:3000**.

## Environment variables

**backend/.env**
| Key | Example | Notes |
|-----|---------|-------|
| `PORT` | `4000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ecommerce` | local or Atlas URI |
| `JWT_SECRET` | `long-random-string` | JWT signing secret |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin |

**frontend/.env.local**
| Key | Example |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` |

## Seeded accounts (after `npm run seed`)
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shop.com` | `Admin@123` |
| Customer | `customer@shop.com` | `Customer@123` |
| Customer | `jane@shop.com` | `Jane@123` |

## Notes
- Prices are stored as **integer cents** to avoid floating-point drift.
- Checkout uses a **mock payment** (no real charges); stock is decremented atomically with rollback.
- Admin routes/endpoints are restricted to admins (server-enforced via role guards).
