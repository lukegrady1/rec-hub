package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/rec-hub/backend/pkg/auth"
)

type RegisterRequest struct {
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8"`
	DepartmentName  string `json:"department_name" binding:"required"`
	DepartmentSlug  string `json:"department_slug" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token    string `json:"token"`
	UserID   string `json:"user_id"`
	TenantID string `json:"tenant_id"`
	Email    string `json:"email"`
}

// RegisterHandler creates a new tenant and user
func (h *Handler) RegisterHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Check if email already exists
	var existingID string
	err := h.DB.QueryRow(ctx, `SELECT id FROM users WHERE email = $1`, req.Email).Scan(&existingID)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
		return
	}
	if err != pgx.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	// Hash password
	passwordHash, err := auth.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process password"})
		return
	}

	// Start transaction
	tx, err := h.DB.Begin(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}
	defer tx.Rollback(ctx)

	// Create user
	userID := uuid.New()
	_, err = tx.Exec(ctx,
		`INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)`,
		userID, req.Email, passwordHash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	// Create tenant
	tenantID := uuid.New()
	_, err = tx.Exec(ctx,
		`INSERT INTO tenants (id, name, slug, plan, status) VALUES ($1, $2, $3, $4, $5)`,
		tenantID, req.DepartmentName, req.DepartmentSlug, "starter", "active")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create tenant"})
		return
	}

	// Create tenant domain
	domain := req.DepartmentSlug + "." + h.Config.PublicBaseDomain
	_, err = tx.Exec(ctx,
		`INSERT INTO tenant_domains (tenant_id, domain, is_primary, verified_at) VALUES ($1, $2, $3, $4)`,
		tenantID, domain, true, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create domain"})
		return
	}

	// Create tenant user with OWNER role
	_, err = tx.Exec(ctx,
		`INSERT INTO tenant_users (tenant_id, user_id, role) VALUES ($1, $2, $3)`,
		tenantID, userID, "OWNER")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to assign role"})
		return
	}

	// Create default home page
	pageID := uuid.New()
	_, err = tx.Exec(ctx,
		`INSERT INTO pages (id, tenant_id, slug, title, published) VALUES ($1, $2, $3, $4, $5)`,
		pageID, tenantID, "home", "Home", false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create home page"})
		return
	}

	// Commit transaction
	err = tx.Commit(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
		return
	}

	// Generate JWT token
	token, err := auth.GenerateToken(userID, tenantID, req.Email, "OWNER", h.Config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, AuthResponse{
		Token:    token,
		UserID:   userID.String(),
		TenantID: tenantID.String(),
		Email:    req.Email,
	})
}

// LoginHandler authenticates a user
func (h *Handler) LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	// Find user by email
	var userID string
	var passwordHash string
	err := h.DB.QueryRow(ctx,
		`SELECT id, password_hash FROM users WHERE email = $1`,
		req.Email).Scan(&userID, &passwordHash)
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	// Verify password
	if !auth.VerifyPassword(req.Password, passwordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	// Get tenant (assuming one tenant per user in MVP)
	var tenantID string
	var role string
	err = h.DB.QueryRow(ctx,
		`SELECT tenant_id, role FROM tenant_users WHERE user_id = $1 LIMIT 1`,
		userID).Scan(&tenantID, &role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve tenant"})
		return
	}

	// Generate JWT token
	token, err := auth.GenerateToken(uuid.MustParse(userID), uuid.MustParse(tenantID), req.Email, role, h.Config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token:    token,
		UserID:   userID,
		TenantID: tenantID,
		Email:    req.Email,
	})
}
