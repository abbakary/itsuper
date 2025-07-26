-- Add missing foreign key relationship between tickets and user_profiles
-- Run this in your Supabase SQL Editor to enable joins

-- Add foreign key constraint to tickets table
ALTER TABLE tickets 
ADD CONSTRAINT fk_tickets_user_profiles 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Verify the constraint was added
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'tickets';

SELECT 'Foreign key relationship added successfully!' as status;
