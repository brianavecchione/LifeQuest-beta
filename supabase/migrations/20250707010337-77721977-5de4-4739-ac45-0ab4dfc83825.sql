-- Create enums for the new schemas
CREATE TYPE public.item_category AS ENUM ('Gear', 'Companion');
CREATE TYPE public.item_rarity AS ENUM ('Common', 'Rare', 'Epic', 'Legendary');
CREATE TYPE public.shop_category AS ENUM ('Personal', 'LifeQuest');
CREATE TYPE public.availability_status AS ENUM ('Available', 'SoldOut', 'Unavailable');
CREATE TYPE public.reward_type AS ENUM ('Personal', 'Company');
CREATE TYPE public.reward_status AS ENUM ('Locked', 'Unlocked', 'Redeemed');

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  item_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category public.item_category NOT NULL DEFAULT 'Gear',
  rarity public.item_rarity NOT NULL DEFAULT 'Common',
  effect_description TEXT,
  duration_days INTEGER,
  equipped BOOLEAN NOT NULL DEFAULT false,
  date_acquired TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_expiration TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gold_shop_items table
CREATE TABLE public.gold_shop_items (
  shop_item_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category public.shop_category NOT NULL DEFAULT 'Personal',
  gold_cost INTEGER NOT NULL DEFAULT 0,
  effect_description TEXT,
  duration_days INTEGER,
  is_limited_edition BOOLEAN NOT NULL DEFAULT false,
  availability_status public.availability_status NOT NULL DEFAULT 'Available',
  user_id UUID, -- Only set when item is unlocked for specific user
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards table
CREATE TABLE public.rewards (
  reward_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  reward_type public.reward_type NOT NULL DEFAULT 'Personal',
  gold_cost INTEGER NOT NULL DEFAULT 0,
  status public.reward_status NOT NULL DEFAULT 'Locked',
  date_unlocked TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_balances table
CREATE TABLE public.user_balances (
  user_id UUID NOT NULL PRIMARY KEY,
  current_gold_balance INTEGER NOT NULL DEFAULT 0,
  total_gold_earned INTEGER NOT NULL DEFAULT 0,
  total_gold_spent INTEGER NOT NULL DEFAULT 0,
  inventory_slots_used INTEGER NOT NULL DEFAULT 0,
  inventory_capacity INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inventory_items
CREATE POLICY "Users can view their own inventory items" 
ON public.inventory_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory items" 
ON public.inventory_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory items" 
ON public.inventory_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory items" 
ON public.inventory_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for gold_shop_items
CREATE POLICY "Everyone can view available shop items" 
ON public.gold_shop_items 
FOR SELECT 
USING (availability_status = 'Available' OR user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Only authenticated users can purchase items" 
ON public.gold_shop_items 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for rewards
CREATE POLICY "Users can view their own rewards" 
ON public.rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rewards" 
ON public.rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" 
ON public.rewards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rewards" 
ON public.rewards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_balances
CREATE POLICY "Users can view their own balance" 
ON public.user_balances 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own balance" 
ON public.user_balances 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance" 
ON public.user_balances 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_inventory_items_user_id ON public.inventory_items(user_id);
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_equipped ON public.inventory_items(user_id, equipped);
CREATE INDEX idx_gold_shop_items_category ON public.gold_shop_items(category);
CREATE INDEX idx_gold_shop_items_availability ON public.gold_shop_items(availability_status);
CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_rewards_status ON public.rewards(user_id, status);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gold_shop_items_updated_at
  BEFORE UPDATE ON public.gold_shop_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();