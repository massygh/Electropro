# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electropro is an electrical services management application built with Next.js 15, using the App Router architecture. The system manages clients, jobs/interventions, employees, products, and scheduling for an electrical service business.

**Tech Stack:**
- Next.js 15.5.4 with Turbopack
- React 19.1.0
- TypeScript 5
- Prisma ORM 6.16.3 with PostgreSQL
- NextAuth.js 4.24.11 for authentication
- Tailwind CSS 4
- FullCalendar for scheduling views
- PDFKit for quote generation

## Development Commands

```bash
# Development server (with Turbopack)
npm run dev

# Production build (with Turbopack)
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Management

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name <migration-name>

# Push schema changes without migration (dev only)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Architecture

### Directory Structure

The application follows Next.js 15 App Router conventions:

- `electric-manager/src/app/` - App Router pages and API routes
  - `dashboard/` - Main dashboard with KPIs and upcoming interventions
  - `clients/` - Client management
  - `interventions/` - Job/intervention management
  - `agenda/` - Calendar view of scheduled jobs
  - `employes/` - Employee management
  - `marchandise/` - Product/inventory management
  - `api/` - API route handlers (NextResponse-based)
- `electric-manager/src/components/` - Reusable React components
- `electric-manager/src/lib/` - Utility modules and shared configuration
- `electric-manager/prisma/` - Database schema and migrations

### Data Model

**Core entities (from `prisma/schema.prisma`):**

1. **User** - System users (employees) with roles and authentication
   - Used for NextAuth authentication
   - Can be assigned to Jobs via `assignedToId`

2. **Client** - Customer information
   - Has many Jobs and Quotes
   - Includes contact details (phone, email, address) and notes

3. **Job** - Scheduled interventions/work orders
   - Links to Client (required) and User (optional assignee)
   - Has status tracking and scheduling fields
   - Used for calendar/agenda views

4. **Product** - Inventory items
   - SKU-based tracking
   - Cost and sale pricing
   - Stock quantity with low threshold alerts

5. **Quote** - Price quotes for clients
   - JSON field for line items
   - PDF generation support
   - Status tracking (draft, sent, approved, etc.)

**Key relationships:**
- Client → Jobs (1:many)
- Client → Quotes (1:many)
- User → Jobs assigned (1:many)

### Authentication Flow

The app uses NextAuth.js with credentials provider:
- Route: `/api/auth/[...nextauth]/route.ts`
- Password hashing via bcryptjs
- JWT-based sessions
- User lookup from Prisma User model

### Prisma Client Pattern

The app uses a singleton Prisma Client pattern to prevent connection exhaustion:
- Location: `src/lib/prisma.ts`
- Includes query logging in development
- Prevents multiple instances in HMR

### API Route Conventions

All API routes follow consistent patterns:
- `GET` - Fetch resources (often with `.findMany()`)
- `POST` - Create resources
- `PATCH` - Update resources (by id in body)
- `DELETE` - Delete resources (by id in query params)

Example: `/api/clients/route.ts`, `/api/jobs/route.ts`

### Component Architecture

**Server Components (default):**
- Dashboard page (`dashboard/page.tsx`) fetches data server-side
- Uses `dynamic = 'force-dynamic'` and `revalidate = 0` for real-time data

**Client Components ('use client'):**
- DashboardView - Interactive dashboard with forms and state
- Calendar - FullCalendar wrapper
- Form components (ClientForm, JobForm, ProductForm, UserForm)

**Shared patterns:**
- Forms use controlled components with loading states
- API calls use fetch with error handling
- Many actions trigger `window.location.reload()` for data refresh

### Styling

- Tailwind CSS 4 with custom configuration
- Geist font family (Sans and Mono variants)
- Color scheme: Indigo/Violet/Fuchsia gradient for headers, contextual colors for cards
- Component styling: Rounded corners (lg/xl/2xl), shadows, borders
- Path alias: `@/*` maps to `src/*`

### Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js JWT signing
- `NEXTAUTH_URL` - Application base URL

## Important Patterns

1. **Client deletion safety:** The DELETE endpoint in `/api/clients` checks for related jobs before allowing deletion to maintain referential integrity.

2. **Date handling:** Jobs use ISO string dates for scheduling. The frontend converts form inputs to ISO before sending to API.

3. **Turbopack usage:** Both dev and build use `--turbopack` flag for faster compilation.

4. **Dynamic rendering:** Dashboard and data-heavy pages disable caching to show real-time data.

5. **Global navigation:** The RootLayout (`app/layout.tsx`) includes a persistent navigation header for all pages.

6. **Error boundaries:** Many try-catch blocks have empty catch handlers or fallback data - consider improving error visibility.
