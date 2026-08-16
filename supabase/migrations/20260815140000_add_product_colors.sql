-- Migration: Add colors TEXT[] column to public.products table
-- Runs idempotently on Supabase PostgreSQL

DO $$
BEGIN
  -- 1. Add colors column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'colors') THEN
    ALTER TABLE public.products ADD COLUMN colors TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- 2. Populate default empty array for any existing rows that have NULL
UPDATE public.products
SET colors = '{}'
WHERE colors IS NULL;

-- Comment for database documentation
COMMENT ON COLUMN public.products.colors IS 'Array of available color names configured by admin (e.g. Gold, Rose Gold, Ruby Red)';
