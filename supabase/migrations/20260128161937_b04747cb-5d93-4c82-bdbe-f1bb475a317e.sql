-- Create product_variants table for colors, sizes with different prices/stocks
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variant_type TEXT NOT NULL DEFAULT 'color',
  price_adjustment INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Product variants policies
CREATE POLICY "Product variants are publicly readable" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Staff can insert product variants" ON public.product_variants FOR INSERT WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff can update product variants" ON public.product_variants FOR UPDATE USING (is_staff(auth.uid()));
CREATE POLICY "Admins can delete product variants" ON public.product_variants FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Promo codes policies
CREATE POLICY "Promo codes are publicly readable" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Staff can insert promo codes" ON public.promo_codes FOR INSERT WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff can update promo codes" ON public.promo_codes FOR UPDATE USING (is_staff(auth.uid()));
CREATE POLICY "Admins can delete promo codes" ON public.promo_codes FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add promo_code_id to orders
ALTER TABLE public.orders ADD COLUMN promo_code_id UUID REFERENCES public.promo_codes(id);
ALTER TABLE public.orders ADD COLUMN discount_amount INTEGER DEFAULT 0;

-- Create indexes
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_active ON public.promo_codes(is_active);