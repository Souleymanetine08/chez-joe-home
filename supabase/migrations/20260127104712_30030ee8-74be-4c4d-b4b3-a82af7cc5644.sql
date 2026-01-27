-- Add product detail page settings and multiple images support
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS show_detail_page boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS size_small text,
ADD COLUMN IF NOT EXISTS size_large text,
ADD COLUMN IF NOT EXISTS dimensions_unit text DEFAULT 'cm';

-- Add tracking fields to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS tracking_id text UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- Create index for tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON public.orders(tracking_id);

-- Update RLS policy for public order tracking (read-only by tracking_id)
CREATE POLICY "Public can view orders by tracking_id"
ON public.orders
FOR SELECT
TO anon
USING (tracking_id IS NOT NULL);