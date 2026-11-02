DO $$
DECLARE f text; fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY['public.recalculate_badge_progress(uuid)','public.recalculate_badge_eligibility(uuid)'] LOOP
    f := pg_get_functiondef(fn::regprocedure);
    f := replace(f, 'SELECT user_level, xp_balance, gold_balance INTO user_profile
    FROM public.profiles WHERE user_id = p_user_id;',
    'SELECT p.user_level, p.xp_balance, COALESCE(b.current_gold_balance,0) AS gold_balance INTO user_profile
    FROM public.profiles p LEFT JOIN public.user_balances b ON b.user_id = p.user_id WHERE p.user_id = p_user_id;');
    EXECUTE f;
  END LOOP;
END $$;