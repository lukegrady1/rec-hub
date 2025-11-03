package middleware

import (
	"context"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rec-hub/backend/pkg/config"
)

const TenantIDCtxKey = "tenant_id"
const TenantCtxKey = "tenant"

// TenantResolver extracts tenant from request host and resolves tenant_id
func TenantResolver(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get host from request
		host := c.Request.Host

		// Remove port if present (for local development)
		if idx := strings.LastIndex(host, ":"); idx != -1 {
			host = host[:idx]
		}

		// For API routes, extract tenant from subdomain
		// For public routes, extract from header or use default
		var tenantDomain string
		if strings.HasPrefix(host, "api.") {
			// API calls might include tenant in header
			tenantDomain = c.GetHeader("X-Tenant-Domain")
		} else {
			tenantDomain = host
		}

		// Store in context for handlers to use
		c.Set(TenantIDCtxKey, tenantDomain)
		c.Next()
	}
}

// GetTenantID retrieves tenant ID from context
// This requires a database lookup which should be done by handlers
func GetTenantIDFromContext(c *gin.Context) string {
	val, exists := c.Get(TenantIDCtxKey)
	if !exists {
		return ""
	}
	return val.(string)
}

// ResolveTenantID looks up tenant_id from domain in database
func ResolveTenantID(ctx context.Context, pool *pgxpool.Pool, domain string) (string, error) {
	var tenantID string
	err := pool.QueryRow(ctx,
		`SELECT tenant_id FROM tenant_domains WHERE domain = $1`,
		domain).Scan(&tenantID)
	if err != nil {
		return "", err
	}
	return tenantID, nil
}
