package handlers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rec-hub/backend/pkg/middleware"
)

type ProgramRegistrationRequest struct {
	ProgramID              string `json:"program_id" binding:"required"`
	ParticipantName        string `json:"participant_name" binding:"required"`
	ParticipantAge         *int   `json:"participant_age"`
	EmergencyContactName   string `json:"emergency_contact_name" binding:"required"`
	EmergencyContactPhone  string `json:"emergency_contact_phone" binding:"required"`
	Notes                  string `json:"notes"`
}

// CreateProgramRegistration allows residents to register for programs
func (h *Handler) CreateProgramRegistration(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Only RESIDENT role can register for programs
	if claims.Role != "RESIDENT" && claims.Role != "OWNER" && claims.Role != "ADMIN" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only residents can register for programs"})
		return
	}

	var req ProgramRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify program exists and belongs to this tenant
	var programTitle string
	err := h.DB.QueryRow(ctx,
		`SELECT title FROM programs WHERE id = $1 AND tenant_id = $2`,
		req.ProgramID, claims.TenantID.String()).Scan(&programTitle)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "program not found"})
		return
	}

	// Check if user is already registered
	var existingID string
	err = h.DB.QueryRow(ctx,
		`SELECT id FROM program_registrations WHERE program_id = $1 AND user_id = $2`,
		req.ProgramID, claims.UserID.String()).Scan(&existingID)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "you are already registered for this program"})
		return
	}

	// Create registration
	registrationID := uuid.New()
	_, err = h.DB.Exec(ctx,
		`INSERT INTO program_registrations (
			id, tenant_id, program_id, user_id,
			participant_name, participant_age,
			emergency_contact_name, emergency_contact_phone, notes
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		registrationID, claims.TenantID, req.ProgramID, claims.UserID,
		req.ParticipantName, req.ParticipantAge,
		req.EmergencyContactName, req.EmergencyContactPhone, req.Notes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create registration"})
		return
	}

	// TODO: Send email notification to admin

	c.JSON(http.StatusCreated, gin.H{
		"id":      registrationID.String(),
		"message": "registration submitted successfully",
	})
}

// ListProgramRegistrations returns all program registrations for the tenant
func (h *Handler) ListProgramRegistrations(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx := context.Background()

	rows, err := h.DB.Query(ctx,
		`SELECT
			pr.id, pr.program_id, p.title as program_title,
			pr.user_id, u.email as user_email,
			pr.participant_name, pr.participant_age,
			pr.emergency_contact_name, pr.emergency_contact_phone,
			pr.notes, pr.status, pr.registered_at
		FROM program_registrations pr
		JOIN programs p ON pr.program_id = p.id
		JOIN users u ON pr.user_id = u.id
		WHERE pr.tenant_id = $1
		ORDER BY pr.registered_at DESC`,
		claims.TenantID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer rows.Close()

	var registrations []map[string]interface{}
	for rows.Next() {
		var (
			id, programID, programTitle, userID, userEmail string
			participantName, emergencyContactName, emergencyContactPhone, notes, status string
			registeredAt string
			participantAge *int
		)

		if err := rows.Scan(
			&id, &programID, &programTitle, &userID, &userEmail,
			&participantName, &participantAge,
			&emergencyContactName, &emergencyContactPhone,
			&notes, &status, &registeredAt,
		); err != nil {
			continue
		}

		registrations = append(registrations, map[string]interface{}{
			"id":                        id,
			"program_id":                programID,
			"program_title":             programTitle,
			"user_id":                   userID,
			"user_email":                userEmail,
			"participant_name":          participantName,
			"participant_age":           participantAge,
			"emergency_contact_name":    emergencyContactName,
			"emergency_contact_phone":   emergencyContactPhone,
			"notes":                     notes,
			"status":                    status,
			"registered_at":             registeredAt,
		})
	}

	if registrations == nil {
		registrations = []map[string]interface{}{}
	}

	c.JSON(http.StatusOK, gin.H{"registrations": registrations})
}

// UpdateProgramRegistrationStatus allows admins to approve/reject registrations
func (h *Handler) UpdateProgramRegistrationStatus(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Only admins can update status
	if claims.Role != "OWNER" && claims.Role != "ADMIN" && claims.Role != "STAFF" {
		c.JSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
		return
	}

	registrationID := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Verify registration belongs to tenant
	var tenantID string
	err := h.DB.QueryRow(ctx,
		`SELECT tenant_id FROM program_registrations WHERE id = $1`,
		registrationID).Scan(&tenantID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "registration not found"})
		return
	}
	if tenantID != claims.TenantID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}

	// Update status
	_, err = h.DB.Exec(ctx,
		`UPDATE program_registrations SET status = $1, updated_at = now() WHERE id = $2`,
		req.Status, registrationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update status"})
		return
	}

	// TODO: Send email notification to user

	c.JSON(http.StatusOK, gin.H{"success": true})
}
