package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/rec-hub/backend/pkg/config"
	"github.com/rec-hub/backend/pkg/db"
	"github.com/rec-hub/backend/pkg/handlers"
	"github.com/rec-hub/backend/pkg/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Initialize database connections
	pgPool, err := db.NewPostgres(cfg.PostgresURL)
	if err != nil {
		log.Fatalf("Failed to initialize PostgreSQL: %v", err)
	}
	defer db.ClosePostgres(pgPool)

	redisClient, err := db.NewRedis(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Failed to initialize Redis: %v", err)
	}
	defer db.CloseRedis(redisClient)

	// Create Gin router
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Tenant-Domain")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Initialize handlers with dependencies
	h := &handlers.Handler{
		DB:        pgPool,
		Redis:     redisClient,
		Config:    cfg,
		TenantID:  "", // Will be set by middleware
	}

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		// Auth routes (no tenant middleware required)
		auth := api.Group("/auth")
		{
			auth.POST("/register", h.RegisterHandler)
			auth.POST("/login", h.LoginHandler)
		}

		// Boot endpoint (with tenant resolver)
		api.GET("/boot", middleware.TenantResolver(cfg), h.BootHandler)

		// Protected routes (with auth and tenant resolver)
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(cfg))
		protected.Use(middleware.TenantResolver(cfg))
		{
			// Pages
			pages := protected.Group("/pages")
			{
				pages.GET("", h.ListPages)
				pages.POST("", h.CreatePage)
				pages.PUT("/:id", h.UpdatePage)
				pages.DELETE("/:id", h.DeletePage)
			}

			// Blocks
			blocks := protected.Group("/blocks")
			{
				blocks.GET("", h.ListBlocks)
				blocks.POST("", h.CreateBlock)
				blocks.PUT("/:id", h.UpdateBlock)
				blocks.DELETE("/:id", h.DeleteBlock)
			}

			// Media
			media := protected.Group("/media")
			{
				media.POST("/presign", h.PresignMediaUpload)
				media.GET("/:id", h.GetMediaAsset)
			}

			// Settings
			settings := protected.Group("/settings")
			{
				settings.GET("", h.GetTenantSettings)
				settings.PUT("", h.UpdateTenantSettings)
			}

			// Programs
			programs := protected.Group("/programs")
			{
				programs.GET("", h.ListPrograms)
				programs.POST("", h.CreateProgram)
				programs.PUT("/:id", h.UpdateProgram)
				programs.DELETE("/:id", h.DeleteProgram)
			}

			// Events
			events := protected.Group("/events")
			{
				events.GET("", h.ListEvents)
				events.POST("", h.CreateEvent)
				events.PUT("/:id", h.UpdateEvent)
				events.DELETE("/:id", h.DeleteEvent)
			}

			// Facilities
			facilities := protected.Group("/facilities")
			{
				facilities.GET("", h.ListFacilities)
				facilities.POST("", h.CreateFacility)
				facilities.PUT("/:id", h.UpdateFacility)
				facilities.DELETE("/:id", h.DeleteFacility)
			}

			// Facility slots
			slots := protected.Group("/facility-slots")
			{
				slots.GET("", h.ListFacilitySlots)
				slots.POST("", h.CreateFacilitySlot)
				slots.PUT("/:id", h.UpdateFacilitySlot)
				slots.DELETE("/:id", h.DeleteFacilitySlot)
			}

			// Bookings
			bookings := protected.Group("/bookings")
			{
				bookings.GET("", h.ListBookings)
				bookings.PUT("/:id", h.UpdateBooking)
			}

			// Program Registrations
			registrations := protected.Group("/program-registrations")
			{
				registrations.POST("", h.CreateProgramRegistration)
				registrations.GET("", h.ListProgramRegistrations)
				registrations.PUT("/:id/status", h.UpdateProgramRegistrationStatus)
			}
		}

		// Public routes (no auth required, but with tenant resolver)
		public := api.Group("/public")
		public.Use(middleware.TenantResolver(cfg))
		{
			// Public pages
			public.GET("/pages/:slug", h.GetPublicPage)

			// Public programs
			public.GET("/programs", h.GetPublicPrograms)

			// Public events
			public.GET("/events/upcoming", h.GetUpcomingEvents)

			// Public facilities
			public.GET("/facilities", h.GetPublicFacilities)

			// Public bookings
			public.POST("/bookings", h.CreatePublicBooking)

			// Public auth (for residents to create accounts)
			public.POST("/register", h.PublicRegister)
			public.POST("/login", h.PublicLogin)

			// Sitemap
			public.GET("/sitemap.xml", h.GetSitemap)
		}
	}

	// Start server
	addr := cfg.ServerAddress()
	fmt.Printf("Starting server on %s\n", addr)
	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
