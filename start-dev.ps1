# Rec Hub Development Startup Script for Windows
Write-Host "🚀 Starting Rec Hub Development Environment..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker ps > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Docker is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker is running" -ForegroundColor Green

# Start infrastructure services
Write-Host "`n📦 Starting infrastructure services..." -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Infrastructure services started" -ForegroundColor Green

# Wait for PostgreSQL to be ready
Write-Host "`n⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

$maxAttempts = 30
$attempt = 0
$ready = $false

while (-not $ready -and $attempt -lt $maxAttempts) {
    try {
        docker exec rec-postgres pg_isready -U recuser -d rec > $null 2>&1
        if ($LASTEXITCODE -eq 0) {
            $ready = $true
        }
    } catch {
        # Continue waiting
    }

    if (-not $ready) {
        Start-Sleep -Seconds 1
        $attempt++
        Write-Host "." -NoNewline
    }
}

if (-not $ready) {
    Write-Host "`n❌ PostgreSQL failed to start" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ PostgreSQL is ready" -ForegroundColor Green

# Run migrations
Write-Host "`n📊 Running database migrations..." -ForegroundColor Cyan

Set-Location apps\backend

if (Test-Path "go.mod") {
    Write-Host "Installing Go dependencies..." -ForegroundColor Yellow
    go mod download

    Write-Host "Running migrations..." -ForegroundColor Yellow
    go run ./cmd/migrate/main.go

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migrations completed" -ForegroundColor Green

        # Seed demo data
        Write-Host "`n🌱 Seeding demo data..." -ForegroundColor Cyan
        go run ./cmd/seed/main.go

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Demo data seeded" -ForegroundColor Green
        } else {
            Write-Host "⚠ Demo seed failed (migrations may have already run)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠ Migrations may have already run" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Go module not found in apps/backend" -ForegroundColor Red
}

Set-Location ..\..

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Development Environment Ready!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor White
Write-Host "  PostgreSQL:  localhost:5432" -ForegroundColor Gray
Write-Host "  Redis:       localhost:6379" -ForegroundColor Gray
Write-Host "  MinIO:       http://localhost:9001 (minio/minio123)" -ForegroundColor Gray
Write-Host "  MailHog:     http://localhost:8025" -ForegroundColor Gray
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor White
Write-Host "  Email:     admin@demo.local" -ForegroundColor Gray
Write-Host "  Password:  DemoPass123!" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Start backend:   cd apps/backend && go run ./cmd/server/main.go" -ForegroundColor Yellow
Write-Host "  2. Start frontend:  cd apps/frontend && npm install && npm run dev" -ForegroundColor Yellow
Write-Host "  3. Visit:           http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop services:   docker-compose -f docker-compose.dev.yml down" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
