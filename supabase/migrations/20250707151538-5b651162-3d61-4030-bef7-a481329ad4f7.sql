-- Create trigger to handle quest XP/Gold rewards when status changes
CREATE TRIGGER on_quest_status_update
  AFTER UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_stat_update();