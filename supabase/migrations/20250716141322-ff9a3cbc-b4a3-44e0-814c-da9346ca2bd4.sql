-- Create trigger for badge unlock notifications
CREATE OR REPLACE TRIGGER trigger_badge_unlock_notification
    AFTER UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_badge_unlock_notification();

-- Create missing notification for existing unlockable achievement
INSERT INTO public.badge_notifications (user_id, achievement_id, is_read)
SELECT 
    a.user_id,
    a.id,
    false
FROM public.achievements a
WHERE a.is_unlockable = true 
    AND a.is_completed = false
    AND NOT EXISTS (
        SELECT 1 FROM public.badge_notifications bn 
        WHERE bn.achievement_id = a.id
    );