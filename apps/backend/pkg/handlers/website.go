package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rec-hub/backend/pkg/middleware"
)

type WebsiteConfig struct {
	Template     string            `json:"template"`
	ThemePreset  string            `json:"themePreset"`
	EnabledPages map[string]bool   `json:"enabledPages"`
	Hero         HeroConfig        `json:"hero"`
	Published    bool              `json:"published"`
	PublishedAt  *time.Time        `json:"publishedAt,omitempty"`
}

type HeroConfig struct {
	Headline        string  `json:"headline"`
	Subheadline     string  `json:"subheadline"`
	CtaText         string  `json:"ctaText"`
	CtaLink         string  `json:"ctaLink"`
	BackgroundImage *string `json:"backgroundImage,omitempty"`
}

type TenantSettings struct {
	Branding map[string]interface{} `json:"branding"`
	Theme    map[string]interface{} `json:"theme"`
	Config   map[string]interface{} `json:"config"`
}

// GetWebsiteConfig returns the current website configuration
func (h *Handler) GetWebsiteConfig(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()

	var configJSON []byte
	err := h.DB.QueryRow(ctx,
		`SELECT config FROM tenant_settings WHERE tenant_id = $1`,
		tenantID).Scan(&configJSON)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch website config"})
		return
	}

	var config map[string]interface{}
	if err := json.Unmarshal(configJSON, &config); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse config"})
		return
	}

	// Extract website config or return defaults
	websiteConfig := getWebsiteConfigOrDefaults(config)

	c.JSON(http.StatusOK, websiteConfig)
}

// UpdateWebsiteConfig updates the website configuration
func (h *Handler) UpdateWebsiteConfig(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Check if user is OWNER or ADMIN
	if claims.Role != "OWNER" && claims.Role != "ADMIN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()

	var websiteConfig WebsiteConfig
	if err := c.ShouldBindJSON(&websiteConfig); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate template
	validTemplates := map[string]bool{
		"classic_civic": true,
		"modern_grid":   true,
		"parks_trails":  true,
	}
	if !validTemplates[websiteConfig.Template] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid template"})
		return
	}

	// Get current config
	var configJSON []byte
	err := h.DB.QueryRow(ctx,
		`SELECT config FROM tenant_settings WHERE tenant_id = $1`,
		tenantID).Scan(&configJSON)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch current config"})
		return
	}

	var config map[string]interface{}
	if err := json.Unmarshal(configJSON, &config); err != nil {
		config = make(map[string]interface{})
	}

	// Update website section
	config["website"] = websiteConfig

	// Marshal back to JSON
	updatedConfigJSON, err := json.Marshal(config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encode config"})
		return
	}

	// Update in database
	_, err = h.DB.Exec(ctx,
		`UPDATE tenant_settings
		SET config = $1, updated_at = $2
		WHERE tenant_id = $3`,
		updatedConfigJSON, time.Now(), tenantID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update config"})
		return
	}

	c.JSON(http.StatusOK, websiteConfig)
}

// PublishWebsite marks the website as published
func (h *Handler) PublishWebsite(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Check if user is OWNER or ADMIN
	if claims.Role != "OWNER" && claims.Role != "ADMIN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()

	// Get current config
	var configJSON []byte
	err := h.DB.QueryRow(ctx,
		`SELECT config FROM tenant_settings WHERE tenant_id = $1`,
		tenantID).Scan(&configJSON)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch config"})
		return
	}

	var config map[string]interface{}
	if err := json.Unmarshal(configJSON, &config); err != nil {
		config = make(map[string]interface{})
	}

	// Get website config
	websiteRaw, ok := config["website"]
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "website config not found"})
		return
	}

	websiteBytes, _ := json.Marshal(websiteRaw)
	var websiteConfig WebsiteConfig
	if err := json.Unmarshal(websiteBytes, &websiteConfig); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse website config"})
		return
	}

	// Mark as published
	now := time.Now()
	websiteConfig.Published = true
	websiteConfig.PublishedAt = &now

	config["website"] = websiteConfig

	// Marshal and update
	updatedConfigJSON, err := json.Marshal(config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encode config"})
		return
	}

	_, err = h.DB.Exec(ctx,
		`UPDATE tenant_settings
		SET config = $1, updated_at = $2
		WHERE tenant_id = $3`,
		updatedConfigJSON, time.Now(), tenantID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to publish website"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"published":   true,
		"publishedAt": now,
	})
}

// GetPublicWebsiteConfig returns the published website config for public use
func (h *Handler) GetPublicWebsiteConfig(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDCtxKey)
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tenant not found"})
		return
	}

	ctx := context.Background()

	var configJSON []byte
	err := h.DB.QueryRow(ctx,
		`SELECT config FROM tenant_settings WHERE tenant_id = $1`,
		tenantID).Scan(&configJSON)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch config"})
		return
	}

	var config map[string]interface{}
	if err := json.Unmarshal(configJSON, &config); err != nil {
		c.JSON(http.StatusOK, getDefaultWebsiteConfig())
		return
	}

	websiteConfig := getWebsiteConfigOrDefaults(config)

	// Only return if published
	if !websiteConfig.Published {
		c.JSON(http.StatusOK, getDefaultWebsiteConfig())
		return
	}

	c.JSON(http.StatusOK, websiteConfig)
}

func getWebsiteConfigOrDefaults(config map[string]interface{}) WebsiteConfig {
	websiteRaw, ok := config["website"]
	if !ok {
		return getDefaultWebsiteConfig()
	}

	websiteBytes, _ := json.Marshal(websiteRaw)
	var websiteConfig WebsiteConfig
	if err := json.Unmarshal(websiteBytes, &websiteConfig); err != nil {
		return getDefaultWebsiteConfig()
	}

	return websiteConfig
}

func getDefaultWebsiteConfig() WebsiteConfig {
	return WebsiteConfig{
		Template:    "classic_civic",
		ThemePreset: "default",
		EnabledPages: map[string]bool{
			"events":     true,
			"programs":   true,
			"facilities": true,
			"news":       false,
			"contact":    true,
			"faq":        false,
		},
		Hero: HeroConfig{
			Headline:    "Welcome to Our Recreation Department",
			Subheadline: "Discover programs, events, and facilities in your community",
			CtaText:     "Explore Programs",
			CtaLink:     "/programs",
		},
		Published: false,
	}
}
