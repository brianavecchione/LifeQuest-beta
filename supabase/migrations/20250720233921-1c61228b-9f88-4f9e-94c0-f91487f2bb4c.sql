-- Refund 250 gold for accidental Custom Avatar Frame purchase
SELECT public.update_user_stats('e85290c2-1a57-4ff8-bb87-642307a5e627'::uuid, 0, 250);