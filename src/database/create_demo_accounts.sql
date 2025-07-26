-- Create Demo Accounts for SuperDoll IT Support System
-- Run this in your Supabase SQL Editor

-- Note: You need to create users in Supabase Auth Dashboard first, then run this to sync profiles

-- First, let's create the sync function if it doesn't exist
CREATE OR REPLACE FUNCTION sync_auth_users_to_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert any auth users that don't have profiles yet
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        office_name,
        department,
        is_active
    )
    SELECT 
        au.id,
        au.email,
        COALESCE(au.raw_user_meta_data->>'full_name', au.email, 'User'),
        COALESCE(au.raw_user_meta_data->>'role', 'user'),
        COALESCE(au.raw_user_meta_data->>'office_name', 'SuperDoll Office'),
        COALESCE(au.raw_user_meta_data->>'department', 'General'),
        true
    FROM auth.users au
    LEFT JOIN public.user_profiles up ON au.id = up.id
    WHERE up.id IS NULL  -- Only insert missing profiles
    AND au.email IS NOT NULL;
    
    RAISE NOTICE 'User profiles sync completed';
END;
$$;

-- Run the sync to fix missing profiles
SELECT sync_auth_users_to_profiles();

-- Show current users and their profiles
SELECT 
    'Current Users' as info,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM user_profiles) as total_profiles,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN user_profiles up ON au.id = up.id WHERE up.id IS NULL) as missing_profiles;

-- List all auth users
SELECT 
    au.email,
    au.created_at as auth_created,
    up.full_name,
    up.role,
    CASE WHEN up.id IS NULL THEN 'Missing Profile' ELSE 'Has Profile' END as profile_status
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC;
