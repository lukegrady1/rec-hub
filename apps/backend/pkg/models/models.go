package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// Tenant represents a single tenant (recreation department)
type Tenant struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Plan      string    `json:"plan"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TenantDomain represents a domain associated with a tenant
type TenantDomain struct {
	ID         uuid.UUID  `json:"id"`
	TenantID   uuid.UUID  `json:"tenant_id"`
	Domain     string     `json:"domain"`
	IsPrimary  bool       `json:"is_primary"`
	VerifiedAt *time.Time `json:"verified_at"`
	CreatedAt  time.Time  `json:"created_at"`
}

// User represents a user account
type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// TenantUser represents a user's role within a tenant
type TenantUser struct {
	ID        uuid.UUID `json:"id"`
	TenantID  uuid.UUID `json:"tenant_id"`
	UserID    uuid.UUID `json:"user_id"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Page represents a page in the website builder
type Page struct {
	ID        uuid.UUID       `json:"id"`
	TenantID  uuid.UUID       `json:"tenant_id"`
	Slug      string          `json:"slug"`
	Title     string          `json:"title"`
	Meta      json.RawMessage `json:"meta"`
	Published bool            `json:"published"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// PageBlock represents a block on a page
type PageBlock struct {
	ID        uuid.UUID       `json:"id"`
	PageID    uuid.UUID       `json:"page_id"`
	Kind      string          `json:"kind"`
	Order     int             `json:"order"`
	Config    json.RawMessage `json:"config"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// MediaAsset represents a media file
type MediaAsset struct {
	ID        uuid.UUID `json:"id"`
	TenantID  uuid.UUID `json:"tenant_id"`
	Path      string    `json:"path"`
	Mime      string    `json:"mime"`
	Width     *int      `json:"width"`
	Height    *int      `json:"height"`
	SizeBytes *int      `json:"size_bytes"`
	CreatedAt time.Time `json:"created_at"`
}

// Program represents a recreation program
type Program struct {
	ID          uuid.UUID `json:"id"`
	TenantID    uuid.UUID `json:"tenant_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	Season      *string   `json:"season"`
	PriceCents  int       `json:"price_cents"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Event represents an event
type Event struct {
	ID          uuid.UUID `json:"id"`
	TenantID    uuid.UUID `json:"tenant_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	StartsAt    time.Time `json:"starts_at"`
	EndsAt      time.Time `json:"ends_at"`
	Location    *string   `json:"location"`
	Capacity    *int      `json:"capacity"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Facility represents a recreation facility
type Facility struct {
	ID        uuid.UUID  `json:"id"`
	TenantID  uuid.UUID  `json:"tenant_id"`
	Name      string     `json:"name"`
	Type      string     `json:"type"`
	Address   *string    `json:"address"`
	Rules     *string    `json:"rules"`
	PhotoID   *uuid.UUID `json:"photo_id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

// FacilitySlot represents an available time slot for a facility
type FacilitySlot struct {
	ID         uuid.UUID `json:"id"`
	FacilityID uuid.UUID `json:"facility_id"`
	StartsAt   time.Time `json:"starts_at"`
	EndsAt     time.Time `json:"ends_at"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Booking represents a booking request
type Booking struct {
	ID            uuid.UUID `json:"id"`
	TenantID      uuid.UUID `json:"tenant_id"`
	ResourceType  string    `json:"resource_type"`
	ResourceID    uuid.UUID `json:"resource_id"`
	RequesterName *string   `json:"requester_name"`
	RequesterEmail string   `json:"requester_email"`
	Notes         *string   `json:"notes"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// JSONB type for postgres jsonb fields
type JSONB json.RawMessage

func (j JSONB) Value() (driver.Value, error) {
	return []byte(j), nil
}

func (j *JSONB) Scan(value interface{}) error {
	bytes, _ := value.([]byte)
	*j = make([]byte, len(bytes))
	copy(*j, bytes)
	return nil
}
