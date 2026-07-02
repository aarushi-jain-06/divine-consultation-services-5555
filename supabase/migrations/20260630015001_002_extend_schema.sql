/*
# Extend Schema for Divine Consultation Services

## Changes

1. **Products table** - Update category CHECK constraint to include new service categories:
   - rudraksh, vastu, matchmaking, healings, horoscope
   (existing categories crystals, numerology, consultation retained)

2. **New Table: testimonials**
   - id (uuid, primary key)
   - name (text, not null) - Customer name
   - review (text, not null) - Review text
   - rating (int, 1-5) - Star rating
   - approved (boolean, default false) - Admin must approve before display
   - created_at (timestamp)

3. **New Table: about_us**
   - id (uuid, primary key)
   - content (text, not null) - About Us page text, editable by admin
   - updated_at (timestamp)

## Security

- testimonials: Public insert (customers submit), public read of approved only, authenticated full access
- about_us: Public read, authenticated write (admin edits)
- products: Updated CHECK constraint for new categories

## Notes

- A default row is seeded into about_us so admin always has content to edit
- testimonials.approved defaults to false so customer submissions are held for review
*/

-- Update the category CHECK constraint on products to include new categories
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN ('crystals', 'numerology', 'consultation', 'rudraksh', 'vastu', 'matchmaking', 'healings', 'horoscope'));

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  review text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_view_approved_testimonials" ON testimonials;
CREATE POLICY "public_view_approved_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (approved = true OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "public_submit_testimonials" ON testimonials;
CREATE POLICY "public_submit_testimonials" ON testimonials FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- About Us table
CREATE TABLE IF NOT EXISTS about_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_view_about_us" ON about_us;
CREATE POLICY "public_view_about_us" ON about_us FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_about_us" ON about_us;
CREATE POLICY "admin_update_about_us" ON about_us FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_about_us" ON about_us;
CREATE POLICY "admin_insert_about_us" ON about_us FOR INSERT
  TO authenticated WITH CHECK (true);

-- Seed a default About Us entry if none exists
INSERT INTO about_us (content)
SELECT 'Our story coming soon...'
WHERE NOT EXISTS (SELECT 1 FROM about_us);

-- Index for testimonials ordering
CREATE INDEX IF NOT EXISTS testimonials_created_at_idx ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS testimonials_approved_idx ON testimonials(approved);