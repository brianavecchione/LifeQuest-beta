-- Create badge notifications table to track when users become eligible for new badges
CREATE TABLE public.badge_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_badge_notifications_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_badge_notifications_achievement FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_achievement_notification UNIQUE (user_id, achievement_id)
);

-- Enable RLS on badge_notifications table
ALTER TABLE public.badge_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for badge notifications
CREATE POLICY "Users can view their own badge notifications" 
ON public.badge_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own badge notifications" 
ON public.badge_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to create badge notifications when achievements become unlockable
CREATE OR REPLACE FUNCTION public.handle_badge_unlock_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Check if achievement just became unlockable (and wasn't before)
    IF NEW.is_unlockable = TRUE AND (OLD.is_unlockable IS NULL OR OLD.is_unlockable = FALSE) THEN
        -- Create notification for this badge unlock
        INSERT INTO public.badge_notifications (user_id, achievement_id, is_read)
        VALUES (NEW.user_id, NEW.id, FALSE)
        ON CONFLICT (user_id, achievement_id) 
        DO UPDATE SET 
            is_read = FALSE,
            updated_at = now();
            
        RAISE NOTICE 'Badge notification created for user % and achievement %', NEW.user_id, NEW.achievement_name;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to generate notifications when achievements become unlockable
CREATE TRIGGER trigger_badge_unlock_notification
    AFTER UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_badge_unlock_notification();

-- Create function to mark all badge notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_badge_notifications_read(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    UPDATE public.badge_notifications 
    SET is_read = TRUE, updated_at = now()
    WHERE user_id = p_user_id AND is_read = FALSE;
    
    RAISE NOTICE 'All badge notifications marked as read for user %', p_user_id;
END;
$$;

-- Create function to get unread badge notification count
CREATE OR REPLACE FUNCTION public.get_unread_badge_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unread_count
    FROM public.badge_notifications
    WHERE user_id = p_user_id AND is_read = FALSE;
    
    RETURN unread_count;
END;
$$;

-- Create updated_at trigger for badge_notifications
CREATE TRIGGER update_badge_notifications_updated_at
    BEFORE UPDATE ON public.badge_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();