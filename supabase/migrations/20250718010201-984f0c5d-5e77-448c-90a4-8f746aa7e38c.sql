-- Insert missing user balance record for the user
INSERT INTO public.user_balances (
    user_id, 
    current_gold_balance, 
    total_gold_earned, 
    total_gold_spent,
    inventory_capacity,
    inventory_slots_used
) VALUES (
    'e85290c2-1a57-4ff8-bb87-642307a5e627'::uuid,
    340,  -- Match the current gold balance from profiles
    340,  -- Assume all current gold was earned (we don't have history)
    0,    -- No gold spent yet
    50,   -- Default inventory capacity
    0     -- No inventory slots used yet
) ON CONFLICT (user_id) DO NOTHING;