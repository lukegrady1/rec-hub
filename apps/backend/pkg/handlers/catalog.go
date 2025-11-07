package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/middleware"
	"github.com/rec-hub/backend/pkg/models"
)

// ============ Programs ============

type ProgramRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description *string `json:"description"`
	Season      *string `json:"season"`
	Category    *string `json:"category"`
	StartDate   *string `json:"start_date"`
	EndDate     *string `json:"end_date"`
	PriceCents  int     `json:"price_cents"`
	Status      *string `json:"status"`
	ImageURL    *string `json:"image_url"`
	Slug        *string `json:"slug"`
}

type ProgramResponse struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description *string `json:"description"`
	Season      *string `json:"season"`
	Category    *string `json:"category"`
	StartDate   *string `json:"start_date"`
	EndDate     *string `json:"end_date"`
	PriceCents  int     `json:"price_cents"`
	Status      string  `json:"status"`
	ImageURL    *string `json:"image_url"`
	Slug        *string `json:"slug"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

func (h *Handler) ListPrograms(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()
	rows, err := h.DB.Query(ctx,
		`SELECT id, title, description, season, category, start_date, end_date, price_cents, status, image_url, slug, created_at, updated_at
		 FROM programs WHERE tenant_id = $1 ORDER BY created_at DESC`,
		claims.TenantID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var programs []ProgramResponse
	for rows.Next() {
		var p ProgramResponse
		var desc, season, category, startDate, endDate, imageURL, slug *string
		var id string
		var priceCents int
		var status string
		var createdAt, updatedAt time.Time

		if err := rows.Scan(&id, &p.Title, &desc, &season, &category, &startDate, &endDate, &priceCents, &status, &imageURL, &slug, &createdAt, &updatedAt); err != nil {
			continue
		}

		programs = append(programs, ProgramResponse{
			ID:          id,
			Title:       p.Title,
			Description: desc,
			Season:      season,
			Category:    category,
			StartDate:   startDate,
			EndDate:     endDate,
			PriceCents:  priceCents,
			Status:      status,
			ImageURL:    imageURL,
			Slug:        slug,
			CreatedAt:   createdAt.Format(time.RFC3339),
			UpdatedAt:   updatedAt.Format(time.RFC3339),
		})
	}

	c.JSON(http.StatusOK, gin.H{"programs": programs})
}

func (h *Handler) CreateProgram(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req ProgramRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	programID := uuid.New()

	// Default status to 'active' if not provided
	status := "active"
	if req.Status != nil {
		status = *req.Status
	}

	_, err := h.DB.Exec(ctx,
		`INSERT INTO programs (id, tenant_id, title, description, season, category, start_date, end_date, price_cents, status, image_url, slug)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
		programID, claims.TenantID, req.Title, req.Description, req.Season, req.Category, req.StartDate, req.EndDate, req.PriceCents, status, req.ImageURL, req.Slug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create program"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": programID.String()})
}

func (h *Handler) UpdateProgram(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	programID := c.Param("id")
	var req ProgramRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx, `SELECT tenant_id FROM programs WHERE id = $1`, programID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	// Get current status if not provided
	status := "active"
	if req.Status != nil {
		status = *req.Status
	}

	_, err = h.DB.Exec(ctx,
		`UPDATE programs SET title = $1, description = $2, season = $3, category = $4, start_date = $5, end_date = $6,
		                     price_cents = $7, status = $8, image_url = $9, slug = $10, updated_at = now()
		 WHERE id = $11`,
		req.Title, req.Description, req.Season, req.Category, req.StartDate, req.EndDate, req.PriceCents, status, req.ImageURL, req.Slug, programID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *Handler) DeleteProgram(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	programID := c.Param("id")
	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx, `SELECT tenant_id FROM programs WHERE id = $1`, programID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx, `UPDATE programs SET status = 'archived' WHERE id = $1`, programID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}

// ============ Events ============

type EventRequest struct {
	Title       string `json:"title" binding:"required"`
	Description *string `json:"description"`
	StartsAt    time.Time `json:"starts_at" binding:"required"`
	EndsAt      time.Time `json:"ends_at" binding:"required"`
	Location    *string `json:"location"`
	Capacity    *int     `json:"capacity"`
}

func (h *Handler) ListEvents(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()
	rows, err := h.DB.Query(ctx,
		`SELECT id, title, description, starts_at, ends_at, location, capacity, created_at, updated_at
		 FROM events WHERE tenant_id = $1 ORDER BY starts_at DESC`,
		claims.TenantID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var events []interface{}
	for rows.Next() {
		var e models.Event
		if err := rows.Scan(&e.ID, &e.Title, &e.Description, &e.StartsAt, &e.EndsAt, &e.Location, &e.Capacity, &e.CreatedAt, &e.UpdatedAt); err != nil {
			continue
		}
		events = append(events, gin.H{
			"id":          e.ID.String(),
			"title":       e.Title,
			"description": e.Description,
			"starts_at":   e.StartsAt,
			"ends_at":     e.EndsAt,
			"location":    e.Location,
			"capacity":    e.Capacity,
		})
	}

	c.JSON(http.StatusOK, gin.H{"events": events})
}

func (h *Handler) CreateEvent(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req EventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	eventID := uuid.New()

	_, err := h.DB.Exec(ctx,
		`INSERT INTO events (id, tenant_id, title, description, starts_at, ends_at, location, capacity)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		eventID, claims.TenantID, req.Title, req.Description, req.StartsAt, req.EndsAt, req.Location, req.Capacity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create event"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": eventID.String()})
}

func (h *Handler) UpdateEvent(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	eventID := c.Param("id")
	var req EventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx, `SELECT tenant_id FROM events WHERE id = $1`, eventID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx,
		`UPDATE events SET title = $1, description = $2, starts_at = $3, ends_at = $4, location = $5, capacity = $6, updated_at = now()
		 WHERE id = $7`,
		req.Title, req.Description, req.StartsAt, req.EndsAt, req.Location, req.Capacity, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *Handler) DeleteEvent(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	eventID := c.Param("id")
	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx, `SELECT tenant_id FROM events WHERE id = $1`, eventID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx, `DELETE FROM events WHERE id = $1`, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}

// ============ Facilities ============

type FacilityRequest struct {
	Name    string `json:"name" binding:"required"`
	Type    string `json:"type" binding:"required"`
	Address *string `json:"address"`
	Rules   *string `json:"rules"`
	PhotoID *string `json:"photo_id"`
}

func (h *Handler) ListFacilities(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()
	rows, err := h.DB.Query(ctx,
		`SELECT id, name, type, address, rules, photo_id, created_at, updated_at
		 FROM facilities WHERE tenant_id = $1 ORDER BY created_at DESC`,
		claims.TenantID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var facilities []interface{}
	for rows.Next() {
		var f models.Facility
		if err := rows.Scan(&f.ID, &f.Name, &f.Type, &f.Address, &f.Rules, &f.PhotoID, &f.CreatedAt, &f.UpdatedAt); err != nil {
			continue
		}
		facilities = append(facilities, gin.H{
			"id":      f.ID.String(),
			"name":    f.Name,
			"type":    f.Type,
			"address": f.Address,
			"rules":   f.Rules,
		})
	}

	c.JSON(http.StatusOK, gin.H{"facilities": facilities})
}

func (h *Handler) CreateFacility(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req FacilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	facilityID := uuid.New()

	_, err := h.DB.Exec(ctx,
		`INSERT INTO facilities (id, tenant_id, name, type, address, rules)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		facilityID, claims.TenantID, req.Name, req.Type, req.Address, req.Rules)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create facility"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": facilityID.String()})
}

func (h *Handler) UpdateFacility(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	facilityID := c.Param("id")
	var req FacilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx, `SELECT tenant_id FROM facilities WHERE id = $1`, facilityID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx,
		`UPDATE facilities SET name = $1, type = $2, address = $3, rules = $4, updated_at = now()
		 WHERE id = $5`,
		req.Name, req.Type, req.Address, req.Rules, facilityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *Handler) DeleteFacility(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	facilityID := c.Param("id")
	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx, `SELECT tenant_id FROM facilities WHERE id = $1`, facilityID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	// Delete slots first
	_, _ = h.DB.Exec(ctx, `DELETE FROM facility_slots WHERE facility_id = $1`, facilityID)
	// Delete facility
	_, err = h.DB.Exec(ctx, `DELETE FROM facilities WHERE id = $1`, facilityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}
