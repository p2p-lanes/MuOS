# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MuOS is a **Next.js 15 App Router** citizen portal for pop-up city management. Users register, apply to events, purchase passes, book housing, and pay via Stripe or crypto. The frontend talks to an external backend API (not in this repo); admin management uses NocoDB.

## Commands

```bash
npm install --legacy-peer-deps   # Install deps (legacy-peer-deps required)
npm run dev                      # Dev server
npm run build                    # Production build
npm run lint                     # ESLint
```

No unit test runner is configured. E2E tests use Playwright (`npx playwright test`).

## Architecture

### Routing (App Router)

- `/auth` - Login (Worldcoin MiniKit integration)
- `/portal` - Protected area (wrapped in `Authentication` guard + `Providers`)
  - `/portal/[popupSlug]` - City dashboard, application, passes, attendees, coupons, groups
  - `/portal/profile`, `/portal/poaps`
- `/checkout` - Separate checkout flow with its own provider composition
- `/[popup]/invite/[group]` - Express group invite checkout
- `/online-checkin` - Event check-in

### State Management (React Context)

All state is managed via Context providers composed in `src/components/Providers.tsx`:

**Portal chain:** CityProvider -> ApplicationProvider -> PassesDataProvider -> GroupsProvider -> PassesProvider -> PoapsProvider -> SidebarProvider

**Checkout chain:** CityProvider -> ApplicationProvider -> GroupsProvider -> PassesDataProvider -> PassesProvider -> TotalProvider

Key providers: `cityProvider` (current popup), `applicationProvider` (user applications + attendees), `passesProvider` (product selection + discounts), `totalProvider` (price calculations).

### API Layer

`src/api/index.js` - Axios wrapper around `NEXT_PUBLIC_API_URL`. All backend calls go through `api.get/post/put/patch/delete()`. Auth uses JWT tokens stored in `localStorage`.

### Strategy Pattern (Business Logic)

`src/strategies/` contains pricing and product logic:
- **TotalStrategy.ts** - Price calculation strategies (Monthly, Weekly, Patreon, Day)
- **ProductStrategies.ts** - Product selection/deselection rules by attendee category
- **PriceStrategy.ts** / **PurchaseStrategy.ts** - Price computation and purchase flow

### Discount Priority

Three discount types exist (coupon codes, group discounts, scholarship). When multiple apply, **the highest discount wins**.

### Approval Flow

Applications go through a voting system: "strong yes" auto-accepts, "strong no" auto-rejects, 2+ yes/no votes decide otherwise. Cities without approval requirements auto-accept (unless discount requested). Acceptance emails have a 2-minute delay.

## Key Conventions

- **UI**: Tailwind CSS + shadcn/ui (New York style) + Radix UI primitives. Use `cn()` from `src/lib/utils` for conditional classes.
- **Hooks**: Custom hooks in `src/hooks/` handle data fetching and side effects. Auth flow is in `useAuthentication.ts`.
- **Forms**: No form library - useState + custom validation (`useFormValidation`). Field definitions live in `src/constants/Forms/`.
- **Types**: TypeScript interfaces in `src/types/`.
- **Components**: `'use client'` directive used throughout. Dynamic imports for browser-only code.
- **Notifications**: Toast via sonner.
- **File uploads**: AWS S3 via `src/helpers/upload.ts` and `src/app/api/upload/route.ts`.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_X_API_KEY` - API auth key
- `NEXT_PUBLIC_DEVELOP` - Dev mode flag
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - S3 uploads

## Deployment

Deployed on Vercel. Sharp image optimization is disabled (`vercel.json` sets `NEXT_SHARP_PATH`). Functions have 30s max duration.
