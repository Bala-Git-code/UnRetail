-- ====================================================================
-- UNRETAIL MULTI-VENDOR THRIFT MARKETPLACE - DATABASE SCHEMA & RLS
-- PostgreSQL / Supabase Schema Definition
-- ====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('shopper', 'merchant', 'admin');
CREATE TYPE item_condition AS ENUM ('Mint', 'Excellent', 'Good', 'Fair');
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'shopper',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. SHOPS TABLE (Merchant Storefronts)
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    location TEXT DEFAULT 'Online Store',
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON public.shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_shops_owner ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_shops_slug ON public.shops(slug);

-- 5. ITEMS TABLE (Thrift & Vintage Inventory)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    condition item_condition NOT NULL DEFAULT 'Excellent',
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold')),
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_items_shop ON public.items(shop_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    tracking_number TEXT,
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop ON public.orders(shop_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------------------
-- Anyone can view profiles (to identify shop owners and reviews)
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- SHOPS POLICIES
-- --------------------------------------------------------------------
-- Anyone can read shops
CREATE POLICY "Shops are viewable by everyone" 
    ON public.shops FOR SELECT 
    USING (true);

-- Merchants can create a shop for themselves
CREATE POLICY "Merchants can create shop" 
    ON public.shops FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

-- Merchants can update their own shop
CREATE POLICY "Merchants can update own shop" 
    ON public.shops FOR UPDATE 
    USING (auth.uid() = owner_id);

-- --------------------------------------------------------------------
-- ITEMS POLICIES
-- --------------------------------------------------------------------
-- Public can read active items
CREATE POLICY "Active items are viewable by everyone" 
    ON public.items FOR SELECT 
    USING (status = 'active' OR EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = items.shop_id AND shops.owner_id = auth.uid()
    ));

-- Shop owners can insert items into their shop
CREATE POLICY "Shop owners can insert items" 
    ON public.items FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = items.shop_id AND shops.owner_id = auth.uid()
    ));

-- Shop owners can update items in their shop
CREATE POLICY "Shop owners can update own items" 
    ON public.items FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = items.shop_id AND shops.owner_id = auth.uid()
    ));

-- Shop owners can delete items in their shop
CREATE POLICY "Shop owners can delete own items" 
    ON public.items FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = items.shop_id AND shops.owner_id = auth.uid()
    ));

-- --------------------------------------------------------------------
-- ORDERS POLICIES
-- --------------------------------------------------------------------
-- Customers can view their own orders
CREATE POLICY "Customers can view own orders" 
    ON public.orders FOR SELECT 
    USING (auth.uid() = customer_id OR EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid()
    ));

-- Customers can create orders
CREATE POLICY "Customers can place orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (auth.uid() = customer_id);

-- Merchants can update order status for their shop orders
CREATE POLICY "Merchants can update shop orders" 
    ON public.orders FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.shops 
        WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid()
    ));

-- Automatic profile creation on Auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Thrift User'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'shopper')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
