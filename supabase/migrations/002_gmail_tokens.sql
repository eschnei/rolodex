-- =============================================
-- Gmail Integration Migration
-- Adds columns for Gmail OAuth tokens and digest tracking
-- =============================================

-- Add Gmail OAuth token columns to users table
ALTER TABLE users ADD COLUMN gmail_refresh_token TEXT;
ALTER TABLE users ADD COLUMN gmail_access_token TEXT;
ALTER TABLE users ADD COLUMN gmail_token_expiry TIMESTAMPTZ;

-- Add last digest sent timestamp for tracking
ALTER TABLE users ADD COLUMN last_digest_sent_at TIMESTAMPTZ;

-- Create index for finding users due for digest
CREATE INDEX idx_users_digest ON users(digest_enabled, digest_time, last_digest_sent_at)
WHERE digest_enabled = true;

-- Comment on new columns for documentation
COMMENT ON COLUMN users.gmail_refresh_token IS 'OAuth2 refresh token for Gmail API access';
COMMENT ON COLUMN users.gmail_access_token IS 'OAuth2 access token for Gmail API (may be expired)';
COMMENT ON COLUMN users.gmail_token_expiry IS 'Expiry timestamp for the Gmail access token';
COMMENT ON COLUMN users.last_digest_sent_at IS 'Timestamp of the last email digest sent to this user';
