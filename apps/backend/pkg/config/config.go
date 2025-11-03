package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	// Database
	PostgresURL string
	RedisURL    string

	// Media
	MinioEndpoint   string
	MinioAccessKey  string
	MinioSecretKey  string

	// Auth
	JWTSecret string

	// Email
	SMTPHost  string
	SMTPPort  string
	FromEmail string

	// Server
	Port             string
	PublicBaseDomain string
	GinMode          string

	// Demo (for seeding)
	DemoAdminEmail    string
	DemoAdminPassword string
}

func Load() *Config {
	// Load .env file if it exists
	_ = godotenv.Load()

	return &Config{
		PostgresURL:       getEnv("POSTGRES_URL", "postgres://recuser:recpass@localhost:5432/rec?sslmode=disable"),
		RedisURL:          getEnv("REDIS_URL", "redis://localhost:6379"),
		MinioEndpoint:     getEnv("MINIO_ENDPOINT", "http://localhost:9000"),
		MinioAccessKey:    getEnv("MINIO_ACCESS_KEY", "minio"),
		MinioSecretKey:    getEnv("MINIO_SECRET_KEY", "minio123"),
		JWTSecret:         getEnv("JWT_SECRET", "dev-secret-change-in-production-32bytes!!"),
		SMTPHost:          getEnv("SMTP_HOST", "localhost"),
		SMTPPort:          getEnv("SMTP_PORT", "1025"),
		FromEmail:         getEnv("FROM_EMAIL", "no-reply@rechub.app"),
		Port:              getEnv("PORT", "8000"),
		PublicBaseDomain:  getEnv("PUBLIC_BASE_DOMAIN", "local.rechub"),
		GinMode:           getEnv("GIN_MODE", "debug"),
		DemoAdminEmail:    getEnv("DEMO_ADMIN_EMAIL", "admin@demo.local"),
		DemoAdminPassword: getEnv("DEMO_ADMIN_PASSWORD", "DemoPass123!"),
	}
}

func getEnv(key, defaultVal string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultVal
}

func (c *Config) DatabaseURL() string {
	return c.PostgresURL
}

func (c *Config) ServerAddress() string {
	return fmt.Sprintf(":%s", c.Port)
}
