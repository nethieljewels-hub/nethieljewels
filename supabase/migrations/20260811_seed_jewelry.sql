-- Migration: Seed premium jewelry data for Nethiel Jewelry storefront
-- Clears previous records from products, categories, hero_banners, and shipping_charges
-- Inserts new brand settings, jewelry categories, flat state shipping rates, and product listings

-- 1. CLEAN UP EXISTING SYSTEM RECORDS
DELETE FROM public.products;
DELETE FROM public.categories;
DELETE FROM public.hero_banners;
DELETE FROM public.shipping_charges;
DELETE FROM public.settings;

-- 2. SEED DEFAULT STOREFRONT SETTINGS (Singleton)
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
)
ON CONFLICT (id) DO UPDATE SET
  shop_name = EXCLUDED.shop_name,
  logo = EXCLUDED.logo,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  address = EXCLUDED.address;

-- 3. SEED JEWELRY CATEGORIES WITH FIXED UUIDs
INSERT INTO public.categories (id, name, slug, active)
VALUES
  ('c1c1c1c1-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'Rings', 'rings', true),
  ('d2d2d2d2-2d2d-2d2d-2d2d-2d2d2d2d2d2d', 'Necklaces', 'necklaces', true),
  ('e3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e', 'Earrings', 'earrings', true),
  ('b4b4b4b4-4b4b-4b4b-4b4b-4b4b4b4b4b4b', 'Bracelets', 'bracelets', true);

-- 4. SEED INSURED STATE SHIPPING CHARGES
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

-- 5. SEED PREMIUM JEWELRY PRODUCTS WITH INDIAN RUPEES PRICING
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
