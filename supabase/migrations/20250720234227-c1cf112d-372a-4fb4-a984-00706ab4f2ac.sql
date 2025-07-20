-- Direct gold refund for Custom Avatar Frame purchase
UPDATE user_balances 
SET 
  current_gold_balance = current_gold_balance + 250,
  total_gold_earned = total_gold_earned + 250,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627'
RETURNING current_gold_balance, total_gold_earned;