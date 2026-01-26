-- =============================================
-- CMS: Site Settings & Sections Management
-- =============================================

-- Site global settings (key-value pairs)
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site sections for dynamic content management
CREATE TABLE public.site_sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content JSONB DEFAULT '{}',
    background_type TEXT DEFAULT 'color',
    background_value TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for site media
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Site settings are publicly readable"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Staff can update site settings"
ON public.site_settings FOR UPDATE USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert site settings"
ON public.site_settings FOR INSERT WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Admins can delete site settings"
ON public.site_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for site_sections
CREATE POLICY "Site sections are publicly readable"
ON public.site_sections FOR SELECT USING (true);

CREATE POLICY "Staff can update site sections"
ON public.site_sections FOR UPDATE USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert site sections"
ON public.site_sections FOR INSERT WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Admins can delete site sections"
ON public.site_sections FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for site-media bucket
CREATE POLICY "Site media is publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'site-media');

CREATE POLICY "Staff can upload site media"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media' AND is_staff(auth.uid()));

CREATE POLICY "Staff can update site media"
ON storage.objects FOR UPDATE USING (bucket_id = 'site-media' AND is_staff(auth.uid()));

CREATE POLICY "Admins can delete site media"
ON storage.objects FOR DELETE USING (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at
BEFORE UPDATE ON public.site_sections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sections
INSERT INTO public.site_sections (section_key, title, subtitle, content, background_type, is_visible, display_order)
VALUES 
    ('hero', 'Spécial Ramadan', 'Préparez votre table avec élégance', 
     '{"badge": "🌙 Ramadan Kareem", "cta_text": "Découvrir", "cta_link": "#catalog", "slides": []}', 
     'image', true, 1),
    ('catalog', 'Notre Catalogue', 'Découvrez nos produits sélectionnés avec soin', 
     '{"show_categories": true, "show_search": true}', 
     'color', true, 2),
    ('footer', 'Chez Joe', 'Votre destination pour une décoration élégante', 
     '{"phone": "+221 77 383 66 24", "email": "contact@chezjoe.sn", "address": "Dakar, Sénégal", "social_links": {}}', 
     'color', true, 99);

-- Insert default settings
INSERT INTO public.site_settings (key, value)
VALUES 
    ('store_info', '{"name": "Chez Joe", "phone": "221773836624", "whatsapp": "221773836624", "address": "Dakar, Sénégal", "free_delivery_threshold": 50000}'),
    ('delivery_options', '{"pickup": {"enabled": true, "label": "Retrait en boutique", "price": 0, "description": "Gratuit"}, "delivery": {"enabled": true, "label": "Livraison à domicile", "price": null, "description": "Frais de livraison à régler au livreur"}}'),
    ('promo_settings', '{"free_delivery_message": "Livraison Offerte", "ramadan_promo": true}');