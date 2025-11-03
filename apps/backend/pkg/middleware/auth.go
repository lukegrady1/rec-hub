package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rec-hub/backend/pkg/auth"
	"github.com/rec-hub/backend/pkg/config"
)

const ClaimsCtxKey = "claims"

// AuthMiddleware validates JWT token and extracts claims
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "missing authorization header"})
			c.Abort()
			return
		}

		// Extract bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(401, gin.H{"error": "invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Verify token
		claims, err := auth.VerifyToken(tokenString, cfg.JWTSecret)
		if err != nil {
			c.JSON(401, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		// Store claims in context
		c.Set(ClaimsCtxKey, claims)
		c.Set(TenantIDCtxKey, claims.TenantID.String())

		c.Next()
	}
}

// GetClaimsFromContext retrieves JWT claims from context
func GetClaimsFromContext(c *gin.Context) *auth.Claims {
	val, exists := c.Get(ClaimsCtxKey)
	if !exists {
		return nil
	}
	return val.(*auth.Claims)
}
