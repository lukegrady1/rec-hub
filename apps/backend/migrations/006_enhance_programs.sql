-- Add additional fields to programs table for enhanced management
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
