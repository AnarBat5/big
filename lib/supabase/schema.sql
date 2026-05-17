-- ============================================================
-- Baganuur Investment Group — Supabase Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('buidan','sandal','shiree','or','shuugee')),
  category_name TEXT NOT NULL,
  price         INTEGER NOT NULL,
  images        TEXT[] NOT NULL DEFAULT '{}',
  description   TEXT DEFAULT '',
  material      TEXT DEFAULT '',
  dimensions    TEXT DEFAULT '',
  in_stock      INTEGER NOT NULL DEFAULT 0,
  featured      BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id                TEXT PRIMARY KEY,
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  district          TEXT NOT NULL,
  address           TEXT NOT NULL,
  note              TEXT DEFAULT '',
  payment_method    TEXT NOT NULL DEFAULT 'qpay',
  items             JSONB NOT NULL DEFAULT '[]',
  subtotal          INTEGER NOT NULL,
  shipping          INTEGER NOT NULL,
  total             INTEGER NOT NULL,
  status            TEXT NOT NULL DEFAULT 'Хүлээгдэж буй'
                    CHECK (status IN ('Хүлээгдэж буй','Төлбөр хийгдсэн','Хүргэгдэж буй','Дууссан','Цуцлагдсан')),
  qpay_invoice_id   TEXT,
  qpay_qr_text      TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Products: public can read
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products
  FOR SELECT TO anon, authenticated USING (true);

-- Products: authenticated admin can manage
DROP POLICY IF EXISTS "Admin manage products" ON products;
CREATE POLICY "Admin manage products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: anyone can insert (checkout)
DROP POLICY IF EXISTS "Anyone create order" ON orders;
CREATE POLICY "Anyone create order" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Orders: authenticated admin can read & update
DROP POLICY IF EXISTS "Admin manage orders" ON orders;
CREATE POLICY "Admin manage orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Index for fast order lookup
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

-- Contact messages table
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT DEFAULT '',
  message     TEXT NOT NULL,
  read        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
DROP POLICY IF EXISTS "Anyone create message" ON messages;
CREATE POLICY "Anyone create message" ON messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated admin can read / manage messages
DROP POLICY IF EXISTS "Admin manage messages" ON messages;
CREATE POLICY "Admin manage messages" ON messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);

-- ── decrement_stock RPC ─────────────────────────────────────────
-- Safely reduces product stock without going below 0
CREATE OR REPLACE FUNCTION decrement_stock(product_id TEXT, amount INTEGER)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE products
  SET in_stock = GREATEST(in_stock - amount, 0)
  WHERE id = product_id;
END;
$$;

-- ── Supabase Storage: products image bucket ────────────────────
-- Run in SQL Editor or via Supabase dashboard Storage tab
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated (admin) to upload/delete
DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'products');

-- Public read for product images
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'products');


-- =============================================================
-- USER ACCOUNTS (added in v2)
-- Run this on top of the original schema.
-- =============================================================

-- Link orders to a user (nullable so legacy guest orders still work)
alter table orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_id_idx on orders(user_id);

-- Profiles: 1:1 with auth.users, holds extra info (phone, name, prefs)
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text default '',
  phone           text default '',
  email_marketing boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles self read"   on profiles;
drop policy if exists "profiles self update" on profiles;
drop policy if exists "profiles self insert" on profiles;
create policy "profiles self read"   on profiles for select using (auth.uid() = id);
create policy "profiles self update" on profiles for update using (auth.uid() = id);
create policy "profiles self insert" on profiles for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Saved shipping addresses
create table if not exists addresses (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  label       text default '',
  recipient   text not null,
  phone       text not null,
  district    text not null,
  detail      text not null,
  is_default  boolean default false,
  created_at  timestamptz default now()
);
create index if not exists addresses_user_idx on addresses(user_id);

alter table addresses enable row level security;
drop policy if exists "addresses self all" on addresses;
create policy "addresses self all" on addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Wishlist items
create table if not exists wishlist_items (
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  text not null references products(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (user_id, product_id)
);
create index if not exists wishlist_user_idx on wishlist_items(user_id);

alter table wishlist_items enable row level security;
drop policy if exists "wishlist self all" on wishlist_items;
create policy "wishlist self all" on wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
