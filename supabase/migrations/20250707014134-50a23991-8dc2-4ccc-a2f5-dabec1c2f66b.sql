-- Create enums for user settings
CREATE TYPE public.avatar_choice AS ENUM ('noble_knight', 'wise_mage', 'shadow_rogue', 'custom', 'initials');
CREATE TYPE public.theme_choice AS ENUM ('dark_forest', 'fiery_dungeon', 'icy_mountains', 'mystical_void');

-- User Settings Table (combines profile, notifications, accessibility, XP rules, themes)
CREATE TABLE public.user_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    character_name TEXT NOT NULL DEFAULT 'Adventurer',
    avatar_image_url TEXT,
    avatar_choice public.avatar_choice NOT NULL DEFAULT 'initials',
    daily_quest_reminders_enabled BOOLEAN NOT NULL DEFAULT false,
    streak_warnings_enabled BOOLEAN NOT NULL DEFAULT false,
    reduce_animations_enabled BOOLEAN NOT NULL DEFAULT false,
    bonus_xp_for_streaks_enabled BOOLEAN NOT NULL DEFAULT false,
    difficulty_multipliers_enabled BOOLEAN NOT NULL DEFAULT false,
    active_theme public.theme_choice NOT NULL DEFAULT 'dark_forest',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Soundtracks Table
CREATE TABLE public.soundtracks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    track_name TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_soundtracks_user_id ON public.soundtracks(user_id);
CREATE INDEX idx_soundtracks_active ON public.soundtracks(user_id, is_active);
CREATE INDEX idx_soundtracks_tags ON public.soundtracks USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soundtracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
ON public.user_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for soundtracks
CREATE POLICY "Users can view their own soundtracks" 
ON public.soundtracks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own soundtracks" 
ON public.soundtracks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own soundtracks" 
ON public.soundtracks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own soundtracks" 
ON public.soundtracks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_soundtracks_updated_at
    BEFORE UPDATE ON public.soundtracks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create user settings when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, character_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create settings for new users
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- Insert seed data for dummy account only
DO $$
DECLARE
    dummy_user_id UUID := 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
BEGIN
    -- Insert dummy user settings with example data
    INSERT INTO public.user_settings (
        user_id,
        character_name,
        avatar_choice,
        daily_quest_reminders_enabled,
        streak_warnings_enabled,
        reduce_animations_enabled,
        bonus_xp_for_streaks_enabled,
        difficulty_multipliers_enabled,
        active_theme
    ) VALUES (
        dummy_user_id,
        'QuestMaster',
        'wise_mage',
        true,
        true,
        false,
        true,
        true,
        'mystical_void'
    ) ON CONFLICT (user_id) DO UPDATE SET
        character_name = EXCLUDED.character_name,
        avatar_choice = EXCLUDED.avatar_choice,
        daily_quest_reminders_enabled = EXCLUDED.daily_quest_reminders_enabled,
        streak_warnings_enabled = EXCLUDED.streak_warnings_enabled,
        reduce_animations_enabled = EXCLUDED.reduce_animations_enabled,
        bonus_xp_for_streaks_enabled = EXCLUDED.bonus_xp_for_streaks_enabled,
        difficulty_multipliers_enabled = EXCLUDED.difficulty_multipliers_enabled,
        active_theme = EXCLUDED.active_theme;
    
    -- Insert dummy soundtracks
    INSERT INTO public.soundtracks (user_id, track_name, artist, duration, tags, is_active) VALUES
    (dummy_user_id, 'Peaceful Day at Hogwarts', 'Harry Potter OST', '3:42', ARRAY['ambient', 'peaceful', 'fantasy'], true),
    (dummy_user_id, 'Studio Ghibli Music Collection', 'Joe Hisaishi', '45:30', ARRAY['orchestral', 'uplifting', 'magical'], false),
    (dummy_user_id, 'Medieval Fantasy Ambience', 'Adrian von Ziegler', '8:15', ARRAY['medieval', 'ambient', 'instrumental'], false),
    (dummy_user_id, 'Epic Adventure Theme', 'Two Steps From Hell', '4:20', ARRAY['epic', 'motivational', 'orchestral'], false),
    (dummy_user_id, 'Lofi Study Beats', 'ChilledCow', '2:30:00', ARRAY['lofi', 'study', 'relaxing'], false),
    (dummy_user_id, 'Celtic Quest Music', 'Celtic Woman', '6:45', ARRAY['celtic', 'folk', 'adventure'], false);
    
END $$;