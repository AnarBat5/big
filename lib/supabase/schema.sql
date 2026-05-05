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
CREATE POLICY "Public read products" ON products
  FOR SELECT TO anon, authenticated USING (true);

-- Products: authenticated admin can manage
CREATE POLICY "Admin manage products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: anyone can insert (checkout)
CREATE POLICY "Anyone create order" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Orders: authenticated admin can read & update
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
CREATE POLICY "Anyone create message" ON messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated admin can read / manage messages
CREATE POLICY "Admin manage messages" ON messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);
