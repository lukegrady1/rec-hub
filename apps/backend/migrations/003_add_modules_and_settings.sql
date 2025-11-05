-- Tenant settings table
CREATE TABLE tenant_settings (
  tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  branding jsonb NOT NULL DEFAULT '{}'::jsonb,
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules table (global catalog)
CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  default_enabled bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tenant modules (per-tenant feature toggles)
CREATE TABLE tenant_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  module_key text NOT NULL,
  enabled bool DEFAULT true,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, module_key)
);

CREATE INDEX idx_tenant_modules_tenant_id ON tenant_modules(tenant_id);

-- Audit logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);

-- Insert default modules
INSERT INTO modules (key, name, description, default_enabled) VALUES
  ('programs', 'Programs', 'Seasonal recreation programs', true),
  ('events', 'Events', 'Community events calendar', true),
  ('facilities', 'Facilities', 'Facility rentals and bookings', true),
  ('bookings', 'Bookings', 'Booking request system', true),
  ('announcements', 'Announcements', 'Public announcements', false),
  ('pages', 'Pages', 'Custom page builder', true);
