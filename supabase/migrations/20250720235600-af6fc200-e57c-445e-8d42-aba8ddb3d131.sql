-- Add has_seen_walkthrough field to user_settings table
ALTER TABLE user_settings 
ADD COLUMN has_seen_walkthrough boolean NOT NULL DEFAULT false;