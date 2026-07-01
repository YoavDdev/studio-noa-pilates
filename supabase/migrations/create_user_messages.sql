-- user_messages: הודעות מ-admin למשתמשים
CREATE TABLE IF NOT EXISTS user_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS user_messages_user_id_idx ON user_messages(user_id);
CREATE INDEX IF NOT EXISTS user_messages_is_read_idx ON user_messages(is_read);

-- RLS
ALTER TABLE user_messages ENABLE ROW LEVEL SECURITY;

-- Users can only read their own messages
CREATE POLICY "Users read own messages"
  ON user_messages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own messages
CREATE POLICY "Users update own messages"
  ON user_messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Only admins can insert messages
CREATE POLICY "Admins insert messages"
  ON user_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
