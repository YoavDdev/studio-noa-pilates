-- בדיקת סטטוס Admin של yoavddev@gmail.com

-- 1. בדיקה אם המשתמש קיים בטבלת profiles
SELECT 
  id,
  email,
  full_name,
  subscription_id,
  user_type,
  is_admin,
  created_at,
  updated_at
FROM profiles
WHERE email = 'yoavddev@gmail.com';

-- 2. בדיקה של כל המשתמשים Admin
SELECT 
  id,
  email,
  full_name,
  subscription_id,
  user_type,
  is_admin
FROM profiles
WHERE is_admin = true OR user_type = 'admin'
ORDER BY email;
