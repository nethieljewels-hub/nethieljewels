-- Migration: Add product_code text column, make it unique, populate default codes for existing products, and drop sizes/colors attributes
-- Runs idempotently on Supabase PostgreSQL

DO $$
BEGIN
  -- 1. Add product_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'product_code') THEN
    ALTER TABLE public.products ADD COLUMN product_code TEXT;
  END IF;
END $$;

-- 2. Populate default product_code for any existing rows that have NULL
UPDATE public.products
SET product_code = 'NJ-PROD-' || UPPER(SUBSTRING(id::text FROM 1 FOR 8))
WHERE product_code IS NULL;

-- 3. Add UNIQUE constraint if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_product_code_key'
  ) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_product_code_key UNIQUE (product_code);
  END IF;
END $$;

-- 4. Drop obsolete attribute columns
ALTER TABLE public.products DROP COLUMN IF EXISTS sizes;
ALTER TABLE public.products DROP COLUMN IF EXISTS colors;

-- Comments for database documentation
COMMENT ON COLUMN public.products.product_code IS 'Unique code identifier for inventory and sales';
