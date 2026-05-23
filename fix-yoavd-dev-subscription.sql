-- תיקון subscription_id למשתמש yoavd.dev@gmail.com
UPDATE profiles
SET 
  subscription_id = 'Admin',
  is_admin = true,
  user_type = 'admin',
  updated_at = NOW()
WHERE email = 'yoavd.dev@gmail.com';

-- בדיקה
SELECT 
  id,
  email,
  full_name,
  subscription_id,
  is_admin,
  user_type
FROM profiles
WHERE email = 'yoavd.dev@gmail.com';
