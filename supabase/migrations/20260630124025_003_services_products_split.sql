/*
# Services & Products Split

## Summary
Restructures the products table to distinguish between "services" and "products",
adds ordering support, seeds the 7 predefined services and 4 predefined products
with empty/placeholder data for admins to fill in via the dashboard.

## Changes

### Modified Table: products
- `type` (text, NOT NULL, default 'product') — 'service' or 'product'
- `sort_order` (integer, default 0) — controls display order within each type
- `price` — changed from NOT NULL to nullable (admin fills later)
- `description` — already NOT NULL but now seeds with empty string

### Updated category CHECK constraint
Adds new categories: visiting_card, name_design, ubtan, bath_salts

### Seeded Rows
7 services (in order): vastu, visiting_card, numerology, name_design, healings, horoscope, matchmaking
4 products (in order): rudraksh, crystals, ubtan, bath_salts

### about_us
Clears the default placeholder text to empty string so admin starts fresh.
*/

-- Add type column
ALTER TABLE products ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'product';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Make price nullable so admin can leave it blank
ALTER TABLE products ALTER COLUMN price DROP NOT NULL;

-- Update category constraint to include all new categories
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (
  category IN (
    'crystals', 'numerology', 'consultation',
    'rudraksh', 'vastu', 'matchmaking', 'healings', 'horoscope',
    'visiting_card', 'name_design', 'ubtan', 'bath_salts'
  )
);

-- Add type constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
ALTER TABLE products ADD CONSTRAINT products_type_check CHECK (type IN ('service', 'product'));

-- Seed 7 services (skip if already exist by category+type)
INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Vastu', '', NULL, NULL, 'vastu', 'service', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'vastu' AND type = 'service');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Visiting Card & Logo Design', '', NULL, NULL, 'visiting_card', 'service', 2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'visiting_card' AND type = 'service');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Numerology', '', NULL, NULL, 'numerology', 'service', 3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'numerology' AND type = 'service');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Name Design & Name Correction', '', NULL, NULL, 'name_design', 'service', 4
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'name_design' AND type = 'service');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Healings', '', NULL, NULL, 'healings', 'service', 5
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'healings' AND type = 'service');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Horoscope Analysis', '', NULL, NULL, 'horoscope', 'service', 6
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'horoscope' AND type = 'service');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Matchmaking', '', NULL, NULL, 'matchmaking', 'service', 7
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'matchmaking' AND type = 'service');

-- Seed 4 products
INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Rudraksh', '', NULL, NULL, 'rudraksh', 'product', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'rudraksh' AND type = 'product');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Crystals', '', NULL, NULL, 'crystals', 'product', 2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'crystals' AND type = 'product');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Ubtan', '', NULL, NULL, 'ubtan', 'product', 3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'ubtan' AND type = 'product');

INSERT INTO products (name, description, price, image_url, category, type, sort_order)
SELECT 'Bath Salts', '', NULL, NULL, 'bath_salts', 'product', 4
WHERE NOT EXISTS (SELECT 1 FROM products WHERE category = 'bath_salts' AND type = 'product');

-- Clear the about_us placeholder text
UPDATE about_us SET content = '', updated_at = now() WHERE content = 'Our story coming soon...';

-- Index for type-based queries
CREATE INDEX IF NOT EXISTS products_type_idx ON products(type, sort_order);