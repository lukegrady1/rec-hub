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

// ============ Facility Slots ============

type SlotRequest struct {
	FacilityID uuid.UUID `json:"facility_id" binding:"required"`
	StartsAt   time.Time `json:"starts_at" binding:"required"`
	EndsAt     time.Time `json:"ends_at" binding:"required"`
}

func (h *Handler) ListFacilitySlots(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	facilityID := c.Query("facility_id")

	ctx := context.Background()
	var rows pgx.Rows
	var err error

	if facilityID != "" {
		rows, err = h.DB.Query(ctx,
			`SELECT fs.id, fs.facility_id, fs.starts_at, fs.ends_at, fs.status, fs.created_at, fs.updated_at
			 FROM facility_slots fs
			 JOIN facilities f ON fs.facility_id = f.id
			 WHERE f.tenant_id = $1 AND fs.facility_id = $2
			 ORDER BY fs.starts_at DESC`,
			claims.TenantID.String(), facilityID)
	} else {
		rows, err = h.DB.Query(ctx,
			`SELECT fs.id, fs.facility_id, fs.starts_at, fs.ends_at, fs.status, fs.created_at, fs.updated_at
			 FROM facility_slots fs
			 JOIN facilities f ON fs.facility_id = f.id
			 WHERE f.tenant_id = $1
			 ORDER BY fs.starts_at DESC`,
			claims.TenantID.String())
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var slots []interface{}
	for rows.Next() {
		var s models.FacilitySlot
		if err := rows.Scan(&s.ID, &s.FacilityID, &s.StartsAt, &s.EndsAt, &s.Status, &s.CreatedAt, &s.UpdatedAt); err != nil {
			continue
		}
		slots = append(slots, gin.H{
			"id":          s.ID.String(),
			"facility_id": s.FacilityID.String(),
			"starts_at":   s.StartsAt,
			"ends_at":     s.EndsAt,
			"status":      s.Status,
		})
	}

	c.JSON(http.StatusOK, gin.H{"slots": slots})
}

func (h *Handler) CreateFacilitySlot(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req SlotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify facility belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM facilities WHERE id = $1`,
		req.FacilityID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "facility not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	slotID := uuid.New()
	_, err = h.DB.Exec(ctx,
		`INSERT INTO facility_slots (id, facility_id, starts_at, ends_at, status)
		 VALUES ($1, $2, $3, $4, $5)`,
		slotID, req.FacilityID, req.StartsAt, req.EndsAt, "open")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create slot"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": slotID.String()})
}

func (h *Handler) UpdateFacilitySlot(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	slotID := c.Param("id")
	var req SlotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT f.tenant_id FROM facility_slots fs
		 JOIN facilities f ON fs.facility_id = f.id
		 WHERE fs.id = $1`,
		slotID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx,
		`UPDATE facility_slots SET starts_at = $1, ends_at = $2, updated_at = now()
		 WHERE id = $3`,
		req.StartsAt, req.EndsAt, slotID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *Handler) DeleteFacilitySlot(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	slotID := c.Param("id")
	ctx := context.Background()

	// Verify ownership
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT f.tenant_id FROM facility_slots fs
		 JOIN facilities f ON fs.facility_id = f.id
		 WHERE fs.id = $1`,
		slotID).Scan(&tenantID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx, `DELETE FROM facility_slots WHERE id = $1`, slotID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "delete failed"})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}

// ============ Bookings ============

type BookingRequest struct {
	ResourceType   string `json:"resource_type" binding:"required"`
	ResourceID     uuid.UUID `json:"resource_id" binding:"required"`
	RequesterName  *string `json:"requester_name"`
	RequesterEmail string `json:"requester_email" binding:"required,email"`
	Notes          *string `json:"notes"`
}

type BookingStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func (h *Handler) ListBookings(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()
	rows, err := h.DB.Query(ctx,
		`SELECT id, resource_type, resource_id, requester_name, requester_email, notes, status, created_at
		 FROM bookings WHERE tenant_id = $1 ORDER BY created_at DESC`,
		claims.TenantID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var bookings []interface{}
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(&b.ID, &b.ResourceType, &b.ResourceID, &b.RequesterName, &b.RequesterEmail, &b.Notes, &b.Status, &b.CreatedAt); err != nil {
			continue
		}
		bookings = append(bookings, gin.H{
			"id":               b.ID.String(),
			"resource_type":    b.ResourceType,
			"resource_id":      b.ResourceID.String(),
			"requester_name":   b.RequesterName,
			"requester_email":  b.RequesterEmail,
			"status":           b.Status,
			"created_at":       b.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

func (h *Handler) UpdateBooking(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	bookingID := c.Param("id")
	var req BookingStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify ownership
	var tenantID string
	var requesterEmail string
	var resourceID uuid.UUID
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id, requester_email, resource_id FROM bookings WHERE id = $1`,
		bookingID).Scan(&tenantID, &requesterEmail, &resourceID)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	_, err = h.DB.Exec(ctx,
		`UPDATE bookings SET status = $1, updated_at = now() WHERE id = $2`,
		req.Status, bookingID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	// TODO: Send email notification to requester about status change

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (h *Handler) CreatePublicBooking(c *gin.Context) {
	var req BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get tenant from request
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant ID from domain
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

	// Create booking
	bookingID := uuid.New()
	_, err = h.DB.Exec(ctx,
		`INSERT INTO bookings (id, tenant_id, resource_type, resource_id, requester_name, requester_email, notes, status)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		bookingID, tenantID, req.ResourceType, req.ResourceID, req.RequesterName, req.RequesterEmail, req.Notes, "pending")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create booking"})
		return
	}

	// TODO: Send email notification to admin

	c.JSON(http.StatusCreated, gin.H{"id": bookingID.String()})
}
