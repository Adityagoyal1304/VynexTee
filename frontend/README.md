# Vynextee Frontend

Premium T-shirts & Bags e-commerce frontend built with Vite + React 18 + TailwindCSS.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack

| Layer | Tech |
|---|---|
| Build | Vite 5 |
| UI | React 18 (functional components + hooks) |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 |
| State | Zustand (cart, persist) |
| Server State | TanStack Query v5 |
| HTTP | Axios (behind service layer) |
| Forms | React Hook Form + Zod |
| Toasts | React Hot Toast |
| Icons | Lucide React |

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Badge, Spinner
│   ├── layout/      # Navbar, Footer, PageWrapper
│   ├── product/     # ProductCard, ProductGrid, CategoryFilter
│   └── cart/        # CartItem, CartSummary
├── pages/           # HomePage, ShopPage, ProductDetailPage, CartPage, NotFoundPage
├── store/           # cartStore.js (Zustand)
├── hooks/           # useProducts.js, useCart.js
├── services/        # productService.js (API layer)
├── data/            # products.js (mock data)
├── utils/           # formatPrice.js
└── styles/          # index.css
```

## Switching to a Real Backend

1. Set `VITE_API_BASE_URL=http://your-api.com` in `.env`
2. That's it — no other changes needed

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, featured products, newsletter |
| `/shop` | Shop — full catalog with filter/sort |
| `/shop?category=tshirt` | T-Shirts filter |
| `/shop?category=bag` | Bags filter |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `*` | 404 |

## Deploy

**Vercel**: Connect repo, set build command `npm run build`, publish dir `dist`  
**Netlify**: Same build settings. `netlify.toml` handles SPA redirects.
