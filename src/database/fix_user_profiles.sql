-- Fix for user profiles missing from user_profiles table
-- This will sync all auth.users to user_profiles table

-- First, let's create or update the manual sync function
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

-- Run the sync function to fix missing profiles
SELECT sync_auth_users_to_profiles();

-- Verify the sync worked
SELECT 
    'Profile Sync Results' as status,
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM user_profiles) as user_profiles_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM user_profiles) 
        THEN 'SUCCESS: All users have profiles'
        ELSE 'WARNING: Some users missing profiles'
    END as sync_status;

-- Show any auth users without profiles (should be empty after sync)
SELECT 
    au.id,
    au.email,
    'Missing profile' as issue
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;
