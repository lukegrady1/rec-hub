package handlers

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/rec-hub/backend/pkg/config"
)

// Handler holds dependencies for all HTTP handlers
type Handler struct {
	DB       *pgxpool.Pool
	Redis    *redis.Client
	Config   *config.Config
	TenantID string // Set by middleware
}
