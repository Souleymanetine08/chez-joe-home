-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_phone TEXT,
    customer_name TEXT,
    items JSONB NOT NULL,
    total INTEGER NOT NULL,
    status public.order_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (CRITICAL: separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to check if user is admin or employee
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'employee')
    )
$$;

-- RLS Policies for categories (public read, admin/employee write)
CREATE POLICY "Categories are publicly readable"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Staff can insert categories"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update categories"
ON public.categories FOR UPDATE
TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products (public read, admin/employee write)
CREATE POLICY "Products are publicly readable"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Staff can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders (staff can read/write, public can insert via edge function)
CREATE POLICY "Staff can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.is_staff(auth.uid()));

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Staff can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images' 
    AND public.is_staff(auth.uid())
);

CREATE POLICY "Staff can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images' 
    AND public.is_staff(auth.uid())
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images' 
    AND public.has_role(auth.uid(), 'admin')
);