package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/middleware"
)

type TenantSettingsRequest struct {
	Branding map[string]interface{} `json:"branding"`
	Theme    map[string]interface{} `json:"theme"`
	Config   map[string]interface{} `json:"config"`
}

type TenantSettingsResponse struct {
	Branding map[string]interface{} `json:"branding"`
	Theme    map[string]interface{} `json:"theme"`
	Config   map[string]interface{} `json:"config"`
}

// GetTenantSettings returns the tenant settings
func (h *Handler) GetTenantSettings(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()

	var branding, theme, config []byte
	err := h.DB.QueryRow(ctx,
		`SELECT branding, theme, config FROM tenant_settings WHERE tenant_id = $1`,
		claims.TenantID.String()).Scan(&branding, &theme, &config)

	if err == pgx.ErrNoRows {
		// Create default settings if not exists
		_, err = h.DB.Exec(ctx,
			`INSERT INTO tenant_settings (tenant_id, branding, theme, config)
			 VALUES ($1, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)`,
			claims.TenantID.String())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create settings"})
			return
		}
		c.JSON(http.StatusOK, TenantSettingsResponse{
			Branding: make(map[string]interface{}),
			Theme:    make(map[string]interface{}),
			Config:   make(map[string]interface{}),
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	var brandingMap, themeMap, configMap map[string]interface{}
	if err := json.Unmarshal(branding, &brandingMap); err != nil {
		brandingMap = make(map[string]interface{})
	}
	if err := json.Unmarshal(theme, &themeMap); err != nil {
		themeMap = make(map[string]interface{})
	}
	if err := json.Unmarshal(config, &configMap); err != nil {
		configMap = make(map[string]interface{})
	}

	c.JSON(http.StatusOK, TenantSettingsResponse{
		Branding: brandingMap,
		Theme:    themeMap,
		Config:   configMap,
	})
}

// UpdateTenantSettings updates tenant settings
func (h *Handler) UpdateTenantSettings(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req TenantSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	brandingJSON, _ := json.Marshal(req.Branding)
	themeJSON, _ := json.Marshal(req.Theme)
	configJSON, _ := json.Marshal(req.Config)

	// Try to update first
	result, err := h.DB.Exec(ctx,
		`UPDATE tenant_settings
		 SET branding = $1, theme = $2, config = $3, updated_at = now()
		 WHERE tenant_id = $4`,
		brandingJSON, themeJSON, configJSON, claims.TenantID.String())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update settings"})
		return
	}

	// If no rows updated, insert instead
	if result.RowsAffected() == 0 {
		_, err = h.DB.Exec(ctx,
			`INSERT INTO tenant_settings (tenant_id, branding, theme, config)
			 VALUES ($1, $2, $3, $4)`,
			claims.TenantID.String(), brandingJSON, themeJSON, configJSON)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create settings"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
