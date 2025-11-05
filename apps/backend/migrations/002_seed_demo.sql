-- Seed demo data
-- Demo tenant
INSERT INTO tenants (id, name, slug, plan, status)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo City Recreation', 'demo', 'starter', 'active');

-- Demo tenant domain
INSERT INTO tenant_domains (tenant_id, domain, is_primary, verified_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'demo.local.rechub', true, now());

-- Demo admin user (password: DemoPass123!)
-- Hash generated with argon2id
INSERT INTO users (id, email, password_hash)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'admin@demo.local', '8f0e8e8c8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e');

-- Demo tenant user (OWNER role)
INSERT INTO tenant_users (tenant_id, user_id, role)
VALUES ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'OWNER');

-- Tenant settings (branding and theme)
INSERT INTO tenant_settings (tenant_id, branding, theme, config) VALUES
('550e8400-e29b-41d4-a716-446655440000',
 '{"logo_url":null,"primary_color":"#2563EB","accent_color":"#10B981"}'::jsonb,
 '{"font":"Inter","rounded":"2xl"}'::jsonb,
 '{"timezone":"America/New_York","locale":"en-US"}'::jsonb);

-- Enable all modules for demo tenant
INSERT INTO tenant_modules (tenant_id, module_key, enabled, config) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'programs', true, '{}'::jsonb),
('550e8400-e29b-41d4-a716-446655440000', 'events', true, '{}'::jsonb),
('550e8400-e29b-41d4-a716-446655440000', 'facilities', true, '{}'::jsonb),
('550e8400-e29b-41d4-a716-446655440000', 'bookings', true, '{}'::jsonb),
('550e8400-e29b-41d4-a716-446655440000', 'pages', true, '{}'::jsonb),
('550e8400-e29b-41d4-a716-446655440000', 'announcements', false, '{}'::jsonb);

-- Home page
INSERT INTO pages (id, tenant_id, slug, title, meta, published)
VALUES ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'home', 'Home', '{"description":"Welcome to Demo City Recreation"}', true);

-- Page blocks
INSERT INTO page_blocks (page_id, kind, "order", config) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'hero', 1, '{"headline":"Welcome to Demo City Recreation","subheadline":"Discover programs, events, and facilities in our community","ctaText":"Explore Programs","ctaHref":"/programs","overlayOpacity":0.4,"align":"center"}'),
('550e8400-e29b-41d4-a716-446655440002', 'program_grid', 2, '{"limit":6,"showPrice":true}'),
('550e8400-e29b-41d4-a716-446655440002', 'event_list', 3, '{"limit":4,"showDates":true}'),
('550e8400-e29b-41d4-a716-446655440002', 'cta', 4, '{"text":"Book a Facility","href":"/facilities","style":"primary"}');

-- Sample programs
INSERT INTO programs (tenant_id, title, description, season, price_cents, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Youth Soccer', 'Fun and engaging soccer program for ages 5-12', 'Fall 2024', 10000, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Adult Basketball', 'Competitive basketball league for adults 18+', 'Winter 2024', 15000, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Swimming Lessons', 'Professional swimming instruction for all ages', 'Year-round', 5000, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Yoga Classes', 'Relaxing and strengthening yoga for all levels', 'Year-round', 8000, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Tennis Camp', 'Intensive tennis training with professional coaches', 'Summer 2025', 20000, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Dance & Movement', 'Creative dance classes for children and adults', 'Fall 2024', 7000, 'active');

-- Sample events
INSERT INTO events (tenant_id, title, description, starts_at, ends_at, location, capacity) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Community Sports Day', 'Fun day with various sports activities for families', now() + interval '7 days', now() + interval '7 days' + interval '4 hours', 'Central Park', 200),
('550e8400-e29b-41d4-a716-446655440000', 'Fitness Expo', 'Learn about health and fitness from local experts', now() + interval '14 days', now() + interval '14 days' + interval '3 hours', 'Recreation Center', 150),
('550e8400-e29b-41d4-a716-446655440000', 'Kids Summer Camp Kickoff', 'Join us for an exciting summer camp experience', now() + interval '30 days', now() + interval '30 days' + interval '2 hours', 'Recreation Center', 100),
('550e8400-e29b-41d4-a716-446655440000', 'Adult Swimming Championships', 'Competitive swimming event for adult participants', now() + interval '40 days', now() + interval '40 days' + interval '5 hours', 'Community Pool', 300);

-- Sample facilities
INSERT INTO facilities (id, tenant_id, name, type, address, rules) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Main Gymnasium', 'gym', '123 Recreation St', 'No outside shoes. Must be member.'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Tennis Court', 'court', '123 Recreation St', 'Reservations required. 30-minute slots.'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Community Pool', 'facility', '456 Water Ave', 'Swimsuits required. Supervision for children under 12.');

-- Facility slots (4 per facility)
INSERT INTO facility_slots (facility_id, starts_at, ends_at, status) VALUES
-- Main Gymnasium slots
('550e8400-e29b-41d4-a716-446655440010', now() + interval '1 day' + interval '10 hours', now() + interval '1 day' + interval '11 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440010', now() + interval '1 day' + interval '12 hours', now() + interval '1 day' + interval '13 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440010', now() + interval '1 day' + interval '14 hours', now() + interval '1 day' + interval '15 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440010', now() + interval '1 day' + interval '16 hours', now() + interval '1 day' + interval '17 hours', 'open'),
-- Tennis Court slots
('550e8400-e29b-41d4-a716-446655440011', now() + interval '1 day' + interval '10 hours', now() + interval '1 day' + interval '11 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440011', now() + interval '1 day' + interval '12 hours', now() + interval '1 day' + interval '13 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440011', now() + interval '1 day' + interval '14 hours', now() + interval '1 day' + interval '15 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440011', now() + interval '1 day' + interval '16 hours', now() + interval '1 day' + interval '17 hours', 'open'),
-- Community Pool slots
('550e8400-e29b-41d4-a716-446655440012', now() + interval '1 day' + interval '10 hours', now() + interval '1 day' + interval '11 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440012', now() + interval '1 day' + interval '12 hours', now() + interval '1 day' + interval '13 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440012', now() + interval '1 day' + interval '14 hours', now() + interval '1 day' + interval '15 hours', 'open'),
('550e8400-e29b-41d4-a716-446655440012', now() + interval '1 day' + interval '16 hours', now() + interval '1 day' + interval '17 hours', 'open');
