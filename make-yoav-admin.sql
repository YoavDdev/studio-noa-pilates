-- 👑 Make Yoav Admin
-- הפיכת יואב למנהל האתר

-- עדכון יואב ל-Admin
UPDATE profiles
SET 
  is_admin = true,
  subscription_type = 'premium',
  user_type = 'admin',
  updated_at = NOW()
WHERE email = 'yoavddev@gmail.com';

-- בדיקה שהעדכון עבד
SELECT 
  id,
  email,
  full_name,
  is_admin,
  subscription_type,
  user_type,
  created_at,
  updated_at
FROM profiles
WHERE email = 'yoavddev@gmail.com';
