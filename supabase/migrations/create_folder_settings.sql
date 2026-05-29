-- folder_settings: Noa can edit subtitle per folder via admin
CREATE TABLE IF NOT EXISTS folder_settings (
  folder_name TEXT PRIMARY KEY,
  subtitle TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read (for videos page)
ALTER TABLE folder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read folder_settings"
  ON folder_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update folder_settings"
  ON folder_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.subscription_id = 'Admin' OR profiles.user_type = 'admin')
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_folder_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER folder_settings_updated_at
  BEFORE UPDATE ON folder_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_folder_settings_timestamp();
