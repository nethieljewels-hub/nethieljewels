-- Migration: Add optional SEO metadata fields to products and categories
-- Safe and idempotent execution for Supabase PostgreSQL

DO $$
BEGIN
  -- 1. Add seo_title & seo_description to categories if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'seo_title') THEN
    ALTER TABLE public.categories ADD COLUMN seo_title TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'seo_description') THEN
    ALTER TABLE public.categories ADD COLUMN seo_description TEXT;
  END IF;

  -- 2. Add seo_title & seo_description to products if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'seo_title') THEN
    ALTER TABLE public.products ADD COLUMN seo_title TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'seo_description') THEN
    ALTER TABLE public.products ADD COLUMN seo_description TEXT;
  END IF;
END $$;

-- 3. Comments for documentation
COMMENT ON COLUMN public.categories.seo_title IS 'Custom SEO page title for category (fallback generated dynamically if NULL)';
COMMENT ON COLUMN public.categories.seo_description IS 'Custom SEO meta description for category (fallback generated dynamically if NULL)';
COMMENT ON COLUMN public.products.seo_title IS 'Custom SEO page title for product (fallback generated dynamically if NULL)';
COMMENT ON COLUMN public.products.seo_description IS 'Custom SEO meta description for product (fallback generated dynamically if NULL)';
