-- 👑 Make yoavd.dev@gmail.com Admin
-- הפיכת yoavd.dev@gmail.com למנהל האתר

-- עדכון ל-Admin
UPDATE profiles
SET 
  is_admin = true,
  user_type = 'admin',
  updated_at = NOW()
WHERE email = 'yoavd.dev@gmail.com';

-- בדיקה שהעדכון עבד
SELECT 
  id,
  email,
  full_name,
  is_admin,
  user_type,
  created_at,
  updated_at
FROM profiles
WHERE email = 'yoavd.dev@gmail.com';
