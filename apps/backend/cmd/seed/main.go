package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/rec-hub/backend/pkg/auth"
)

func main() {
	// Load .env
	_ = godotenv.Load()

	databaseURL := os.Getenv("POSTGRES_URL")
	if databaseURL == "" {
		databaseURL = "postgres://recuser:recpass@localhost:5432/rec?sslmode=disable"
	}

	// Connect to database
	conn, err := pgx.Connect(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(context.Background())

	// Create demo tenant
	tenantID := uuid.New()
	adminUserID := uuid.New()

	demoEmail := os.Getenv("DEMO_ADMIN_EMAIL")
	if demoEmail == "" {
		demoEmail = "admin@demo.local"
	}
	demoPassword := os.Getenv("DEMO_ADMIN_PASSWORD")
	if demoPassword == "" {
		demoPassword = "DemoPass123!"
	}

	// Hash password
	passwordHash, err := auth.HashPassword(demoPassword)
	if err != nil {
		log.Fatalf("Error hashing password: %v\n", err)
	}

	// Start transaction
	tx, err := conn.Begin(context.Background())
	if err != nil {
		log.Fatalf("Error starting transaction: %v\n", err)
	}
	defer tx.Rollback(context.Background())

	// Insert tenant
	_, err = tx.Exec(context.Background(),
		`INSERT INTO tenants (id, name, slug, plan, status) VALUES ($1, $2, $3, $4, $5)`,
		tenantID, "Demo City Recreation", "demo", "starter", "active")
	if err != nil {
		log.Fatalf("Error inserting tenant: %v\n", err)
	}
	fmt.Printf("✓ Created tenant: %s\n", tenantID)

	// Insert tenant domain
	_, err = tx.Exec(context.Background(),
		`INSERT INTO tenant_domains (tenant_id, domain, is_primary, verified_at) VALUES ($1, $2, $3, $4)`,
		tenantID, "demo.local.rechub", true, time.Now())
	if err != nil {
		log.Fatalf("Error inserting tenant domain: %v\n", err)
	}

	// Insert user
	_, err = tx.Exec(context.Background(),
		`INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)`,
		adminUserID, demoEmail, passwordHash)
	if err != nil {
		log.Fatalf("Error inserting user: %v\n", err)
	}
	fmt.Printf("✓ Created admin user: %s\n", demoEmail)

	// Insert tenant user (OWNER role)
	_, err = tx.Exec(context.Background(),
		`INSERT INTO tenant_users (tenant_id, user_id, role) VALUES ($1, $2, $3)`,
		tenantID, adminUserID, "OWNER")
	if err != nil {
		log.Fatalf("Error inserting tenant user: %v\n", err)
	}

	// Create home page
	homePageID := uuid.New()
	meta := json.RawMessage(`{"description":"Welcome to Demo City Recreation"}`)
	_, err = tx.Exec(context.Background(),
		`INSERT INTO pages (id, tenant_id, slug, title, meta, published) VALUES ($1, $2, $3, $4, $5, $6)`,
		homePageID, tenantID, "home", "Home", meta, true)
	if err != nil {
		log.Fatalf("Error inserting home page: %v\n", err)
	}
	fmt.Printf("✓ Created home page\n")

	// Add blocks to home page
	blocks := []struct {
		kind   string
		order  int
		config map[string]interface{}
	}{
		{
			kind:  "hero",
			order: 1,
			config: map[string]interface{}{
				"headline":      "Welcome to Demo City Recreation",
				"subheadline":   "Discover programs, events, and facilities in our community",
				"ctaText":       "Explore Programs",
				"ctaHref":       "/programs",
				"overlayOpacity": 0.4,
				"align":         "center",
			},
		},
		{
			kind:  "program_grid",
			order: 2,
			config: map[string]interface{}{
				"limit":     6,
				"showPrice": true,
			},
		},
		{
			kind:  "event_list",
			order: 3,
			config: map[string]interface{}{
				"limit":    4,
				"showDates": true,
			},
		},
		{
			kind:  "cta",
			order: 4,
			config: map[string]interface{}{
				"text":  "Book a Facility",
				"href":  "/facilities",
				"style": "primary",
			},
		},
	}

	for _, block := range blocks {
		configJSON, _ := json.Marshal(block.config)
		_, err = tx.Exec(context.Background(),
			`INSERT INTO page_blocks (page_id, kind, "order", config) VALUES ($1, $2, $3, $4)`,
			homePageID, block.kind, block.order, configJSON)
		if err != nil {
			log.Fatalf("Error inserting block: %v\n", err)
		}
	}
	fmt.Printf("✓ Added 4 blocks to home page\n")

	// Create sample programs
	programs := []struct {
		title       string
		description string
		season      string
		priceCents  int
	}{
		{
			"Youth Soccer",
			"Fun and engaging soccer program for ages 5-12",
			"Fall 2024",
			10000, // $100.00
		},
		{
			"Adult Basketball",
			"Competitive basketball league for adults 18+",
			"Winter 2024",
			15000,
		},
		{
			"Swimming Lessons",
			"Professional swimming instruction for all ages",
			"Year-round",
			5000,
		},
		{
			"Yoga Classes",
			"Relaxing and strengthening yoga for all levels",
			"Year-round",
			8000,
		},
		{
			"Tennis Camp",
			"Intensive tennis training with professional coaches",
			"Summer 2025",
			20000,
		},
		{
			"Dance & Movement",
			"Creative dance classes for children and adults",
			"Fall 2024",
			7000,
		},
	}

	for _, prog := range programs {
		_, err = tx.Exec(context.Background(),
			`INSERT INTO programs (tenant_id, title, description, season, price_cents, status) VALUES ($1, $2, $3, $4, $5, $6)`,
			tenantID, prog.title, prog.description, prog.season, prog.priceCents, "active")
		if err != nil {
			log.Fatalf("Error inserting program: %v\n", err)
		}
	}
	fmt.Printf("✓ Created 6 sample programs\n")

	// Create sample events
	now := time.Now()
	events := []struct {
		title       string
		description string
		startsAt    time.Time
		endsAt      time.Time
		location    string
		capacity    int
	}{
		{
			"Community Sports Day",
			"Fun day with various sports activities for families",
			now.AddDate(0, 0, 7),
			now.AddDate(0, 0, 7).Add(4 * time.Hour),
			"Central Park",
			200,
		},
		{
			"Fitness Expo",
			"Learn about health and fitness from local experts",
			now.AddDate(0, 0, 14),
			now.AddDate(0, 0, 14).Add(3 * time.Hour),
			"Recreation Center",
			150,
		},
		{
			"Kids Summer Camp Kickoff",
			"Join us for an exciting summer camp experience",
			now.AddDate(0, 1, 0),
			now.AddDate(0, 1, 0).Add(2 * time.Hour),
			"Recreation Center",
			100,
		},
		{
			"Adult Swimming Championships",
			"Competitive swimming event for adult participants",
			now.AddDate(0, 1, 10),
			now.AddDate(0, 1, 10).Add(5 * time.Hour),
			"Community Pool",
			300,
		},
	}

	for _, evt := range events {
		_, err = tx.Exec(context.Background(),
			`INSERT INTO events (tenant_id, title, description, starts_at, ends_at, location, capacity) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			tenantID, evt.title, evt.description, evt.startsAt, evt.endsAt, evt.location, evt.capacity)
		if err != nil {
			log.Fatalf("Error inserting event: %v\n", err)
		}
	}
	fmt.Printf("✓ Created 4 sample events\n")

	// Create sample facilities and slots
	facilities := []struct {
		name    string
		ftype   string
		address string
		rules   string
	}{
		{
			"Main Gymnasium",
			"gym",
			"123 Recreation St",
			"No outside shoes. Must be member.",
		},
		{
			"Tennis Court",
			"court",
			"123 Recreation St",
			"Reservations required. 30-minute slots.",
		},
		{
			"Community Pool",
			"facility",
			"456 Water Ave",
			"Swimsuits required. Supervision for children under 12.",
		},
	}

	for _, fac := range facilities {
		facilityID := uuid.New()
		_, err = tx.Exec(context.Background(),
			`INSERT INTO facilities (id, tenant_id, name, type, address, rules) VALUES ($1, $2, $3, $4, $5, $6)`,
			facilityID, tenantID, fac.name, fac.ftype, fac.address, fac.rules)
		if err != nil {
			log.Fatalf("Error inserting facility: %v\n", err)
		}

		// Create 4 time slots for each facility
		baseTime := now.Add(24 * time.Hour)
		for i := 0; i < 4; i++ {
			startTime := baseTime.Add(time.Duration(i*2) * time.Hour)
			endTime := startTime.Add(1 * time.Hour)

			_, err = tx.Exec(context.Background(),
				`INSERT INTO facility_slots (facility_id, starts_at, ends_at, status) VALUES ($1, $2, $3, $4)`,
				facilityID, startTime, endTime, "open")
			if err != nil {
				log.Fatalf("Error inserting facility slot: %v\n", err)
			}
		}
	}
	fmt.Printf("✓ Created 3 facilities with 12 time slots\n")

	// Commit transaction
	err = tx.Commit(context.Background())
	if err != nil {
		log.Fatalf("Error committing transaction: %v\n", err)
	}

	fmt.Println("\n✓ Demo seed completed successfully!")
	fmt.Printf("Login with:\n  Email: %s\n  Password: %s\n", demoEmail, demoPassword)
	fmt.Println("Access at: http://demo.local.rechub")
}
