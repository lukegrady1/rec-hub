-- Migration 007: Enhance events table with additional fields for admin management
-- Issue #11: Revamp Events Page

-- Add new columns to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  ADD COLUMN IF NOT EXISTS visibility BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS registered_count INT DEFAULT 0 CHECK (registered_count >= 0);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_visibility ON events(visibility);

-- Add unique constraint on slug per tenant
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_tenant_slug ON events(tenant_id, slug) WHERE slug IS NOT NULL;

-- Add check constraint to ensure ends_at is after starts_at
ALTER TABLE events
  ADD CONSTRAINT check_event_dates CHECK (ends_at > starts_at);

-- Add check constraint for capacity if it exists
ALTER TABLE events
  ADD CONSTRAINT check_event_capacity CHECK (capacity IS NULL OR capacity >= 0);

-- Add check constraint for registered_count vs capacity
ALTER TABLE events
  ADD CONSTRAINT check_registered_capacity CHECK (
    capacity IS NULL OR registered_count <= capacity
  );
