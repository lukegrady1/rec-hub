-- Add onboarding_data column to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS onboarding_data TEXT DEFAULT '{}';
