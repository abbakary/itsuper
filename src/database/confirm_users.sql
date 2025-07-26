-- Fix email confirmation issues for SuperDoll IT Support System
-- Run this in your Supabase SQL Editor to manually confirm users

-- Manually confirm all users (bypasses email confirmation requirement)
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Show users and their confirmation status
SELECT 
    email,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed' 
        ELSE 'Not Confirmed' 
    END as status,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- Alternative: Create specific demo users if they don't exist
-- Note: You should create these users in Supabase Auth Dashboard instead

-- Show final status
SELECT 
    'Email Confirmation Fix Complete' as message,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;
