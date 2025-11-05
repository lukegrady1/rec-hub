-- Add RESIDENT role to tenant_users role constraint
ALTER TABLE tenant_users DROP CONSTRAINT IF EXISTS tenant_users_role_check;
ALTER TABLE tenant_users ADD CONSTRAINT tenant_users_role_check
  CHECK (role IN ('OWNER', 'ADMIN', 'STAFF', 'VIEWER', 'RESIDENT'));

-- Add profile fields to users table for residents
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Program registrations table
CREATE TABLE IF NOT EXISTS program_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'waitlisted', 'cancelled', 'completed')),
  participant_name text NOT NULL,
  participant_age int,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  registered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(program_id, user_id)
);

CREATE INDEX idx_program_registrations_tenant_id ON program_registrations(tenant_id);
CREATE INDEX idx_program_registrations_program_id ON program_registrations(program_id);
CREATE INDEX idx_program_registrations_user_id ON program_registrations(user_id);
CREATE INDEX idx_program_registrations_status ON program_registrations(status);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
  attendee_count int NOT NULL DEFAULT 1,
  notes text,
  registered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_event_registrations_tenant_id ON event_registrations(tenant_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
