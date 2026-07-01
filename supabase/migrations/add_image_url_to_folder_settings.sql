-- Add image_url column to folder_settings
ALTER TABLE folder_settings
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Create Supabase Storage bucket for folder images (run once)
-- Note: bucket creation must be done via Supabase dashboard or CLI
-- Storage > New bucket > "folder-images" > Public bucket = true
