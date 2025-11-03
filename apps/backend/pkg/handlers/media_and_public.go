package handlers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/middleware"
)

// ============ Media ============

type PresignRequest struct {
	Filename string `json:"filename" binding:"required"`
	MimeType string `json:"mime_type" binding:"required"`
}

type PresignResponse struct {
	UploadURL string `json:"upload_url"`
	MediaID   string `json:"media_id"`
}

func (h *Handler) PresignMediaUpload(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req PresignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate media ID
	mediaID := uuid.New()
	path := fmt.Sprintf("tenants/%s/media/%s", claims.TenantID.String(), mediaID.String())

	// TODO: Generate presigned URL from MinIO
	presignedURL := fmt.Sprintf("/api/media/upload/%s", mediaID.String())

	// Store media asset metadata
	ctx := context.Background()
	_, err := h.DB.Exec(ctx,
		`INSERT INTO media_assets (id, tenant_id, path, mime) VALUES ($1, $2, $3, $4)`,
		mediaID, claims.TenantID, path, req.MimeType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to store media"})
		return
	}

	c.JSON(http.StatusOK, PresignResponse{
		UploadURL: presignedURL,
		MediaID:   mediaID.String(),
	})
}

func (h *Handler) GetMediaAsset(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	mediaID := c.Param("id")
	ctx := context.Background()

	var path string
	var mime string
	err := h.DB.QueryRow(ctx,
		`SELECT path, mime FROM media_assets WHERE id = $1 AND tenant_id = $2`,
		mediaID, claims.TenantID).Scan(&path, &mime)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":   mediaID,
		"path": path,
		"mime": mime,
	})
}

// ============ Public Pages ============

func (h *Handler) GetPublicPage(c *gin.Context) {
	slug := c.Param("slug")
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM tenant_domains WHERE domain = $1`,
		tenantDomain).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "tenant not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	// Get page
	var pageID string
	var title string
	var published bool
	err = h.DB.QueryRow(ctx,
		`SELECT id, title, published FROM pages WHERE tenant_id = $1 AND slug = $2`,
		tenantID, slug).Scan(&pageID, &title, &published)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "page not found"})
		return
	}
	if err != nil || !published {
		c.JSON(http.StatusNotFound, gin.H{"error": "page not available"})
		return
	}

	// Get blocks
	rows, err := h.DB.Query(ctx,
		`SELECT id, kind, "order", config FROM page_blocks WHERE page_id = $1 ORDER BY "order" ASC`,
		pageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var blocks []gin.H
	for rows.Next() {
		var id, kind string
		var order int
		var config []byte
		if err := rows.Scan(&id, &kind, &order, &config); err != nil {
			continue
		}
		blocks = append(blocks, gin.H{
			"id":     id,
			"kind":   kind,
			"order":  order,
			"config": config,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"id":     pageID,
		"slug":   slug,
		"title":  title,
		"blocks": blocks,
	})
}

// ============ Public Programs ============

func (h *Handler) GetPublicPrograms(c *gin.Context) {
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM tenant_domains WHERE domain = $1`,
		tenantDomain).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "tenant not found"})
		return
	}

	// Get programs
	rows, err := h.DB.Query(ctx,
		`SELECT id, title, description, price_cents FROM programs
		 WHERE tenant_id = $1 AND status = 'active'
		 ORDER BY created_at DESC LIMIT 12`,
		tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var programs []gin.H
	for rows.Next() {
		var id, title string
		var description *string
		var priceCents int
		if err := rows.Scan(&id, &title, &description, &priceCents); err != nil {
			continue
		}
		programs = append(programs, gin.H{
			"id":           id,
			"title":        title,
			"description":  description,
			"price_cents":  priceCents,
		})
	}

	c.JSON(http.StatusOK, gin.H{"programs": programs})
}

// ============ Public Events ============

func (h *Handler) GetUpcomingEvents(c *gin.Context) {
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM tenant_domains WHERE domain = $1`,
		tenantDomain).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "tenant not found"})
		return
	}

	// Get upcoming events
	rows, err := h.DB.Query(ctx,
		`SELECT id, title, description, starts_at, ends_at, location, capacity FROM events
		 WHERE tenant_id = $1 AND starts_at > now()
		 ORDER BY starts_at ASC LIMIT 10`,
		tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var events []gin.H
	for rows.Next() {
		var id, title string
		var description, location *string
		var startsAt, endsAt time.Time
		var capacity *int
		if err := rows.Scan(&id, &title, &description, &startsAt, &endsAt, &location, &capacity); err != nil {
			continue
		}
		events = append(events, gin.H{
			"id":          id,
			"title":       title,
			"description": description,
			"starts_at":   startsAt,
			"ends_at":     endsAt,
			"location":    location,
			"capacity":    capacity,
		})
	}

	c.JSON(http.StatusOK, gin.H{"events": events})
}

// ============ Public Facilities ============

func (h *Handler) GetPublicFacilities(c *gin.Context) {
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM tenant_domains WHERE domain = $1`,
		tenantDomain).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "tenant not found"})
		return
	}

	// Get facilities with available slots count
	rows, err := h.DB.Query(ctx,
		`SELECT f.id, f.name, f.type, f.address,
		        COUNT(fs.id) as available_slots
		 FROM facilities f
		 LEFT JOIN facility_slots fs ON f.id = fs.facility_id AND fs.status = 'open'
		 WHERE f.tenant_id = $1
		 GROUP BY f.id, f.name, f.type, f.address
		 ORDER BY f.created_at DESC LIMIT 12`,
		tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var facilities []gin.H
	for rows.Next() {
		var id, name, ftype, address string
		var slots int
		if err := rows.Scan(&id, &name, &ftype, &address, &slots); err != nil {
			continue
		}
		facilities = append(facilities, gin.H{
			"id":               id,
			"name":             name,
			"type":             ftype,
			"address":          address,
			"available_slots":  slots,
		})
	}

	c.JSON(http.StatusOK, gin.H{"facilities": facilities})
}

// ============ Boot Endpoint ============

type BootResponse struct {
	Tenant  gin.H `json:"tenant"`
	Theme   gin.H `json:"theme"`
	Modules gin.H `json:"modules"`
	Nav     []gin.H `json:"nav"`
}

func (h *Handler) BootHandler(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		// For public boot, get from tenant domain
		tenantDomain := middleware.GetTenantIDFromContext(c)
		ctx := context.Background()

		var tenantID, tenantName, tenantSlug string
		err := h.DB.QueryRow(ctx,
			`SELECT t.id, t.name, t.slug FROM tenants t
			 JOIN tenant_domains td ON t.id = td.tenant_id
			 WHERE td.domain = $1`,
			tenantDomain).Scan(&tenantID, &tenantName, &tenantSlug)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "tenant not found"})
			return
		}

		// Get public pages for navigation
		rows, err := h.DB.Query(ctx,
			`SELECT slug, title FROM pages WHERE tenant_id = $1 AND published = true ORDER BY created_at ASC`,
			tenantID)
		if err == nil {
			defer rows.Close()
			var nav []gin.H
			for rows.Next() {
				var slug, title string
				if err := rows.Scan(&slug, &title); err == nil {
					nav = append(nav, gin.H{"slug": slug, "title": title})
				}
			}
			c.JSON(http.StatusOK, gin.H{
				"tenant": gin.H{"name": tenantName, "slug": tenantSlug},
				"theme":  gin.H{},
				"modules": gin.H{},
				"nav":    nav,
			})
			return
		}
	}

	// Default response
	c.JSON(http.StatusOK, gin.H{
		"tenant":  gin.H{},
		"theme":   gin.H{},
		"modules": gin.H{},
		"nav":     []gin.H{},
	})
}

// ============ Sitemap ============

func (h *Handler) GetSitemap(c *gin.Context) {
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM tenant_domains WHERE domain = $1`,
		tenantDomain).Scan(&tenantID)
	if err != nil {
		c.Header("Content-Type", "application/xml")
		c.String(http.StatusNotFound, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`)
		return
	}

	// Get published pages
	rows, err := h.DB.Query(ctx,
		`SELECT slug, updated_at FROM pages WHERE tenant_id = $1 AND published = true`,
		tenantID)
	if err != nil {
		c.Header("Content-Type", "application/xml")
		c.String(http.StatusOK, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`)
		return
	}
	defer rows.Close()

	xml := `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

	// Add home page
	xml += fmt.Sprintf(`
  <url>
    <loc>https://%s/</loc>
    <lastmod>%s</lastmod>
    <priority>1.0</priority>
  </url>`, tenantDomain, time.Now().Format("2006-01-02"))

	// Add published pages
	for rows.Next() {
		var slug string
		var updatedAt time.Time
		if err := rows.Scan(&slug, &updatedAt); err == nil && slug != "home" {
			xml += fmt.Sprintf(`
  <url>
    <loc>https://%s/%s</loc>
    <lastmod>%s</lastmod>
    <priority>0.8</priority>
  </url>`, tenantDomain, slug, updatedAt.Format("2006-01-02"))
		}
	}

	xml += `
</urlset>`

	c.Header("Content-Type", "application/xml")
	c.String(http.StatusOK, xml)
}
