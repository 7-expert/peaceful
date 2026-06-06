-- SQL Schema Setup for Peaceful Dental Solutions
-- Copy and paste this script into the Supabase SQL Editor (https://supabase.com dashboard under SQL Editor)
-- This script is safe to run multiple times.

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    price_pkr NUMERIC(10, 2) NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    stock_status TEXT DEFAULT 'in_stock', -- 'in_stock', 'out_of_stock', 'contact_for_availability'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (prevents already exists errors)
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow admin write access to products" ON public.products;

-- Create RLS Policies for Products
CREATE POLICY "Allow public read access to products"
ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Allow admin write access to products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Create Inquiries Table for Bulk Requests
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    organization TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_sku TEXT,
    quantity INTEGER DEFAULT 1,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'resolved'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert to inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow admin access to inquiries" ON public.inquiries;

-- Policy: Allow public to submit inquiries
CREATE POLICY "Allow public insert to inquiries"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- Policy: Only authenticated admin can view/manage inquiries
CREATE POLICY "Allow admin access to inquiries"
ON public.inquiries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Storage Setup Instructions
-- Go to Supabase Dashboard -> Storage
-- 1. Create a bucket named "product-images"
-- 2. Make it PUBLIC (so anyone can view images)
-- 3. The following policies are required for storage objects:

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public select in product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload in product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin modify in product-images" ON storage.objects;

-- Allow public read access to storage objects in "product-images" bucket
CREATE POLICY "Allow public select in product-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload/insert objects into "product-images"
CREATE POLICY "Allow admin upload in product-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update/delete objects in "product-images"
CREATE POLICY "Allow admin modify in product-images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');
