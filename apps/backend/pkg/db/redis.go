package db

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

func NewRedis(redisURL string) (*redis.Client, error) {
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("unable to parse redis URL: %w", err)
	}

	client := redis.NewClient(opt)

	// Test connection
	err = client.Ping(context.Background()).Err()
	if err != nil {
		return nil, fmt.Errorf("unable to ping redis: %w", err)
	}

	return client, nil
}

func CloseRedis(client *redis.Client) error {
	return client.Close()
}
