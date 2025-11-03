package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/middleware"
	"github.com/rec-hub/backend/pkg/models"
)

type PageRequest struct {
	Slug      string                 `json:"slug" binding:"required"`
	Title     string                 `json:"title" binding:"required"`
	Meta      map[string]interface{} `json:"meta"`
	Published bool                   `json:"published"`
}

type PageResponse struct {
	ID        string                 `json:"id"`
	TenantID  string                 `json:"tenant_id"`
	Slug      string                 `json:"slug"`
	Title     string                 `json:"title"`
	Meta      map[string]interface{} `json:"meta"`
	Published bool                   `json:"published"`
	CreatedAt string                 `json:"created_at"`
	UpdatedAt string                 `json:"updated_at"`
}

// ListPages returns all pages for the tenant
func (h *Handler) ListPages(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()
	rows, err := h.DB.Query(ctx,
		`SELECT id, tenant_id, slug, title, meta, published, created_at, updated_at
		 FROM pages WHERE tenant_id = $1 ORDER BY created_at DESC`,
		claims.TenantID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var pages []PageResponse
	for rows.Next() {
		var page models.Page
		if err := rows.Scan(&page.ID, &page.TenantID, &page.Slug, &page.Title,
			&page.Meta, &page.Published, &page.CreatedAt, &page.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
			return
		}

		var meta map[string]interface{}
		if err := json.Unmarshal(page.Meta, &meta); err != nil {
			meta = make(map[string]interface{})
		}

		pages = append(pages, PageResponse{
			ID:        page.ID.String(),
			TenantID:  page.TenantID.String(),
			Slug:      page.Slug,
			Title:     page.Title,
			Meta:      meta,
			Published: page.Published,
			CreatedAt: page.CreatedAt.String(),
			UpdatedAt: page.UpdatedAt.String(),
		})
	}

	c.JSON(http.StatusOK, gin.H{"pages": pages})
}

// CreatePage creates a new page
func (h *Handler) CreatePage(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req PageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	pageID := uuid.New()

	metaJSON, _ := json.Marshal(req.Meta)

	_, err := h.DB.Exec(ctx,
		`INSERT INTO pages (id, tenant_id, slug, title, meta, published)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		pageID, claims.TenantID, req.Slug, req.Title, metaJSON, req.Published)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create page"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":        pageID.String(),
		"tenant_id": claims.TenantID.String(),
		"slug":      req.Slug,
		"title":     req.Title,
		"published": req.Published,
	})
}

// UpdatePage updates a page
func (h *Handler) UpdatePage(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	pageID := c.Param("id")
	var req PageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify page belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM pages WHERE id = $1`,
		pageID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "page not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	metaJSON, _ := json.Marshal(req.Meta)

	_, err = h.DB.Exec(ctx,
		`UPDATE pages SET slug = $1, title = $2, meta = $3, published = $4, updated_at = now()
		 WHERE id = $5`,
		req.Slug, req.Title, metaJSON, req.Published, pageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update page"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// DeletePage deletes a page
func (h *Handler) DeletePage(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	pageID := c.Param("id")
	ctx := context.Background()

	// Verify page belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM pages WHERE id = $1`,
		pageID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "page not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	// Delete blocks first (cascade)
	_, _ = h.DB.Exec(ctx, `DELETE FROM page_blocks WHERE page_id = $1`, pageID)

	// Delete page
	_, err = h.DB.Exec(ctx, `DELETE FROM pages WHERE id = $1`, pageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete page"})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}
