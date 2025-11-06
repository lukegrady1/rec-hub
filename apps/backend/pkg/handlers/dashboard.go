package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rec-hub/backend/pkg/middleware"
)

// Dashboard summary response
type DashboardSummary struct {
	ActivePrograms    int          `json:"activePrograms"`
	UpcomingEvents7d  int          `json:"upcomingEvents7d"`
	PendingBookings   int          `json:"pendingBookings"`
	RegistrationsMTD  int          `json:"registrationsMTD"`
	Utilization7dPct  float64      `json:"utilization7dPct"`
	Payments          PaymentsInfo `json:"payments"`
}

type PaymentsInfo struct {
	Enabled  bool    `json:"enabled"`
	GrossMTD float64 `json:"grossMTD"`
}

// Upcoming event response
type DashboardUpcomingEvent struct {
	ID         string    `json:"id"`
	Title      string    `json:"title"`
	StartsAt   time.Time `json:"startsAt"`
	EndsAt     time.Time `json:"endsAt"`
	Capacity   int       `json:"capacity"`
	Registered int       `json:"registered"`
	Location   string    `json:"location"`
}

// Recent booking response
type RecentBooking struct {
	ID             string    `json:"id"`
	CreatedAt      time.Time `json:"createdAt"`
	FacilityName   string    `json:"facilityName"`
	SlotStartsAt   time.Time `json:"slotStartsAt"`
	SlotEndsAt     time.Time `json:"slotEndsAt"`
	RequesterName  string    `json:"requesterName"`
	RequesterEmail string    `json:"requesterEmail"`
	Status         string    `json:"status"`
}

// Utilization series response
type UtilizationSeries struct {
	Series []UtilizationPoint `json:"series"`
}

type UtilizationPoint struct {
	WeekStart string  `json:"weekStart"`
	Pct       float64 `json:"pct"`
}

// Onboarding checklist
type OnboardingChecklist struct {
	TenantID          string    `json:"tenantId"`
	LogoUploaded      bool      `json:"logoUploaded"`
	HomepagePublished bool      `json:"homepagePublished"`
	FirstProgram      bool      `json:"firstProgram"`
	FirstFacility     bool      `json:"firstFacility"`
	FirstBooking      bool      `json:"firstBooking"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type OnboardingUpdateRequest struct {
	LogoUploaded      *bool `json:"logoUploaded,omitempty"`
	HomepagePublished *bool `json:"homepagePublished,omitempty"`
	FirstProgram      *bool `json:"firstProgram,omitempty"`
	FirstFacility     *bool `json:"firstFacility,omitempty"`
	FirstBooking      *bool `json:"firstBooking,omitempty"`
}

// GetDashboardSummary returns aggregated KPIs for the dashboard
func (h *Handler) GetDashboardSummary(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()
	now := time.Now()
	weekAgo := now.AddDate(0, 0, -7)
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	summary := DashboardSummary{
		Payments: PaymentsInfo{
			Enabled:  false,
			GrossMTD: 0,
		},
	}

	// Active programs count
	var activePrograms int
	err := h.DB.QueryRow(ctx,
		`SELECT COUNT(*) FROM programs WHERE tenant_id = $1 AND status = 'active'`,
		tenantID).Scan(&activePrograms)
	if err == nil {
		summary.ActivePrograms = activePrograms
	}

	// Upcoming events (next 7 days)
	var upcomingEvents int
	err = h.DB.QueryRow(ctx,
		`SELECT COUNT(*) FROM events WHERE tenant_id = $1 AND starts_at >= $2 AND starts_at <= $3`,
		tenantID, now, now.AddDate(0, 0, 7)).Scan(&upcomingEvents)
	if err == nil {
		summary.UpcomingEvents7d = upcomingEvents
	}

	// Pending bookings
	var pendingBookings int
	err = h.DB.QueryRow(ctx,
		`SELECT COUNT(*) FROM bookings WHERE tenant_id = $1 AND status = 'pending'`,
		tenantID).Scan(&pendingBookings)
	if err == nil {
		summary.PendingBookings = pendingBookings
	}

	// Registrations MTD (month-to-date)
	var registrationsMTD int
	err = h.DB.QueryRow(ctx,
		`SELECT COUNT(*) FROM program_registrations WHERE tenant_id = $1 AND created_at >= $2`,
		tenantID, monthStart).Scan(&registrationsMTD)
	if err == nil {
		summary.RegistrationsMTD = registrationsMTD
	}

	// Facility utilization (7 days)
	var bookedMinutes, totalMinutes float64

	// Get total available minutes
	err = h.DB.QueryRow(ctx,
		`SELECT
			COALESCE(SUM(EXTRACT(EPOCH FROM (LEAST(ends_at, $3) - GREATEST(starts_at, $2))) / 60), 0)
		FROM facility_slots fs
		JOIN facilities f ON fs.facility_id = f.id
		WHERE f.tenant_id = $1
		AND fs.starts_at < $3
		AND fs.ends_at > $2
		AND fs.status IN ('open', 'booked')`,
		tenantID, weekAgo, now).Scan(&totalMinutes)

	if err == nil && totalMinutes > 0 {
		// Get booked minutes
		err = h.DB.QueryRow(ctx,
			`SELECT
				COALESCE(SUM(EXTRACT(EPOCH FROM (LEAST(ends_at, $3) - GREATEST(starts_at, $2))) / 60), 0)
			FROM facility_slots fs
			JOIN facilities f ON fs.facility_id = f.id
			WHERE f.tenant_id = $1
			AND fs.starts_at < $3
			AND fs.ends_at > $2
			AND fs.status = 'booked'`,
			tenantID, weekAgo, now).Scan(&bookedMinutes)

		if err == nil {
			summary.Utilization7dPct = (bookedMinutes / totalMinutes) * 100
		}
	}

	c.JSON(http.StatusOK, summary)
}

// GetDashboardUpcomingEvents returns events in the next 7 days (renamed to avoid conflict)
func (h *Handler) GetDashboardUpcomingEvents(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()
	now := time.Now()
	weekFromNow := now.AddDate(0, 0, 7)

	rows, err := h.DB.Query(ctx,
		`SELECT
			e.id, e.title, e.starts_at, e.ends_at, e.location,
			COALESCE(e.capacity, 0) as capacity,
			COALESCE((SELECT COUNT(*) FROM program_registrations pr WHERE pr.event_id = e.id), 0) as registered
		FROM events e
		WHERE e.tenant_id = $1
		AND e.starts_at >= $2
		AND e.starts_at <= $3
		ORDER BY e.starts_at ASC
		LIMIT 10`,
		tenantID, now, weekFromNow)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch events"})
		return
	}
	defer rows.Close()

	events := []DashboardUpcomingEvent{}
	for rows.Next() {
		var e DashboardUpcomingEvent
		var location *string
		err := rows.Scan(&e.ID, &e.Title, &e.StartsAt, &e.EndsAt, &location, &e.Capacity, &e.Registered)
		if err != nil {
			continue
		}
		if location != nil {
			e.Location = *location
		}
		events = append(events, e)
	}

	c.JSON(http.StatusOK, gin.H{"events": events})
}

// GetRecentBookings returns the most recent booking requests
func (h *Handler) GetRecentBookings(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()

	rows, err := h.DB.Query(ctx,
		`SELECT
			b.id, b.created_at, b.requester_name, b.requester_email, b.status,
			f.name as facility_name,
			fs.starts_at as slot_starts_at,
			fs.ends_at as slot_ends_at
		FROM bookings b
		LEFT JOIN facility_slots fs ON b.resource_id::text = fs.id::text AND b.resource_type = 'facility_slot'
		LEFT JOIN facilities f ON fs.facility_id = f.id
		WHERE b.tenant_id = $1
		ORDER BY b.created_at DESC
		LIMIT 10`,
		tenantID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch bookings"})
		return
	}
	defer rows.Close()

	bookings := []RecentBooking{}
	for rows.Next() {
		var b RecentBooking
		var requesterName, facilityName *string
		var slotStartsAt, slotEndsAt *time.Time

		err := rows.Scan(&b.ID, &b.CreatedAt, &requesterName, &b.RequesterEmail, &b.Status,
			&facilityName, &slotStartsAt, &slotEndsAt)
		if err != nil {
			continue
		}

		if requesterName != nil {
			b.RequesterName = *requesterName
		}
		if facilityName != nil {
			b.FacilityName = *facilityName
		}
		if slotStartsAt != nil {
			b.SlotStartsAt = *slotStartsAt
		}
		if slotEndsAt != nil {
			b.SlotEndsAt = *slotEndsAt
		}

		bookings = append(bookings, b)
	}

	c.JSON(http.StatusOK, gin.H{"bookings": bookings})
}

// GetUtilizationSeries returns facility utilization for the past 8 weeks
func (h *Handler) GetUtilizationSeries(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()
	now := time.Now()

	series := []UtilizationPoint{}

	// Calculate for each of the past 8 weeks
	for i := 7; i >= 0; i-- {
		weekStart := now.AddDate(0, 0, -7*(i+1))
		weekEnd := now.AddDate(0, 0, -7*i)

		var bookedMinutes, totalMinutes float64

		// Total minutes
		err := h.DB.QueryRow(ctx,
			`SELECT
				COALESCE(SUM(EXTRACT(EPOCH FROM (LEAST(ends_at, $3) - GREATEST(starts_at, $2))) / 60), 0)
			FROM facility_slots fs
			JOIN facilities f ON fs.facility_id = f.id
			WHERE f.tenant_id = $1
			AND fs.starts_at < $3
			AND fs.ends_at > $2
			AND fs.status IN ('open', 'booked')`,
			tenantID, weekStart, weekEnd).Scan(&totalMinutes)

		pct := 0.0
		if err == nil && totalMinutes > 0 {
			// Booked minutes
			err = h.DB.QueryRow(ctx,
				`SELECT
					COALESCE(SUM(EXTRACT(EPOCH FROM (LEAST(ends_at, $3) - GREATEST(starts_at, $2))) / 60), 0)
				FROM facility_slots fs
				JOIN facilities f ON fs.facility_id = f.id
				WHERE f.tenant_id = $1
				AND fs.starts_at < $3
				AND fs.ends_at > $2
				AND fs.status = 'booked'`,
				tenantID, weekStart, weekEnd).Scan(&bookedMinutes)

			if err == nil {
				pct = (bookedMinutes / totalMinutes) * 100
			}
		}

		series = append(series, UtilizationPoint{
			WeekStart: weekStart.Format("2006-01-02"),
			Pct:       pct,
		})
	}

	c.JSON(http.StatusOK, UtilizationSeries{Series: series})
}

// GetOnboarding returns the onboarding checklist state
func (h *Handler) GetOnboarding(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()
	ctx := context.Background()

	checklist := OnboardingChecklist{
		TenantID: tenantID,
	}

	// Check if onboarding record exists
	var onboardingData string
	var updatedAt time.Time
	err := h.DB.QueryRow(ctx,
		`SELECT onboarding_data, updated_at FROM tenants WHERE id = $1`,
		tenantID).Scan(&onboardingData, &updatedAt)

	if err == nil && onboardingData != "" && onboardingData != "{}" {
		// Parse existing onboarding data
		json.Unmarshal([]byte(onboardingData), &checklist)
		checklist.UpdatedAt = updatedAt
	} else {
		// Auto-check based on existing data
		// Check logo uploaded
		var logoURL *string
		h.DB.QueryRow(ctx,
			`SELECT branding->>'logoUrl' FROM tenant_settings WHERE tenant_id = $1`,
			tenantID).Scan(&logoURL)
		checklist.LogoUploaded = logoURL != nil && *logoURL != ""

		// Check homepage published
		var publishedCount int
		h.DB.QueryRow(ctx,
			`SELECT COUNT(*) FROM pages WHERE tenant_id = $1 AND slug = 'home' AND published = true`,
			tenantID).Scan(&publishedCount)
		checklist.HomepagePublished = publishedCount > 0

		// Check first program
		var programCount int
		h.DB.QueryRow(ctx,
			`SELECT COUNT(*) FROM programs WHERE tenant_id = $1`,
			tenantID).Scan(&programCount)
		checklist.FirstProgram = programCount > 0

		// Check first facility
		var facilityCount int
		h.DB.QueryRow(ctx,
			`SELECT COUNT(*) FROM facilities WHERE tenant_id = $1`,
			tenantID).Scan(&facilityCount)
		checklist.FirstFacility = facilityCount > 0

		// Check first booking
		var bookingCount int
		h.DB.QueryRow(ctx,
			`SELECT COUNT(*) FROM bookings WHERE tenant_id = $1`,
			tenantID).Scan(&bookingCount)
		checklist.FirstBooking = bookingCount > 0

		checklist.UpdatedAt = time.Now()
	}

	c.JSON(http.StatusOK, checklist)
}

// UpdateOnboarding updates the onboarding checklist
func (h *Handler) UpdateOnboarding(c *gin.Context) {
	claims := middleware.GetClaimsFromContext(c)
	if claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tenantID := claims.TenantID.String()

	var req OnboardingUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	ctx := context.Background()

	// Get current state
	var currentData string
	h.DB.QueryRow(ctx,
		`SELECT onboarding_data FROM tenants WHERE id = $1`,
		tenantID).Scan(&currentData)

	checklist := OnboardingChecklist{}
	if currentData != "" && currentData != "{}" {
		json.Unmarshal([]byte(currentData), &checklist)
	}

	// Update fields
	if req.LogoUploaded != nil {
		checklist.LogoUploaded = *req.LogoUploaded
	}
	if req.HomepagePublished != nil {
		checklist.HomepagePublished = *req.HomepagePublished
	}
	if req.FirstProgram != nil {
		checklist.FirstProgram = *req.FirstProgram
	}
	if req.FirstFacility != nil {
		checklist.FirstFacility = *req.FirstFacility
	}
	if req.FirstBooking != nil {
		checklist.FirstBooking = *req.FirstBooking
	}

	checklist.UpdatedAt = time.Now()

	// Save to database
	data, _ := json.Marshal(checklist)
	_, err := h.DB.Exec(ctx,
		`UPDATE tenants SET onboarding_data = $1, updated_at = $2 WHERE id = $3`,
		string(data), checklist.UpdatedAt, tenantID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update onboarding"})
		return
	}

	c.JSON(http.StatusOK, checklist)
}
