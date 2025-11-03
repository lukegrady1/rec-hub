.PHONY: dev dev-down migrate seed-demo demo-reset help lint test build clean

help:
	@echo "Rec Hub MVP - Development Commands"
	@echo ""
	@echo "make dev           - Start all services (docker-compose up)"
	@echo "make dev-down      - Stop all services (docker-compose down)"
	@echo "make migrate       - Run database migrations"
	@echo "make seed-demo     - Seed demo tenant with sample data"
	@echo "make demo-reset    - Drop and re-seed demo data"
	@echo "make build         - Build backend and frontend"
	@echo "make test          - Run tests"
	@echo "make lint          - Run linters"
	@echo "make clean         - Remove build artifacts and volumes"

dev:
	docker-compose up -d
	@echo ""
	@echo "Services starting..."
	@echo "Frontend:   http://localhost:5173"
	@echo "API:        http://localhost:8000"
	@echo "Traefik:    http://localhost:8080"
	@echo "MinIO:      http://localhost:9001 (minio/minio123)"
	@echo "MailHog:    http://localhost:8025"
	@echo "Postgres:   localhost:5432 (recuser/recpass)"
	@echo ""
	@echo "Dev domains:"
	@echo "  api.local.rechub       - Backend API"
	@echo "  demo.local.rechub      - Demo tenant"
	@echo "  [subdomain].local.rechub - Custom tenant"

dev-down:
	docker-compose down

migrate:
	@echo "Running migrations..."
	cd apps/backend && go run cmd/migrate/main.go

seed-demo:
	@echo "Seeding demo tenant..."
	cd apps/backend && go run cmd/seed/main.go

demo-reset: dev-down dev migrate seed-demo
	@echo "Demo reset complete!"

build:
	@echo "Building backend..."
	cd apps/backend && go build -o bin/server cmd/server/main.go
	@echo "Building frontend..."
	cd apps/frontend && npm run build

test:
	@echo "Testing backend..."
	cd apps/backend && go test ./...
	@echo "Testing frontend..."
	cd apps/frontend && npm run test

lint:
	@echo "Linting backend..."
	cd apps/backend && golangci-lint run ./...
	@echo "Linting frontend..."
	cd apps/frontend && npm run lint

clean:
	docker-compose down -v
	cd apps/backend && rm -rf bin/
	cd apps/frontend && rm -rf dist/ node_modules/
	@echo "Cleaned up artifacts and volumes"
