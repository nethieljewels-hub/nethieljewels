-- Migration: Drop shipping_charges table, triggers, indexes, and policies completely

DROP TRIGGER IF EXISTS update_shipping_charges_updated_at ON public.shipping_charges;
DROP INDEX IF EXISTS public.idx_shipping_charges_active;
DROP POLICY IF EXISTS "Allow public read active shipping charges or admin read all" ON public.shipping_charges;
DROP POLICY IF EXISTS "Admins have full write control on shipping charges" ON public.shipping_charges;
DROP TABLE IF EXISTS public.shipping_charges CASCADE;
