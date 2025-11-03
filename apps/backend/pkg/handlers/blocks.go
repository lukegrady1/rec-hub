package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/middleware"
)

type BlockRequest struct {
	PageID uuid.UUID              `json:"page_id" binding:"required"`
	Kind   string                 `json:"kind" binding:"required"`
	Order  int                    `json:"order" binding:"required"`
	Config map[string]interface{} `json:"config"`
}

type BlockResponse struct {
	ID        string                 `json:"id"`
	PageID    string                 `json:"page_id"`
	Kind      string                 `json:"kind"`
	Order     int                    `json:"order"`
	Config    map[string]interface{} `json:"config"`
	CreatedAt string                 `json:"created_at"`
	UpdatedAt string                 `json:"updated_at"`
}

// CreateBlock creates a new page block
func (h *Handler) CreateBlock(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req BlockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify page belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM pages WHERE id = $1`,
		req.PageID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "page not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	blockID := uuid.New()
	configJSON, _ := json.Marshal(req.Config)

	_, err = h.DB.Exec(ctx,
		`INSERT INTO page_blocks (id, page_id, kind, "order", config)
		 VALUES ($1, $2, $3, $4, $5)`,
		blockID, req.PageID, req.Kind, req.Order, configJSON)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create block"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":      blockID.String(),
		"page_id": req.PageID.String(),
		"kind":    req.Kind,
		"order":   req.Order,
	})
}

// UpdateBlock updates a page block
func (h *Handler) UpdateBlock(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	blockID := c.Param("id")
	var req BlockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify block belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT p.tenant_id FROM page_blocks pb
		 JOIN pages p ON pb.page_id = p.id
		 WHERE pb.id = $1`,
		blockID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "block not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	configJSON, _ := json.Marshal(req.Config)

	_, err = h.DB.Exec(ctx,
		`UPDATE page_blocks SET kind = $1, "order" = $2, config = $3, updated_at = now()
		 WHERE id = $4`,
		req.Kind, req.Order, configJSON, blockID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update block"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// DeleteBlock deletes a page block
func (h *Handler) DeleteBlock(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	blockID := c.Param("id")
	ctx := context.Background()

	// Verify block belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT p.tenant_id FROM page_blocks pb
		 JOIN pages p ON pb.page_id = p.id
		 WHERE pb.id = $1`,
		blockID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "block not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx, `DELETE FROM page_blocks WHERE id = $1`, blockID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete block"})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}
