-- 🔍 Step 1: Check if trigger exists
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- 🔍 Step 2: Check profiles table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 🔍 Step 3: Check if there's a NOT NULL constraint causing issues
SELECT column_name, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public' AND is_nullable = 'NO';
