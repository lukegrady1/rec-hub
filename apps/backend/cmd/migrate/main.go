package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
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

	// Get migrations directory
	migrationsDir := filepath.Join(os.Getenv("PWD"), "migrations")
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		// Try relative path from current working directory
		migrationsDir = "migrations"
	}

	// Read and execute migration files
	files, err := os.ReadDir(migrationsDir)
	if err != nil {
		log.Fatalf("Unable to read migrations directory: %v\n", err)
	}

	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".sql") {
			continue
		}

		filePath := filepath.Join(migrationsDir, file.Name())
		sqlBytes, err := os.ReadFile(filePath)
		if err != nil {
			log.Fatalf("Unable to read migration file %s: %v\n", file.Name(), err)
		}

		sql := string(sqlBytes)
		fmt.Printf("Running migration: %s\n", file.Name())

		_, err = conn.Exec(context.Background(), sql)
		if err != nil {
			log.Fatalf("Error executing migration %s: %v\n", file.Name(), err)
		}

		fmt.Printf("✓ Migration completed: %s\n", file.Name())
	}

	fmt.Println("All migrations completed successfully!")
}
