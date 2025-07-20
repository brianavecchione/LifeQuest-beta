-- Add avatar frame support to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_frame VARCHAR(100) DEFAULT 'none';

-- Create a comment to describe the avatar_frame column
COMMENT ON COLUMN public.profiles.avatar_frame IS 'Avatar frame style identifier (e.g., "gold", "silver", "dragon", "none")';

-- Create avatar frames table to store available frame options
CREATE TABLE IF NOT EXISTS public.avatar_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  rarity VARCHAR(50) DEFAULT 'common',
  unlock_requirements JSONB DEFAULT '{}',
  css_class VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on avatar frames table
ALTER TABLE public.avatar_frames ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read avatar frames (they're decorative, not sensitive)
CREATE POLICY "Avatar frames are viewable by everyone" 
ON public.avatar_frames 
FOR SELECT 
USING (is_active = true);

-- Insert default avatar frame options
INSERT INTO public.avatar_frames (name, display_name, description, rarity, css_class) VALUES
('none', 'No Frame', 'Clean and simple - no frame around your avatar', 'common', 'avatar-frame-none'),
('bronze', 'Bronze Frame', 'A classic bronze border for new adventurers', 'common', 'avatar-frame-bronze'),
('silver', 'Silver Frame', 'Elegant silver frame showing your growing experience', 'uncommon', 'avatar-frame-silver'),
('gold', 'Gold Frame', 'Prestigious gold frame for accomplished heroes', 'rare', 'avatar-frame-gold'),
('dragon', 'Dragon Frame', 'Mystical dragon-themed frame with ancient power', 'epic', 'avatar-frame-dragon'),
('crystal', 'Crystal Frame', 'Shimmering crystal frame that catches the light', 'epic', 'avatar-frame-crystal'),
('legendary', 'Legendary Frame', 'Ultimate frame reserved for true legends', 'legendary', 'avatar-frame-legendary')
ON CONFLICT (name) DO NOTHING;