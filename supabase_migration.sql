-- ============================================================
-- SUPABASE SQL: Reviews table + Product columns update
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Add new columns to the products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS size TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS feature_bullets TEXT[] DEFAULT ARRAY[
    'Precision Engineering',
    'Ergonomic Design',
    'High-Quality Materials',
    'ISO-Certified',
    'Lightweight Construction',
    'Signature Guarantee'
  ];

-- 2. Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT DEFAULT '',
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create index for fast product review lookups
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- 4. Enable Row Level Security on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 5. Allow anyone to INSERT reviews (public submission)
CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 6. Allow anyone to READ approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- 7. Allow authenticated users (admin) to read ALL reviews
CREATE POLICY "Admin can read all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

-- 8. Allow authenticated users (admin) to update reviews (approve/reject)
CREATE POLICY "Admin can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 9. Allow authenticated users (admin) to delete reviews
CREATE POLICY "Admin can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);
