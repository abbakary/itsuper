-- SuperDoll IT Support System - Complete Database Schema
-- This schema integrates with Supabase's built-in authentication system
-- Run this SQL in your Supabase SQL Editor

-- First, drop existing tables if they exist (BE CAREFUL - this deletes all data)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can create tickets" ON tickets;
DROP POLICY IF EXISTS "Users can view relevant tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update relevant tickets" ON tickets;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
DROP POLICY IF EXISTS "Users can view relevant messages" ON messages;

-- Create user_profiles table (extends auth.users)
-- This table stores additional user information beyond what Supabase auth provides
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    office_name VARCHAR(255) NOT NULL DEFAULT 'SuperDoll Office',
    department VARCHAR(255) NOT NULL DEFAULT 'General',
    avatar_url TEXT,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(255) NOT NULL,
    specific_issue TEXT NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    assigned_admin VARCHAR(255) DEFAULT 'Auto-assigned',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    admin_notes TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for ticket communications
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('user', 'admin')),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- Internal notes only visible to admins
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, role, office_name, department)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        COALESCE(NEW.raw_user_meta_data->>'office_name', 'SuperDoll Office'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'General')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at 
    BEFORE UPDATE ON tickets
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile and admins can view all"
    ON user_profiles FOR SELECT
    USING (
        auth.uid() = id 
        OR 
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Users can update own profile and admins can update all"
    ON user_profiles FOR UPDATE
    USING (
        auth.uid() = id 
        OR 
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can insert user profiles"
    ON user_profiles FOR INSERT
    WITH CHECK (
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
        OR auth.uid() = id  -- Allow users to create their own profile
    );

-- Create RLS policies for tickets
CREATE POLICY "Anyone can create tickets"
    ON tickets FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their tickets, admins can view all"
    ON tickets FOR SELECT
    USING (
        user_id = auth.uid() 
        OR 
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Users can update their tickets, admins can update all"
    ON tickets FOR UPDATE
    USING (
        user_id = auth.uid() 
        OR 
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can delete tickets"
    ON tickets FOR DELETE
    USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Create RLS policies for messages
CREATE POLICY "Anyone can create messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view messages for their tickets, admins can view all"
    ON messages FOR SELECT
    USING (
        ticket_id IN (
            SELECT id FROM tickets 
            WHERE user_id = auth.uid()
        ) 
        OR 
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Create helpful views
CREATE OR REPLACE VIEW tickets_with_user_info AS
SELECT 
    t.*,
    up.full_name,
    up.email,
    up.office_name,
    up.role as user_role
FROM tickets t
LEFT JOIN user_profiles up ON t.user_id = up.id;

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_department ON user_profiles(department);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Insert sample admin user profile (this will be created when the auth user signs up)
-- We'll do this through the application instead of directly inserting

-- Function to get user profile with role check
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    full_name VARCHAR,
    role VARCHAR,
    office_name VARCHAR,
    department VARCHAR,
    avatar_url TEXT,
    phone VARCHAR,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.full_name,
        up.role,
        up.office_name,
        up.department,
        up.avatar_url,
        up.phone,
        up.is_active,
        up.created_at,
        up.updated_at
    FROM user_profiles up
    WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT ALL ON user_profiles TO anon, authenticated;
GRANT ALL ON tickets TO anon, authenticated;  
GRANT ALL ON messages TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Reset any session state
RESET session_replication_role;

-- Success message
SELECT 'SuperDoll IT Support Database Schema created successfully!' as status;
