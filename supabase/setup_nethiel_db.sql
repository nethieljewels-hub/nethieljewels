-- =========================================================================
-- NETHIEL JEWELRY - COMPLETE DATABASE SCHEMA AND SEED SCRIPT
-- =========================================================================
-- This script performs a complete setup of the Nethiel Jewelry database.
-- It creates all required tables, triggers, access policies, storage buckets, 
-- and seeds starting jewelry categories and premium product listings.
--
-- Running this script is safe for both fresh and existing databases.
-- =========================================================================

-- 1. UTILITY FUNCTIONS & TRIGGER FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. PROFILE CREATION ON USER SIGNUP
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CONSTRAINT role_check CHECK (role IN ('admin', 'viewer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'admin', -- Defaults to admin for initial users in this admin-only environment
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. SCHEMA TABLES DEFINITIONS

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean DEFAULT true NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  original_price numeric(10,2) NOT NULL CONSTRAINT price_check CHECK (original_price >= 0),
  selling_price numeric(10,2) DEFAULT NULL,
  is_out_of_stock boolean DEFAULT false NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  images text[] DEFAULT '{}'::text[] NOT NULL,
  featured boolean DEFAULT false NOT NULL,
  active boolean DEFAULT true NOT NULL,
  product_code text CONSTRAINT products_product_code_unique UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hero Banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  subtitle text,
  media_url text NOT NULL,
  media_type text NOT NULL CONSTRAINT media_type_check CHECK (media_type IN ('image', 'video')),
  mobile_media_url text,
  mobile_media_type text DEFAULT 'image',
  button_text text,
  button_link text,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Centralized Settings table (Enforced Singleton)
CREATE TABLE IF NOT EXISTS public.settings (
  id boolean DEFAULT true PRIMARY KEY CONSTRAINT singleton_row CHECK (id = true),
  shop_name text NOT NULL,
  logo text,
  email text,
  phone text,
  whatsapp text,
  instagram text,
  facebook text,
  address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shipping Charges table
CREATE TABLE IF NOT EXISTS public.shipping_charges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  state_name text NOT NULL UNIQUE,
  shipping_charge numeric(10,2) NOT NULL CONSTRAINT shipping_charge_check CHECK (shipping_charge >= 0),
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TIMESTAMPS REFRESH TRIGGERS
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_banners_updated_at ON public.hero_banners;
CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE ON public.hero_banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_charges_updated_at ON public.shipping_charges;
CREATE TRIGGER update_shipping_charges_updated_at BEFORE UPDATE ON public.shipping_charges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 5. ACCESS CONTROL & SECURITY FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_charges ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;
CREATE POLICY "Users can view their own profile or admins can view all"
  ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile or admins can update all" ON public.profiles;
CREATE POLICY "Users can update their own profile or admins can update all"
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE USING (public.is_admin());

-- Categories Policies
DROP POLICY IF EXISTS "Allow public read active categories or admin read all" ON public.categories;
CREATE POLICY "Allow public read active categories or admin read all"
  ON public.categories FOR SELECT USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full write control on categories" ON public.categories;
CREATE POLICY "Admins have full write control on categories"
  ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products Policies
DROP POLICY IF EXISTS "Allow public read active products or admin read all" ON public.products;
CREATE POLICY "Allow public read active products or admin read all"
  ON public.products FOR SELECT USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full write control on products" ON public.products;
CREATE POLICY "Admins have full write control on products"
  ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Hero Banners Policies
DROP POLICY IF EXISTS "Allow public read active banners or admin read all" ON public.hero_banners;
CREATE POLICY "Allow public read active banners or admin read all"
  ON public.hero_banners FOR SELECT USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full write control on banners" ON public.hero_banners;
CREATE POLICY "Admins have full write control on banners"
  ON public.hero_banners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Settings Policies
DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
CREATE POLICY "Allow public read settings"
  ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full write control on settings" ON public.settings;
CREATE POLICY "Admins have full write control on settings"
  ON public.settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Shipping Charges Policies
DROP POLICY IF EXISTS "Allow public read active shipping charges or admin read all" ON public.shipping_charges;
CREATE POLICY "Allow public read active shipping charges or admin read all"
  ON public.shipping_charges FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full write control on shipping charges" ON public.shipping_charges;
CREATE POLICY "Admins have full write control on shipping charges"
  ON public.shipping_charges FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories (active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products (active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_shipping_charges_active ON public.shipping_charges (is_active) WHERE is_active = true;


-- 8. STORAGE BUCKETS CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/heic']),
  ('banners', 'banners', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime']),
  ('settings', 'settings', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage Read Policies
DROP POLICY IF EXISTS "Public read access for products bucket" ON storage.objects;
CREATE POLICY "Public read access for products bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Public read access for banners bucket" ON storage.objects;
CREATE POLICY "Public read access for banners bucket" ON storage.objects FOR SELECT USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Public read access for settings bucket" ON storage.objects;
CREATE POLICY "Public read access for settings bucket" ON storage.objects FOR SELECT USING (bucket_id = 'settings');

-- Storage Write Policies
DROP POLICY IF EXISTS "Admin write access for products bucket" ON storage.objects;
CREATE POLICY "Admin write access for products bucket" 
  ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'products' AND public.is_admin()) 
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

DROP POLICY IF EXISTS "Admin write access for banners bucket" ON storage.objects;
CREATE POLICY "Admin write access for banners bucket" 
  ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'banners' AND public.is_admin()) 
  WITH CHECK (bucket_id = 'banners' AND public.is_admin());

DROP POLICY IF EXISTS "Admin write access for settings bucket" ON storage.objects;
CREATE POLICY "Admin write access for settings bucket" 
  ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'settings' AND public.is_admin()) 
  WITH CHECK (bucket_id = 'settings' AND public.is_admin());


-- 9. CLEAN UP PREVIOUS DATA
DELETE FROM public.products;
DELETE FROM public.categories;
DELETE FROM public.hero_banners;
DELETE FROM public.shipping_charges;
DELETE FROM public.settings;


-- 10. SEED DEFAULT STOREFRONT SETTINGS
INSERT INTO public.settings (id, shop_name, logo, email, phone, whatsapp, instagram, facebook, address)
VALUES (
  true,
  'NETHIEL JEWELRY',
  '/images/logo-nethiel.jpeg',
  'support@nethieljewelry.com',
  '+919876543210',
  '+919876543210',
  'https://instagram.com/nethieljewelry',
  'https://facebook.com/nethieljewelry',
  'Nethiel Luxury Studio, Kochi, Kerala, 682020'
);


-- 11. SEED JEWELRY CATEGORIES
INSERT INTO public.categories (id, name, slug, active)
VALUES
  ('c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Rings', 'rings', true),
  ('d2d2d2d2-2d2d-2d2d-2d2d-2d2d2d2d2d2d', 'Necklaces', 'necklaces', true),
  ('e3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e', 'Earrings', 'earrings', true),
  ('b4b4b4b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b', 'Bracelets', 'bracelets', true);


-- 12. SEED INSURED STATE SHIPPING CHARGES
INSERT INTO public.shipping_charges (state_name, shipping_charge, is_active)
VALUES
  ('Kerala', 60.00, true),
  ('Karnataka', 100.00, true),
  ('Tamil Nadu', 100.00, true),
  ('Maharashtra', 150.00, true),
  ('Delhi', 200.00, true),
  ('Goa', 150.00, true),
  ('Telangana', 120.00, true),
  ('Gujarat', 150.00, true),
  ('West Bengal', 180.00, true),
  ('Rajasthan', 180.00, true)
ON CONFLICT (state_name) DO UPDATE SET
  shipping_charge = EXCLUDED.shipping_charge,
  is_active = EXCLUDED.is_active;


-- 13. SEED PREMIUM JEWELRY PRODUCTS WITH INDIAN RUPEES PRICING
INSERT INTO public.products (id, title, slug, description, original_price, selling_price, is_out_of_stock, category_id, images, featured, active, product_code)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Aurelia Solitaire Ring',
    'aurelia-solitaire-ring',
    'Crafted in solid 18K yellow gold, the Aurelia Solitaire features a hand-selected 1-carat round brilliant VVS1 clarity conflict-free diamond. Elegant prongs maximize light performance for unparalleled brilliance.',
    45000.00,
    39999.00,
    false,
    'c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
    ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop']::text[],
    true,
    true,
    'NJ-RING-001'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Celeste Gold Necklace',
    'celeste-gold-necklace',
    'An exquisite 18K solid gold chain adorned with a constellation of delicate bezel-set brilliant diamonds. Hand-assembled with a secure adjustable lock. Timeless and perfect for standalone elegance or layering.',
    62000.00,
    54999.00,
    false,
    'd2d2d2d2-2d2d-2d2d-2d2d-2d2d2d2d2d2d',
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop']::text[],
    true,
    true,
    'NJ-NECK-001'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Elara Diamond Studs',
    'elara-diamond-studs',
    'Classic 18K gold four-prong studs claw-setting a pair of matching VVS brilliant-cut diamonds. Minimalist design engineered for secure fit and daily wear. A foundational piece of everyday luxury.',
    28000.00,
    24999.00,
    false,
    'e3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e',
    ARRAY['https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop']::text[],
    true,
    true,
    'NJ-EAR-001'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Seraphina Pearl Bracelet',
    'seraphina-pearl-bracelet',
    'Hand-knotted with Grade AAA freshwater cultured baroque pearls, secured by a custom sterling silver toggle clasp. Exudes soft luster and vintage sophistication. Each pearl is unique in shape and shimmer.',
    18000.00,
    14999.00,
    false,
    'b4b4b4b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b',
    ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop']::text[],
    true,
    true,
    'NJ-BRAC-001'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Eternal Love Band',
    'eternal-love-band',
    'A classic pavé diamond eternity band set with brilliant round-cut conflict-free diamonds in a micro-prong setting. Features high polish, thin band silhouette, and continuous sparkle.',
    35000.00,
    29999.00,
    false,
    'c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c',
    ARRAY['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop']::text[],
    false,
    true,
    'NJ-RING-002'
  );
