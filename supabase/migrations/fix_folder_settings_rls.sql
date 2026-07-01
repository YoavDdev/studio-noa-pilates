-- Fix RLS policy for folder_settings to use is_admin column
DROP POLICY IF EXISTS "Only admins can update folder_settings" ON folder_settings;

CREATE POLICY "Only admins can update folder_settings"
  ON folder_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Also fix Storage RLS for folder-images bucket
-- Run this to allow admins to upload to folder-images bucket:
INSERT INTO storage.buckets (id, name, public)
VALUES ('folder-images', 'folder-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policy: allow admin uploads
DROP POLICY IF EXISTS "Admins can upload folder images" ON storage.objects;
CREATE POLICY "Admins can upload folder images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'folder-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update folder images" ON storage.objects;
CREATE POLICY "Admins can update folder images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'folder-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Anyone can read folder images" ON storage.objects;
CREATE POLICY "Anyone can read folder images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'folder-images');
