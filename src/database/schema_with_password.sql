-- SuperDoll IT Support System Database Schema - Updated with Password Support
-- Run this SQL in your Supabase SQL Editor

-- First, add password column to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- If you need to recreate the table completely, use this instead:
/*
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    office_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

-- Update existing users with default password (in production, use proper password hashing)
UPDATE users SET password_hash = '123456' WHERE password_hash IS NULL;

-- Insert your user with password
INSERT INTO users (email, name, role, office_name, department, password_hash) VALUES
('abbakaryamary@gmail.com', 'Amary Abbakary', 'admin', 'SuperDoll HQ', 'Information Technology', '123456')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    office_name = EXCLUDED.office_name,
    department = EXCLUDED.department,
    password_hash = EXCLUDED.password_hash;

-- Insert sample admin user with password
INSERT INTO users (email, name, role, office_name, department, password_hash) VALUES
('admin@superdoll.com', 'SuperDoll Admin', 'admin', 'SuperDoll HQ', 'Information Technology', 'admin123')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    office_name = EXCLUDED.office_name,
    department = EXCLUDED.department,
    password_hash = EXCLUDED.password_hash;

-- Insert sample regular user with password
INSERT INTO users (email, name, role, office_name, department, password_hash) VALUES
('user@superdoll.com', 'John Doe', 'user', 'SuperDoll Branch Office', 'Marketing & Sales', 'user123')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    office_name = EXCLUDED.office_name,
    department = EXCLUDED.department,
    password_hash = EXCLUDED.password_hash;

-- Insert sample IT staff with passwords
INSERT INTO users (email, name, role, office_name, department, password_hash) VALUES
('kido@superdoll.com', 'Kido Muhammed', 'admin', 'SuperDoll IT Center', 'Information Technology', 'password123'),
('billy@superdoll.com', 'Billy M', 'admin', 'SuperDoll Network Center', 'Information Technology', 'password123'),
('amali@superdoll.com', 'Amali A', 'admin', 'SuperDoll Hardware Lab', 'Information Technology', 'password123')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    office_name = EXCLUDED.office_name,
    department = EXCLUDED.department,
    password_hash = EXCLUDED.password_hash;

-- Create a function to validate passwords (simple version for demo)
CREATE OR REPLACE FUNCTION validate_user_password(user_email VARCHAR, user_password VARCHAR)
RETURNS TABLE(
    user_id UUID,
    email VARCHAR,
    name VARCHAR,
    role VARCHAR,
    office_name VARCHAR,
    department VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        u.office_name,
        u.department,
        u.created_at,
        u.updated_at
    FROM users u
    WHERE u.email = user_email 
    AND u.password_hash = user_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
