-- SuperDoll IT Support System - Fixed Database Schema
-- This schema fixes RLS circular dependencies
-- Run this SQL in your Supabase SQL Editor

-- First, drop existing tables if they exist (BE CAREFUL - this deletes all data)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile and admins can update all" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can insert user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can create tickets" ON tickets;
DROP POLICY IF EXISTS "Users can view their tickets, admins can view all" ON tickets;
DROP POLICY IF EXISTS "Users can update their tickets, admins can update all" ON tickets;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages for their tickets, admins can view all" ON messages;

-- Create user_profiles table (extends auth.users)
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
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, office_name, department)
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

-- Create simple RLS policies without circular dependencies

-- User Profiles: Allow all authenticated users to read and insert their own profiles
-- Use a simple approach to avoid circular dependencies
CREATE POLICY "Enable read access for authenticated users" 
    ON user_profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable insert for authenticated users" 
    ON user_profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile" 
    ON user_profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- Tickets: Allow authenticated users to create and view tickets
CREATE POLICY "Enable insert for authenticated users" 
    ON tickets FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for authenticated users" 
    ON tickets FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable update for authenticated users" 
    ON tickets FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Messages: Allow authenticated users to create and view messages
CREATE POLICY "Enable insert for authenticated users" 
    ON messages FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Enable read access for authenticated users" 
    ON messages FOR SELECT 
    TO authenticated 
    USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON user_profiles TO anon, authenticated;
GRANT ALL ON tickets TO anon, authenticated;  
GRANT ALL ON messages TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Success message
SELECT 'SuperDoll IT Support Database Schema created successfully!' as status;
