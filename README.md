# Rec Hub - Multi-Tenant Recreation SaaS MVP

A modern, production-ready MVP for multi-tenant recreation department management. Built with React, Go, PostgreSQL, and Tailwind CSS.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Go 1.21+
- Node.js 20+
- Make

### Development Setup

```bash
# Start all services (database, redis, minio, mailhog, backend, frontend)
make dev

# In separate terminal, run migrations
make migrate

# Seed demo tenant with sample data
make seed-demo
```

After startup, you'll have:
- **Frontend**: http://localhost:5173
- **API**: http://api.local.rechub
- **Admin Dashboard**: http://localhost:5173/admin
- **MailHog**: http://localhost:8025 (email preview)
- **MinIO Console**: http://localhost:9001 (minio/minio123)

### Demo Credentials
- **Email**: admin@demo.local
- **Password**: DemoPass123!
- **Access at**: http://demo.local.rechub

## GitHub Issue Workflow

Automated workflow for managing issues and pull requests. See [docs/GITHUB_WORKFLOW.md](docs/GITHUB_WORKFLOW.md) for full documentation.

**Quick usage:**
```bash
# List open issues
./scripts/github-workflow.sh list

# Start working on issue #42
./scripts/github-workflow.sh start 42

# After making changes and committing
./scripts/github-workflow.sh pr
```

**Windows users:** Use `.\scripts\github-workflow.ps1` instead.

**Prerequisites:** Install [GitHub CLI](https://cli.github.com/) or set `GITHUB_TOKEN` environment variable.

## Architecture

### Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite for bundling
- Tailwind CSS for styling
- React Query for data fetching
- React Router for navigation
- shadcn/ui components
- Zustand for state management

**Backend**
- Go with Gin framework
- PostgreSQL for data storage
- Redis for caching/sessions
- MinIO for media storage
- JWT for authentication

**Infrastructure**
- Docker Compose for local development
- Traefik for wildcard subdomain routing
- PostgreSQL 14-alpine
- Redis 7-alpine
- MailHog for email testing

### Project Structure

```
rec-hub/
├── apps/
│   ├── backend/          # Go API server
│   │   ├── cmd/          # Executables (server, migrate, seed)
│   │   ├── pkg/          # Reusable packages
│   │   │   ├── config/   # Configuration
│   │   │   ├── db/       # Database setup
│   │   │   ├── models/   # Data models
│   │   │   ├── handlers/ # HTTP handlers
│   │   │   ├── auth/     # Authentication
│   │   │   ├── middleware/ # HTTP middleware
│   │   │   └── mail/     # Email sending
│   │   ├── migrations/   # SQL migrations
│   │   └── Dockerfile
│   │
│   └── frontend/         # React SPA
│       ├── src/
│       │   ├── admin/    # Admin dashboard pages
│       │   ├── public/   # Public site pages
│       │   ├── components/ # Reusable components
│       │   ├── lib/      # Utilities
│       │   └── hooks/    # Custom hooks
│       ├── index.html
│       ├── vite.config.ts
│       └── Dockerfile
│
├── docs/                 # Documentation
├── docker-compose.yml    # Local dev environment
├── Makefile             # Development commands
└── README.md
```

## Key Features (MVP)

### Multi-Tenancy
- Auto-provisioned subdomains (tenant.local.rechub)
- Tenant-scoped data with database-level isolation
- Per-tenant configuration and theming

### Website Builder
- Drag-and-drop page editor
- Controlled block system (Hero, Rich Text, Program Grid, Event List, CTA)
- Live preview and publish workflow
- Automatic navigation generation

### Catalog Management
- Programs CRUD with pricing
- Events with date/time and capacity
- Facilities with availability slots
- Booking request system with email notifications

### Authentication
- Email + password registration
- Argon2id password hashing
- JWT token-based auth
- Role-based access (OWNER, ADMIN, STAFF, VIEWER)

### Media Management
- Direct upload to MinIO
- Presigned URLs for secure access
- Automatic image metadata extraction

## API Reference

### Authentication

```bash
# Register
curl -X POST http://api.local.rechub/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mytentet.local",
    "password": "SecurePass123",
    "department_name": "My City Recreation",
    "department_slug": "mycity"
  }'

# Login
curl -X POST http://api.local.rechub/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mytenant.local",
    "password": "SecurePass123"
  }'
```

### Boot Endpoint

```bash
# Get tenant config, theme, modules, navigation
curl http://api.local.rechub/api/boot \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-Domain: demo.local.rechub"
```

### Pages

```bash
# List pages
curl http://api.local.rechub/api/pages \
  -H "Authorization: Bearer <token>"

# Create page
curl -X POST http://api.local.rechub/api/pages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "about",
    "title": "About Us",
    "published": false
  }'

# Update page
curl -X PUT http://api.local.rechub/api/pages/:id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "published": true}'

# Delete page
curl -X DELETE http://api.local.rechub/api/pages/:id \
  -H "Authorization: Bearer <token>"
```

### Blocks

```bash
# Create block
curl -X POST http://api.local.rechub/api/blocks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "page_id": "...",
    "kind": "hero",
    "order": 1,
    "config": {
      "headline": "Welcome",
      "subheadline": "To our site",
      "ctaText": "Learn More",
      "ctaHref": "/programs"
    }
  }'
```

### Programs

```bash
# List programs
curl http://api.local.rechub/api/programs \
  -H "Authorization: Bearer <token>"

# Create program
curl -X POST http://api.local.rechub/api/programs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Youth Soccer",
    "description": "Ages 5-12",
    "season": "Fall 2024",
    "price_cents": 10000
  }'
```

### Facilities & Bookings

```bash
# List facilities
curl http://api.local.rechub/api/facilities \
  -H "Authorization: Bearer <token>"

# Create facility slot
curl -X POST http://api.local.rechub/api/facility-slots \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "facility_id": "...",
    "starts_at": "2024-12-01T09:00:00Z",
    "ends_at": "2024-12-01T10:00:00Z"
  }'

# Public: Request booking
curl -X POST http://api.local.rechub/api/public/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "resource_type": "facility_slot",
    "resource_id": "...",
    "requester_name": "John Doe",
    "requester_email": "john@example.com"
  }'

# Admin: List bookings
curl http://api.local.rechub/api/bookings \
  -H "Authorization: Bearer <token>"

# Admin: Update booking status
curl -X PUT http://api.local.rechub/api/bookings/:id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

## Development Commands

```bash
make dev              # Start all services
make dev-down        # Stop all services
make migrate         # Run database migrations
make seed-demo       # Seed demo tenant
make demo-reset      # Full reset (down, dev, migrate, seed)
make build           # Build backend and frontend
make test            # Run all tests
make lint            # Run linters
make clean           # Remove artifacts and volumes
```

## Environment Variables

See `.env.local` for development and `.env.demo` for demo environment.

Key variables:
- `POSTGRES_URL`: Database connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for signing JWTs (generate new for production)
- `MINIO_ENDPOINT`: MinIO server URL
- `PUBLIC_BASE_DOMAIN`: Base domain for tenants (local.rechub for dev)

## Deployment

### Pre-Production Checklist
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Update `PUBLIC_BASE_DOMAIN` to your domain
- [ ] Configure production database URL
- [ ] Set up email service (SMTP)
- [ ] Enable HTTPS with Let's Encrypt
- [ ] Configure MinIO for production storage
- [ ] Set up monitoring and logging
- [ ] Run security audit
- [ ] Performance test at scale

### Docker Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

For production, create separate Dockerfile.prod files optimized for size and security.

## Security Notes

- Passwords are hashed with Argon2id
- JWT tokens expire after 24 hours
- All API endpoints validate tenant scoping
- Database queries use parameterized statements
- CORS headers are restrictive
- Content Security Policy headers recommended
- Rate limiting on auth endpoints via Redis

## Performance Optimization

- Database indexes on tenant_id for all multi-tenant tables
- Redis caching for frequently accessed data
- Image lazy-loading with responsive sizes
- Code splitting in frontend build
- Optimized Docker images (multi-stage builds)

## Testing

```bash
# Backend tests
cd apps/backend && go test ./...

# Frontend tests
cd apps/frontend && npm run test

# E2E tests (coming soon)
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linters
4. Submit PR

## License

MIT
