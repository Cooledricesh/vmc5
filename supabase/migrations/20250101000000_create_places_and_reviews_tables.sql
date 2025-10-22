-- Migration: Create places and reviews tables for restaurant review platform
-- Description: Initial schema setup for places (restaurants) and reviews
-- Author: System
-- Date: 2025-01-01

BEGIN;

-- ============================================================================
-- 1. Create updated_at trigger function
-- ============================================================================
-- This function automatically updates the updated_at column on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. Create places table
-- ============================================================================
-- Stores restaurant/place information from Naver Search API
CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  naver_place_id VARCHAR(255) NOT NULL UNIQUE,  -- Naver API's unique place ID
  name VARCHAR(255) NOT NULL,                    -- Place name
  address TEXT NOT NULL,                         -- Full address
  latitude NUMERIC(10, 7) NOT NULL,              -- Latitude (-90 to 90)
  longitude NUMERIC(10, 7) NOT NULL,             -- Longitude (-180 to 180)
  category VARCHAR(100),                         -- Category (e.g., Korean food, Cafe)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT places_latitude_check CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT places_longitude_check CHECK (longitude >= -180 AND longitude <= 180)
);

-- Add comment to table
COMMENT ON TABLE places IS 'Stores restaurant/place information from Naver Search API';

-- Add comments to columns
COMMENT ON COLUMN places.id IS 'Internal unique identifier (auto-increment)';
COMMENT ON COLUMN places.naver_place_id IS 'Naver Search API place unique ID';
COMMENT ON COLUMN places.name IS 'Place name';
COMMENT ON COLUMN places.address IS 'Full address of the place';
COMMENT ON COLUMN places.latitude IS 'Latitude coordinate (-90 to 90)';
COMMENT ON COLUMN places.longitude IS 'Longitude coordinate (-180 to 180)';
COMMENT ON COLUMN places.category IS 'Place category (optional, e.g., Korean food, Cafe)';
COMMENT ON COLUMN places.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN places.updated_at IS 'Record last update timestamp (auto-updated by trigger)';

-- Create indexes for places table
CREATE INDEX IF NOT EXISTS idx_places_coordinates
  ON places (latitude, longitude);

COMMENT ON INDEX idx_places_coordinates IS 'Index for coordinate-based searches (map queries)';

-- Add updated_at trigger to places table
DROP TRIGGER IF EXISTS trigger_places_updated_at ON places;
CREATE TRIGGER trigger_places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. Create reviews table
-- ============================================================================
-- Stores user reviews for places
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  place_id INTEGER NOT NULL,                     -- Foreign key to places.id
  nickname VARCHAR(50) NOT NULL,                 -- Reviewer nickname (no signup required)
  password_hash VARCHAR(255) NOT NULL,           -- Bcrypt hashed 4-digit password
  rating NUMERIC(2, 1) NOT NULL,                 -- Rating (1.0 to 5.0, 0.5 increments)
  review_text TEXT,                              -- Review text (optional)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT reviews_place_id_fkey
    FOREIGN KEY (place_id)
    REFERENCES places(id)
    ON DELETE CASCADE,
  CONSTRAINT reviews_rating_check
    CHECK (rating >= 1.0 AND rating <= 5.0)
);

-- Add comment to table
COMMENT ON TABLE reviews IS 'Stores user reviews for places (restaurants)';

-- Add comments to columns
COMMENT ON COLUMN reviews.id IS 'Review unique identifier (auto-increment)';
COMMENT ON COLUMN reviews.place_id IS 'Foreign key to places.id';
COMMENT ON COLUMN reviews.nickname IS 'Reviewer nickname (not unique, no signup)';
COMMENT ON COLUMN reviews.password_hash IS 'Bcrypt hashed 4-digit numeric password';
COMMENT ON COLUMN reviews.rating IS 'Star rating (1.0 to 5.0, 0.5 increments)';
COMMENT ON COLUMN reviews.review_text IS 'Review text content (optional)';
COMMENT ON COLUMN reviews.created_at IS 'Review creation timestamp';
COMMENT ON COLUMN reviews.updated_at IS 'Review last update timestamp (auto-updated by trigger)';

-- Create indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_place_id
  ON reviews (place_id);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at
  ON reviews (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_nickname
  ON reviews (nickname);

COMMENT ON INDEX idx_reviews_place_id IS 'Index for fetching reviews by place (most common query)';
COMMENT ON INDEX idx_reviews_created_at IS 'Index for sorting reviews by newest first';
COMMENT ON INDEX idx_reviews_nickname IS 'Index for nickname-based authentication queries';

-- Add updated_at trigger to reviews table
DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. Disable RLS (Row Level Security)
-- ============================================================================
-- As per project requirements, RLS is disabled
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. Create helper views (optional, for convenience)
-- ============================================================================

-- View: places_with_reviews
-- Returns places that have at least one review (for map markers)
CREATE OR REPLACE VIEW places_with_reviews AS
SELECT DISTINCT
  p.id,
  p.naver_place_id,
  p.name,
  p.address,
  p.latitude,
  p.longitude,
  p.category,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating)::numeric, 1) as avg_rating
FROM places p
INNER JOIN reviews r ON p.id = r.place_id
GROUP BY p.id, p.naver_place_id, p.name, p.address, p.latitude, p.longitude, p.category
ORDER BY review_count DESC;

COMMENT ON VIEW places_with_reviews IS 'View of places that have at least one review (for map markers)';

-- View: place_details
-- Returns place information with aggregated review statistics
CREATE OR REPLACE VIEW place_details AS
SELECT
  p.id,
  p.naver_place_id,
  p.name,
  p.address,
  p.latitude,
  p.longitude,
  p.category,
  p.created_at,
  p.updated_at,
  COALESCE(COUNT(r.id), 0) as review_count,
  COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) as avg_rating
FROM places p
LEFT JOIN reviews r ON p.id = r.place_id
GROUP BY p.id, p.naver_place_id, p.name, p.address, p.latitude, p.longitude, p.category, p.created_at, p.updated_at;

COMMENT ON VIEW place_details IS 'View of places with aggregated review statistics (count and average rating)';

-- ============================================================================
-- 6. Grant permissions (if needed for Supabase service role)
-- ============================================================================
-- Note: Supabase typically handles permissions automatically
-- These are included for completeness

-- Grant usage on sequences
GRANT USAGE, SELECT ON SEQUENCE places_id_seq TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE reviews_id_seq TO anon, authenticated, service_role;

-- Grant table permissions
GRANT ALL ON TABLE places TO anon, authenticated, service_role;
GRANT ALL ON TABLE reviews TO anon, authenticated, service_role;

-- Grant view permissions
GRANT SELECT ON places_with_reviews TO anon, authenticated, service_role;
GRANT SELECT ON place_details TO anon, authenticated, service_role;

-- ============================================================================
-- 7. Create indexes for performance optimization
-- ============================================================================
-- Additional composite indexes for common query patterns

-- Composite index for place lookups with review count
CREATE INDEX IF NOT EXISTS idx_reviews_place_id_created_at
  ON reviews (place_id, created_at DESC);

COMMENT ON INDEX idx_reviews_place_id_created_at IS 'Composite index for fetching recent reviews by place';

-- ============================================================================
-- Migration Complete
-- ============================================================================

COMMIT;

-- ============================================================================
-- Verification queries (run separately to check migration success)
-- ============================================================================

-- Check tables
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check indexes
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;

-- Check triggers
-- SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';

-- Check constraints
-- SELECT conname, contype, conrelid::regclass AS table_name FROM pg_constraint WHERE connamespace = 'public'::regnamespace;
