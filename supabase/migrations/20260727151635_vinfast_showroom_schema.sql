/*
# VinFast Showroom — Initial Schema

## Overview
Sets up the data layer for the VinFast EV Showroom app. Three tables:
quotes, chat_messages, and test_drive_bookings. No auth required
(public kiosk-style app), so all policies grant access to anon + authenticated.

## New Tables

### quotes
Stores AI-generated customer quotes awaiting staff review/approval.
- id: unique quote identifier
- customer_name, customer_email, customer_phone: contact info
- vehicle_id, vehicle_name: which car was quoted
- base_price, discount, final_price: pricing breakdown (in VND thousands)
- ai_summary: the AI advisor's recommendation text
- status: pending | approved | rejected
- notes: staff notes when approving/rejecting
- created_at, updated_at: timestamps

### chat_messages
Stores AI chat conversation history grouped by session.
- session_id: groups messages in a conversation
- role: 'user' or 'assistant'
- content: message text

### test_drive_bookings
Customer requests to schedule a test drive.
- customer_name, customer_phone: contact info
- vehicle_id, vehicle_name: car to test drive
- preferred_date, preferred_time: scheduling info
- status: pending | confirmed | cancelled

## Security
- RLS enabled on all tables
- All policies grant TO anon, authenticated (no-auth public app)
- USING (true) and WITH CHECK (true) for all — intentionally public shared data
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  vehicle_id text NOT NULL,
  vehicle_name text NOT NULL,
  base_price bigint NOT NULL,
  discount bigint NOT NULL DEFAULT 0,
  final_price bigint NOT NULL,
  ai_summary text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quotes" ON quotes;
CREATE POLICY "anon_select_quotes" ON quotes FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_quotes" ON quotes;
CREATE POLICY "anon_insert_quotes" ON quotes FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_quotes" ON quotes;
CREATE POLICY "anon_update_quotes" ON quotes FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_quotes" ON quotes;
CREATE POLICY "anon_delete_quotes" ON quotes FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes (status);
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes (created_at DESC);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat" ON chat_messages;
CREATE POLICY "anon_select_chat" ON chat_messages FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat" ON chat_messages;
CREATE POLICY "anon_insert_chat" ON chat_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat" ON chat_messages;
CREATE POLICY "anon_delete_chat" ON chat_messages FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, created_at);

CREATE TABLE IF NOT EXISTS test_drive_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  vehicle_id text NOT NULL,
  vehicle_name text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text DEFAULT '09:00',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE test_drive_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON test_drive_bookings;
CREATE POLICY "anon_select_bookings" ON test_drive_bookings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON test_drive_bookings;
CREATE POLICY "anon_insert_bookings" ON test_drive_bookings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON test_drive_bookings;
CREATE POLICY "anon_update_bookings" ON test_drive_bookings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS bookings_status_idx ON test_drive_bookings (status);
CREATE INDEX IF NOT EXISTS bookings_date_idx ON test_drive_bookings (preferred_date);
