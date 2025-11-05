package handlers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/auth"
	"github.com/rec-hub/backend/pkg/middleware"
	"golang.org/x/crypto/argon2"
)

type PublicRegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Phone     string `json:"phone"`
}

type PublicLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// PublicRegister allows residents to create accounts on a department's site
func (h *Handler) PublicRegister(c *gin.Context) {
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant from domain
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

	var req PublicRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	var existingUserID string
	err = h.DB.QueryRow(ctx,
		`SELECT id FROM users WHERE email = $1`,
		req.Email).Scan(&existingUserID)
	if err == nil {
		// User exists - check if they're already part of this tenant
		var existingRole string
		err = h.DB.QueryRow(ctx,
			`SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_id = $2`,
			tenantID, existingUserID).Scan(&existingRole)
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "user already registered for this department"})
			return
		}
		// User exists but not in this tenant - add them
		_, err = h.DB.Exec(ctx,
			`INSERT INTO tenant_users (tenant_id, user_id, role) VALUES ($1, $2, 'RESIDENT')`,
			tenantID, existingUserID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add user to tenant"})
			return
		}

		// Generate JWT token
		token, err := h.generateToken(existingUserID, tenantID, req.Email, "RESIDENT")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token":     token,
			"user_id":   existingUserID,
			"tenant_id": tenantID,
			"email":     req.Email,
			"role":      "RESIDENT",
		})
		return
	}

	// Hash password
	passwordHash := argon2.IDKey([]byte(req.Password), []byte("staticsalt"), 1, 64*1024, 4, 32)

	// Create new user
	userID := uuid.New()
	_, err = h.DB.Exec(ctx,
		`INSERT INTO users (id, email, password_hash, first_name, last_name, phone)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		userID, req.Email, passwordHash, req.FirstName, req.LastName, req.Phone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	// Add user to tenant as RESIDENT
	_, err = h.DB.Exec(ctx,
		`INSERT INTO tenant_users (tenant_id, user_id, role)
		 VALUES ($1, $2, 'RESIDENT')`,
		tenantID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add user to tenant"})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(userID.String(), tenantID, req.Email, "RESIDENT")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token":     token,
		"user_id":   userID.String(),
		"tenant_id": tenantID,
		"email":     req.Email,
		"role":      "RESIDENT",
	})
}

// PublicLogin allows residents to log in
func (h *Handler) PublicLogin(c *gin.Context) {
	tenantDomain := middleware.GetTenantIDFromContext(c)

	ctx := context.Background()

	// Resolve tenant from domain
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

	var req PublicLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user
	var userID, passwordHash string
	err = h.DB.QueryRow(ctx,
		`SELECT id, password_hash FROM users WHERE email = $1`,
		req.Email).Scan(&userID, &passwordHash)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	// Verify password
	hash := argon2.IDKey([]byte(req.Password), []byte("staticsalt"), 1, 64*1024, 4, 32)
	if string(hash) != passwordHash {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Check if user belongs to this tenant
	var role string
	err = h.DB.QueryRow(ctx,
		`SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_id = $2`,
		tenantID, userID).Scan(&role)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not authorized for this department"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(userID, tenantID, req.Email, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":     token,
		"user_id":   userID,
		"tenant_id": tenantID,
		"email":     req.Email,
		"role":      role,
	})
}

// Helper function to generate JWT token
func (h *Handler) generateToken(userID, tenantID, email, role string) (string, error) {
	userUUID, _ := uuid.Parse(userID)
	tenantUUID, _ := uuid.Parse(tenantID)
	return auth.GenerateToken(userUUID, tenantUUID, email, role, h.Config.JWTSecret)
}
