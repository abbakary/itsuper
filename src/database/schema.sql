-- SuperDoll IT Support System Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
SET session_replication_role = replica;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    office_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(255) NOT NULL,
    specific_issue TEXT NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    assigned_admin VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for ticket communications
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('user', 'admin')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user
INSERT INTO users (email, name, role, office_name, department) VALUES
('admin@superdoll.com', 'SuperDoll Admin', 'admin', 'SuperDoll HQ', 'Information Technology')
ON CONFLICT (email) DO NOTHING;

-- Insert sample regular user
INSERT INTO users (email, name, role, office_name, department) VALUES
('user@superdoll.com', 'John Doe', 'user', 'SuperDoll Branch Office', 'Marketing & Sales')
ON CONFLICT (email) DO NOTHING;

-- Insert sample IT staff
INSERT INTO users (email, name, role, office_name, department) VALUES
('kido@superdoll.com', 'Kido Muhammed', 'admin', 'SuperDoll IT Center', 'Information Technology'),
('billy@superdoll.com', 'Billy M', 'admin', 'SuperDoll Network Center', 'Information Technology'),
('amali@superdoll.com', 'Amali A', 'admin', 'SuperDoll Hardware Lab', 'Information Technology')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can see their own records, admins can see all
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR 
                     (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

-- Users can update their own profile, admins can update any
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text OR 
                     (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

-- Anyone can create tickets
CREATE POLICY "Anyone can create tickets" ON tickets
    FOR INSERT WITH CHECK (true);

-- Users can see their own tickets, admins can see all tickets
CREATE POLICY "Users can view relevant tickets" ON tickets
    FOR SELECT USING (user_id::text = auth.uid()::text OR 
                     (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

-- Users can update their own tickets, admins can update any
CREATE POLICY "Users can update relevant tickets" ON tickets
    FOR UPDATE USING (user_id::text = auth.uid()::text OR 
                     (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin');

-- Anyone can create messages
CREATE POLICY "Anyone can create messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Users can see messages for their tickets, admins can see all messages
CREATE POLICY "Users can view relevant messages" ON messages
    FOR SELECT USING (
        ticket_id IN (
            SELECT id FROM tickets 
            WHERE user_id::text = auth.uid()::text
        ) OR 
        (SELECT role FROM users WHERE id::text = auth.uid()::text) = 'admin'
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON tickets(user_id);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON tickets(status);
CREATE INDEX IF NOT EXISTS tickets_priority_idx ON tickets(priority);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON tickets(created_at);
CREATE INDEX IF NOT EXISTS messages_ticket_id_idx ON messages(ticket_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

SET session_replication_role = DEFAULT;

-- Reset session
RESET session_replication_role;
