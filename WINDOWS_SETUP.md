# Rec Hub - Windows Setup Guide

## Prerequisites

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
2. **Go 1.21+** - [Download here](https://go.dev/dl/)
3. **Node.js 20+** - [Download here](https://nodejs.org/)

## Quick Start (Recommended)

### Option 1: Using PowerShell Script (Easiest)

```powershell
# Make sure Docker Desktop is running first!

# Run the startup script
.\start-dev.ps1
```

This will:
- ✅ Start all infrastructure services (PostgreSQL, Redis, MinIO, MailHog)
- ✅ Run database migrations
- ✅ Seed demo data
- ✅ Show you next steps

### Option 2: Manual Setup

#### 1. Start Infrastructure

```powershell
# Start just the infrastructure (no app containers)
docker-compose -f docker-compose.dev.yml up -d

# Wait a few seconds for PostgreSQL to initialize
```

#### 2. Run Migrations

```powershell
cd apps\backend
go run .\cmd\migrate\main.go
```

#### 3. Seed Demo Data

```powershell
go run .\cmd\seed\main.go
cd ..\..
```

#### 4. Start Backend

```powershell
cd apps\backend
go run .\cmd\server\main.go
```

Leave this running. Open a new PowerShell window for the frontend.

#### 5. Start Frontend

```powershell
cd apps\frontend
npm install
npm run dev
```

#### 6. Access the Application

- 🏠 **Frontend**: http://localhost:5173
- 📧 **MailHog**: http://localhost:8025
- 💾 **MinIO Console**: http://localhost:9001 (minio/minio123)

**Demo Credentials:**
- Email: `admin@demo.local`
- Password: `DemoPass123!`

## Troubleshooting

### "Docker is not running"

Make sure Docker Desktop is started. You should see the Docker icon in your system tray.

### "Port already in use"

If port 5432, 6379, or 8000 is already in use:

```powershell
# Check what's using the port
netstat -ano | findstr :5432

# Stop the service or change the port in docker-compose.dev.yml
```

### "go: command not found"

Install Go from https://go.dev/dl/ and make sure it's in your PATH.

### "npm: command not found"

Install Node.js from https://nodejs.org/ and make sure it's in your PATH.

### Database Connection Failed

```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Check logs
docker logs rec-postgres

# Restart if needed
docker-compose -f docker-compose.dev.yml restart postgres
```

## DNS Configuration (Optional but Recommended)

For multi-tenant subdomains to work locally, edit:
**C:\Windows\System32\drivers\etc\hosts**

(Run Notepad as Administrator to edit)

Add these lines:
```
127.0.0.1 api.local.rechub
127.0.0.1 demo.local.rechub
127.0.0.1 localhost.local.rechub
```

## Stopping Services

```powershell
# Stop infrastructure services
docker-compose -f docker-compose.dev.yml down

# Stop backend - Press Ctrl+C in the backend terminal

# Stop frontend - Press Ctrl+C in the frontend terminal
```

## Common Commands

```powershell
# View running containers
docker ps

# View logs for a service
docker logs rec-postgres
docker logs rec-redis

# Restart a service
docker-compose -f docker-compose.dev.yml restart postgres

# Clean everything (removes data!)
docker-compose -f docker-compose.dev.yml down -v
```

## Development Workflow

1. **Make changes to backend code** → Backend auto-reloads (you may need to manually restart)
2. **Make changes to frontend code** → Vite auto-reloads (hot reload)
3. **Database changes** → Run new migrations with `go run .\cmd\migrate\main.go`

## VS Code Setup (Recommended)

Install these extensions:
- **Go** (by Go Team at Google)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**

## Alternative: Using WSL2

If you prefer a Linux environment:

```powershell
# Install WSL2
wsl --install

# Open WSL terminal
wsl

# Navigate to project
cd /mnt/c/Users/Luke/rec-hub/rec-hub

# Use Linux commands
make dev
```

## Next Steps

See the main [README.md](./README.md) for:
- API documentation
- Architecture overview
- Deployment guides
- Feature documentation

## Getting Help

- Check [QUICK_START.md](./docs/QUICK_START.md)
- Check [API.md](./docs/API.md)
- Check [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Notes

- The `docker-compose.yml` file tries to build Docker images, but requires `package-lock.json`
- The `docker-compose.dev.yml` file only runs infrastructure (recommended for development)
- You can run the apps locally with `go run` and `npm run dev` for faster development
