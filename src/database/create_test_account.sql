-- Create Test Account for SuperDoll IT Support System
-- This is a backup method if signup doesn't work

-- Note: This won't work directly in SQL because Supabase Auth requires API calls
-- Instead, use the signup form in the app or create users via Supabase Dashboard

-- To create accounts manually in Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Add these accounts:

/*
Admin Account:
- Email: admin@superdoll.com
- Password: password123
- Email confirmed: Yes
- Metadata: {"full_name": "SuperDoll Admin", "role": "admin"}

User Account:
- Email: user@superdoll.com  
- Password: password123
- Email confirmed: Yes
- Metadata: {"full_name": "Test User", "role": "user"}
*/

-- After creating users in Dashboard, run this to sync profiles:
INSERT INTO public.user_profiles (id, email, full_name, role, office_name, department, is_active)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(au.raw_user_meta_data->>'role', 'user'),
    'SuperDoll HQ',
    'General',
    true
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify accounts
SELECT 
    au.email,
    au.email_confirmed_at IS NOT NULL as confirmed,
    up.full_name,
    up.role
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC;
