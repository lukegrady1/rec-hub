package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/argon2"
)

// Claims represents JWT claims
type Claims struct {
	UserID   uuid.UUID `json:"user_id"`
	TenantID uuid.UUID `json:"tenant_id"`
	Email    string    `json:"email"`
	Role     string    `json:"role"`
	jwt.RegisteredClaims
}

// HashPassword hashes a password using argon2id
func HashPassword(password string) (string, error) {
	// Argon2id parameters for MVP (not performance-optimized)
	hash := argon2.IDKey(
		[]byte(password),
		[]byte("rec-hub-salt"),
		1,      // time cost
		64*1024, // memory in KB
		4,      // parallelism
		32,     // key length
	)
	return fmt.Sprintf("%x", hash), nil
}

// VerifyPassword verifies a password against a hash
func VerifyPassword(password, hash string) bool {
	computedHash, err := HashPassword(password)
	if err != nil {
		return false
	}
	return computedHash == hash
}

// GenerateToken generates a JWT token
func GenerateToken(userID, tenantID uuid.UUID, email, role, jwtSecret string) (string, error) {
	claims := &Claims{
		UserID:   userID,
		TenantID: tenantID,
		Email:    email,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

// VerifyToken verifies a JWT token
func VerifyToken(tokenString, jwtSecret string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
