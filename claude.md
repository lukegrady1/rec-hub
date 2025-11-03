claude.md — MVP Build Plan for Multi-Tenant Recreation SaaS (Self-Serve Website Builder)

You are Claude Code. Generate production-ready code and docs to ship an MVP. Prioritize a clean architecture, fast self-serve onboarding, and a controlled page builder with guardrails.

0) Product North Star

Goal: Let a recreation department sign up, customize branding, toggle features, create a homepage with blocks, publish to a subdomain, and list programs/events/facilities with basic bookings (no online payments in MVP).

Key user flows (must work end-to-end):

Sign up → auto-provision tenant + subdomain → land in Admin.

Upload logo, choose colors, pick template → publish.

Create Programs/Events/Facilities → they appear on public site.

Facilities: create time slots → resident requests a booking → admin gets email and sees booking in Admin.

SEO basics: title/desc per page, sitemap.xml, mobile-first.

1) Tech Stack & Repo Layout

Frontend: React + Vite + TypeScript, Tailwind, shadcn/ui, React Router, React Query, Tiptap.
Backend: Go (Gin), SQLC (or GORM), Postgres, Redis (sessions/rate-limit), MinIO (media), Mailer (SMTP).
Infra: Traefik/Nginx for *.app wildcard subdomains, Docker Compose (MVP), Let’s Encrypt (dev: self-signed).
Auth: Email+password (argon2id), magic link (optional MVP). JWT + Redis session invalidation.

Monorepo:

/apps
  /frontend
  /backend
  /infra
  /docs

2) Modern Visual System (consistent, not random)

Brand palette (Tailwind extended):

Primary: #2563EB (blue-600) / hover #1D4ED8, focus ring #93C5FD

Accent: #10B981 (emerald-500) / hover #059669

Neutral: #0F172A (slate-900), #334155 (slate-700), #CBD5E1 (slate-300), #F8FAFC (slate-50)

Danger: #EF4444 (red-500)

Typography: Inter (UI), Source Serif Pro (optional for headings).
Components: shadcn/ui defaults with above palette; rounded-2xl, soft shadows, spacious paddings.
Guardrails: max 2 fonts, 6 colors; contrast ≥ WCAG AA; locked image aspect ratios (hero 16:9, cards 4:3/1:1).

Add to tailwind.config.ts:

extend: {
  colors: {
    brand: {
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      ring: '#93C5FD',
      accent: '#10B981',
      accentHover: '#059669',
      neutral: '#0F172A',
      muted: '#334155',
      border: '#CBD5E1',
      bg: '#F8FAFC',
      danger: '#EF4444',
    },
  },
  borderRadius: { xl: '1rem', '2xl': '1.25rem' },
}

3) Environment & Infra (MVP)

docker-compose.yml (Postgres/Redis/MinIO/Traefik):

Postgres 14-alpine; DB rec, user recuser, pass recpass.

Redis 7-alpine.

MinIO with console on :9001; root user/pass via env.

Traefik routing: wildcard *.local.rechub to frontend/backend services.

Mount volumes for persistence.

.env (examples)

POSTGRES_URL=postgres://recuser:recpass@postgres:5432/rec?sslmode=disable
REDIS_URL=redis://redis:6379
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
JWT_SECRET=<generate-32b>
SMTP_HOST=mailhog
SMTP_PORT=1025
FROM_EMAIL=no-reply@rechub.app
PUBLIC_BASE_DOMAIN=local.rechub   # wildcard dev domain


Dev DNS: use /etc/hosts or dnsmasq to route *.local.rechub → 127.0.0.1.

4) Multitenancy & Routing

Tenant resolution (backend middleware):

Read Host header (e.g., sterling.local.rechub).

Lookup in tenant_domains (primary or aliases) → resolve tenant_id.

Attach tenant_id to context; all queries are auto-scoped.

Tables (core):

create table tenants(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text not null default 'starter',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table tenant_domains(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  domain text not null,         -- e.g., sterling.local.rechub
  is_primary bool default false,
  verified_at timestamptz,
  unique(tenant_id, domain)
);

create table users(
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table tenant_users(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('OWNER','ADMIN','STAFF','VIEWER')),
  unique(tenant_id, user_id)
);


Always index (tenant_id, …) on read-heavy tables.

5) Website Builder (controlled blocks)

Pages & Blocks:

create table pages(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  slug text not null,                -- 'home', 'about'
  title text not null,
  meta jsonb not null default '{}'::jsonb,
  published bool not null default false,
  unique(tenant_id, slug)
);

create table page_blocks(
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  kind text not null,                -- 'hero','rich_text','grid','cta','event_list','program_grid','facility_grid'
  "order" int not null,
  config jsonb not null default '{}'::jsonb
);


MVP block kinds & required props (validate with Zod on FE, go-playground on BE):

hero: headline, subheadline, ctaText, ctaHref, bgImage (media id), overlayOpacity (0–0.6), align.

rich_text: html (sanitized), max length 5,000.

program_grid: limit (1–12), showPrice (bool).

event_list: limit (1–10), showDates (bool).

facility_grid: limit (1–12), showAvailability (bool).

cta: text, href, style: primary|accent|outline.

Editor UX:

Left: Block library; Center: live preview; Right: block inspector (props).

Drag to reorder; add/remove; publish toggle on page.

Auto-generated navigation from published pages + enabled modules.

6) Core Domain Models (MVP)
-- Programs & Events
create table programs(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  description text,
  season text,
  price_cents int default 0,
  status text not null default 'active'
);

create table events(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  capacity int
);

-- Facilities & Slots
create table facilities(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  type text not null,    -- 'room','field','court','gym'
  address text,
  rules text,
  photo_id uuid
);

create table facility_slots(
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'open'  -- 'open','held','booked'
);

-- Bookings (request-only MVP; no payments)
create table bookings(
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  resource_type text not null,  -- 'facility_slot'
  resource_id uuid not null,
  requester_email text not null,
  requester_name text,
  notes text,
  status text not null default 'pending'  -- 'pending','approved','declined','cancelled',
  created_at timestamptz default now()
);

7) Media & Email

Media: MinIO bucket per environment; tenant-scoped prefixes /tenants/{tenant_id}/media/{uuid}.ext.

Backend /api/media/presign returns PUT URL; FE uploads directly.

Store metadata in media_assets (id, tenant_id, path, mime, width, height).

Email: Configure SMTP (MailHog in dev).

Send on booking request (pending) and on status change (approved/declined).

8) API Surface (representative)

Auth & Tenant

POST /api/auth/register → creates user, tenant, default domain {slug}.local.rechub, owner role, starter page.

POST /api/auth/login

GET /api/boot → { tenant, theme, modules, nav }

Website

GET /api/pages / POST /api/pages / PUT /api/pages/:id / DELETE

POST /api/pages/:id/blocks / PUT /api/blocks/:id / DELETE

POST /api/media/presign

Catalog

Programs: CRUD

Events: CRUD (+ upcoming)

Facilities: CRUD

Facility slots: CRUD (basic; no drag-drop requirement in MVP)

Bookings

Public: POST /api/bookings (request booking by slot id)

Admin: GET /api/bookings, PUT /api/bookings/:id (approve/decline)

Public Site

SSR optional; at least CSR that fetches /public/pages/:slug, /public/programs, /public/events/upcoming, /public/facilities

Validation & Security

All admin routes require user auth + role in tenant_users.

All data queries scoped by tenant_id from host middleware.

Rate limit: auth endpoints and bookings submission via Redis.

9) Frontend App Structure
/apps/frontend/src
  /admin
    /routes
      dashboard.tsx
      website/
        theme.tsx
        pages.tsx
        editor/[pageId].tsx
      programs/
      events/
      facilities/
        index.tsx
        slots.tsx
      bookings/
      settings/
  /public
    home.tsx            // renders blocks for 'home'
    programs.tsx
    events.tsx
    facilities.tsx
  /components
    blocks/*            // hero, rich_text, program_grid, event_list, facility_grid, cta
    ui/*                // shadcn wrapped with brand palette
  /lib
    api.ts
    auth.ts
    tenant.ts


Admin UX must:

Provide a “Getting Started” checklist (logo, colors, create homepage, publish).

Provide safe defaults (pre-made “City Classic” template = hero + program grid + CTA).

Public UX must:

Fast, mobile-first, accessible.

Auto nav: Home, Programs, Events, Facilities, Contact (if page exists).

10) Security, A11y, Perf

Security: argon2id passwords, JWT signed (HS256) + rotation; sanitize rich text (DOMPurify FE + allowlist BE). CSP headers.

A11y: semantic headings, focus states, aria labels; contrast AA.

Perf: image lazy-loading, responsive sizes, prefetch critical data, cache GETs.

Backups: nightly Postgres dump; MinIO versioning enabled.

11) Seed Data & Demo

Seed one demo tenant demo.local.rechub with:

Published Home page (hero + program grid + CTA).

6 sample programs, 4 events (upcoming), 3 facilities with 12 slots.

Admin user: admin@demo.local / password in .env.demo.

“Reset demo” script to re-seed nightly.

12) MVP Acceptance Criteria (must pass)

Self-serve signup → site live in <5 mins on subdomain.

Branding: upload logo, pick color theme, publish → public site updates instantly.

Blocks: add Hero, Rich Text, Program Grid, Event List, CTA to Home; reorder; publish.

Catalog pages: Programs, Events, Facilities render lists with details.

Bookings: Resident submits booking request on a facility slot → admin email received; admin changes status to approved/declined → resident email received; status visible in Admin.

SEO: per-page title/description; /sitemap.xml; mobile lighthouse ≥ 90 performance/accessibility.

Isolation: Switching subdomains isolates tenants fully (data, media, sessions).

13) Nice-to-Have (time-boxed; only if slack remains)

Magic link login; Password reset email.

Simple analytics counts in Admin Dashboard (programs, events, bookings).

CSV import for programs/events (headers documented).

Basic domain alias (record preview only; no cert automation in MVP).

14) Task Breakdown (generate code per ticket)

Infra & Boot

 Compose services + Traefik routing + wildcard dev domain

 Backend scaffolding (Gin, SQLC/GORM, migrations, config)

 Frontend scaffolding (Vite, Tailwind, shadcn, Router, Query)

 Lint, test, CI build

Auth & Tenancy

 Register/Login endpoints + argon2id

 Tenant resolver middleware (host → tenant_id)

 Tenant/user/role tables + guards

Media

 MinIO client + presign upload endpoint

 Media library UI + image utilities

Website Builder

 Pages CRUD + publish

 Blocks schema + 6 blocks (hero, rich_text, program_grid, event_list, facility_grid, cta)

 Block editor (drag/sort, inspector) + live preview

 Public renderer (Home + dynamic pages)

Catalog

 Programs CRUD + public list/detail

 Events CRUD + upcoming endpoint + public list/detail

 Facilities CRUD + slots CRUD + public list/detail

Bookings

 Public booking request (by slot) + email to admin

 Admin list + status change (approve/decline) + email to requester

Polish

 Sitemap generation per tenant

 A11y pass; responsive QA; rate limits

 Seed tenant + demo content

 Docs: Getting Started + Admin help

15) Developer Notes & Guardrails

Never return data without scoping by tenant_id. Centralize repos to enforce it.

Keep customization bounded (templates + controlled props) to avoid layout breakage.

Prefer optimistic UI + error toasts; log backend with request IDs incl. tenant_id.

Validate everything (Zod on FE, validator on BE).

Keep blocks pure and stateless; block config = JSON; converters for future migration.

16) Handoffs & Scripts

make dev → start compose + seed demo.

make migrate → run migrations.

make demo-reset → wipe & re-seed demo tenant.

docs/ADMIN_GUIDE.md → screenshots for onboarding wizard + builder.

docs/API.md → minimal endpoint shapes with request/response samples.

Ship it

Start from Infra & Auth, then Builder (Home only), then Catalog, then Bookings. Defer payments/custom domains/advanced analytics to V1. Keep the palette & components consistent so every tenant site looks professional out of the box.