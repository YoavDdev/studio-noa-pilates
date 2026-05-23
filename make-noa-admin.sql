-- 👑 Make Noa Admin
-- הפיכת נועה למנהלת האתר

-- עדכון נועה ל-Admin
UPDATE profiles
SET 
  subscription_id = 'Admin',
  user_type = 'admin',
  updated_at = NOW()
WHERE email = 'studionoapilates.israel@gmail.com';

-- בדיקה שהעדכון עבד
SELECT 
  id,
  email,
  full_name,
  subscription_id,
  user_type,
  created_at
FROM profiles
WHERE email IN ('studionoapilates.israel@gmail.com', 'yoavddev@gmail.com')
ORDER BY email;
