/*
# Initial Schema for Divine Consultation Services

1. New Tables
- `products`: Stores crystals, numerology readings, and consultation services
  - id (uuid, primary key)
  - name (text, not null)
  - description (text, not null)
  - price (decimal, not null)
  - image_url (text)
  - category (text, not null) - 'crystals', 'numerology', 'consultation'
  - created_at (timestamp)
- `contacts`: Stores contact form submissions from customers
  - id (uuid, primary key)
  - name (text, not null)
  - email (text, not null)
  - message (text, not null)
  - created_at (timestamp)

2. Security
- Enable RLS on both tables
- Products: Public read (catalog), authenticated write (admin management)
- Contacts: Public insert (contact form), authenticated read (admin view)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text NOT NULL CHECK (category IN ('crystals', 'numerology', 'consultation')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can view products (public catalog)
DROP POLICY IF EXISTS "public_view_products" ON products;
CREATE POLICY "public_view_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Products: Only authenticated users (admins) can create products
DROP POLICY IF EXISTS "admin_create_products" ON products;
CREATE POLICY "admin_create_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

-- Products: Only authenticated users (admins) can update products
DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Products: Only authenticated users (admins) can delete products
DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Contacts: Anyone can submit contact forms
DROP POLICY IF EXISTS "public_submit_contacts" ON contacts;
CREATE POLICY "public_submit_contacts" ON contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Contacts: Only authenticated users (admins) can view contacts
DROP POLICY IF EXISTS "admin_view_contacts" ON contacts;
CREATE POLICY "admin_view_contacts" ON contacts FOR SELECT
  TO authenticated USING (true);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at DESC);