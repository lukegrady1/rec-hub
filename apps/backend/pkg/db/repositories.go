package db

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rec-hub/backend/pkg/models"
)

type TenantRepository struct {
	db *pgxpool.Pool
}

func NewTenantRepository(db *pgxpool.Pool) *TenantRepository {
	return &TenantRepository{db: db}
}

func (r *TenantRepository) GetByDomain(ctx context.Context, domain string) (*models.Tenant, error) {
	var t models.Tenant
	err := r.db.QueryRow(ctx,
		`SELECT t.id, t.name, t.slug, t.plan, t.status, t.created_at, t.updated_at
		 FROM tenants t
		 JOIN tenant_domains td ON t.id = td.tenant_id
		 WHERE td.domain = $1`,
		domain).Scan(&t.ID, &t.Name, &t.Slug, &t.Plan, &t.Status, &t.CreatedAt, &t.UpdatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TenantRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Tenant, error) {
	var t models.Tenant
	err := r.db.QueryRow(ctx,
		`SELECT id, name, slug, plan, status, created_at, updated_at FROM tenants WHERE id = $1`,
		id).Scan(&t.ID, &t.Name, &t.Slug, &t.Plan, &t.Status, &t.CreatedAt, &t.UpdatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &t, nil
}

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var u models.User
	err := r.db.QueryRow(ctx,
		`SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1`,
		email).Scan(&u.ID, &u.Email, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

type TenantUserRepository struct {
	db *pgxpool.Pool
}

func NewTenantUserRepository(db *pgxpool.Pool) *TenantUserRepository {
	return &TenantUserRepository{db: db}
}

func (r *TenantUserRepository) GetByTenantAndUser(ctx context.Context, tenantID, userID uuid.UUID) (*models.TenantUser, error) {
	var tu models.TenantUser
	err := r.db.QueryRow(ctx,
		`SELECT id, tenant_id, user_id, role, created_at, updated_at
		 FROM tenant_users WHERE tenant_id = $1 AND user_id = $2`,
		tenantID, userID).Scan(&tu.ID, &tu.TenantID, &tu.UserID, &tu.Role, &tu.CreatedAt, &tu.UpdatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tu, nil
}

type BookingRepository struct {
	db *pgxpool.Pool
}

func NewBookingRepository(db *pgxpool.Pool) *BookingRepository {
	return &BookingRepository{db: db}
}

func (r *BookingRepository) GetByID(ctx context.Context, id uuid.UUID, tenantID uuid.UUID) (*models.Booking, error) {
	var b models.Booking
	err := r.db.QueryRow(ctx,
		`SELECT id, tenant_id, resource_type, resource_id, requester_name, requester_email, notes, status, created_at, updated_at
		 FROM bookings WHERE id = $1 AND tenant_id = $2`,
		id, tenantID).Scan(&b.ID, &b.TenantID, &b.ResourceType, &b.ResourceID, &b.RequesterName, &b.RequesterEmail, &b.Notes, &b.Status, &b.CreatedAt, &b.UpdatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *BookingRepository) GetAdminEmail(ctx context.Context, tenantID uuid.UUID) (string, error) {
	var email string
	err := r.db.QueryRow(ctx,
		`SELECT u.email FROM users u
		 JOIN tenant_users tu ON u.id = tu.user_id
		 WHERE tu.tenant_id = $1 AND tu.role = 'OWNER'
		 LIMIT 1`,
		tenantID).Scan(&email)

	if errors.Is(err, pgx.ErrNoRows) {
		return "", nil
	}
	return email, err
}
