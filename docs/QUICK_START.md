# Rec Hub - Quick Start Guide

Get Rec Hub running in 5 minutes.

## Prerequisites

- Docker & Docker Compose
- Make
- Git

## Installation

### 1. Start Services

```bash
make dev
```

This starts:
- PostgreSQL database
- Redis cache
- MinIO object storage
- Traefik router
- MailHog email testing
- Backend API
- Frontend SPA

### 2. Run Migrations

In a new terminal:

```bash
make migrate
```

### 3. Seed Demo Data

```bash
make seed-demo
```

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main app |
| Admin Panel | http://localhost:5173/admin | Tenant management |
| API | http://api.local.rechub | REST API |
| MailHog | http://localhost:8025 | Email preview |
| MinIO | http://localhost:9001 | File storage console |
| Traefik | http://localhost:8080 | Router dashboard |

## Demo Credentials

- **Email**: admin@demo.local
- **Password**: DemoPass123!
- **Access At**: http://demo.local.rechub

## Configure DNS (Optional)

To use local domain names like `demo.local.rechub`, add to `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 api.local.rechub
127.0.0.1 demo.local.rechub
127.0.0.1 *.local.rechub
```

## Common Commands

```bash
# Stop all services
make dev-down

# Reset everything (careful!)
make demo-reset

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run database migrations
make migrate

# Build production images
make build

# Run tests
make test
```

## First Steps

1. **Sign up** at http://localhost:5173/register
   - Create a new recreation department
   - This auto-provisions a subdomain and database

2. **Login** at http://localhost:5173/login
   - Use credentials from step 1

3. **Admin Dashboard** (http://localhost:5173/admin)
   - Configure branding
   - Create programs, events, facilities
   - Manage bookings
   - Edit website pages

4. **Public Site**
   - Access at your tenant's subdomain (e.g., http://mycity.local.rechub)
   - Displays homepage with programs and events
   - Residents can request facility bookings

## Troubleshooting

### Port Already in Use

Change ports in `docker-compose.yml`:
- Backend: Change `8000:8000` → `8001:8000`
- Frontend: Change `5173:5173` → `5174:5173`

### Database Connection Failed

Ensure Postgres is running:
```bash
docker ps | grep rec-postgres
```

If not, restart services:
```bash
make dev-down
make dev
make migrate
```

### Email Not Sending

MailHog is configured for development. In production, update `SMTP_HOST` in `.env.local`.

## Next Steps

- [Full Documentation](./README.md)
- [API Reference](./API.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Support

For issues:
1. Check Docker logs: `docker-compose logs`
2. Review `.env.local` configuration
3. Ensure all services are healthy: `docker-compose ps`
