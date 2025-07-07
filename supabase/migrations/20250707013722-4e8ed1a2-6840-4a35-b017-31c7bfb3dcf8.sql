-- Create enums for party system
CREATE TYPE public.party_role AS ENUM ('Leader', 'Co-Leader', 'Member');
CREATE TYPE public.party_quest_status AS ENUM ('In Progress', 'Completed');
CREATE TYPE public.leaderboard_time_range AS ENUM ('Week', 'Month');

-- Party Info Table
CREATE TABLE public.parties (
    party_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    party_name TEXT NOT NULL,
    party_description TEXT,
    party_leader_id UUID NOT NULL,
    party_members UUID[] NOT NULL DEFAULT '{}',
    total_xp INTEGER NOT NULL DEFAULT 0,
    total_quests_completed INTEGER NOT NULL DEFAULT 0,
    party_goal_xp INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Party Members Table
CREATE TABLE public.party_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    party_id UUID NOT NULL REFERENCES public.parties(party_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    username TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    role public.party_role NOT NULL DEFAULT 'Member',
    is_active BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(party_id, user_id)
);

-- Party Quests Table
CREATE TABLE public.party_quests (
    party_quest_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    party_id UUID NOT NULL REFERENCES public.parties(party_id) ON DELETE CASCADE,
    quest_name TEXT NOT NULL,
    quest_description TEXT,
    assigned_by_user_id UUID NOT NULL,
    assigned_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    xp_reward INTEGER NOT NULL DEFAULT 0,
    progress_numerator INTEGER NOT NULL DEFAULT 0,
    progress_denominator INTEGER NOT NULL DEFAULT 1,
    completed_by UUID[] NOT NULL DEFAULT '{}',
    status public.party_quest_status NOT NULL DEFAULT 'In Progress',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Party Chat Table
CREATE TABLE public.party_chat (
    message_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    party_id UUID NOT NULL REFERENCES public.parties(party_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Party Leaderboard Table
CREATE TABLE public.party_leaderboard (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    party_id UUID NOT NULL REFERENCES public.parties(party_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    quests_completed INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    time_range public.leaderboard_time_range NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(party_id, user_id, time_range)
);

-- Create indexes for performance
CREATE INDEX idx_parties_leader_id ON public.parties(party_leader_id);
CREATE INDEX idx_party_members_party_id ON public.party_members(party_id);
CREATE INDEX idx_party_members_user_id ON public.party_members(user_id);
CREATE INDEX idx_party_members_active ON public.party_members(party_id, is_active);
CREATE INDEX idx_party_quests_party_id ON public.party_quests(party_id);
CREATE INDEX idx_party_quests_assigned_by ON public.party_quests(assigned_by_user_id);
CREATE INDEX idx_party_quests_status ON public.party_quests(party_id, status);
CREATE INDEX idx_party_chat_party_id ON public.party_chat(party_id);
CREATE INDEX idx_party_chat_timestamp ON public.party_chat(party_id, timestamp DESC);
CREATE INDEX idx_party_leaderboard_party_time ON public.party_leaderboard(party_id, time_range);
CREATE INDEX idx_party_leaderboard_xp ON public.party_leaderboard(party_id, time_range, xp_earned DESC);

-- Enable Row Level Security
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for parties
CREATE POLICY "Users can view parties they are members of" 
ON public.parties 
FOR SELECT 
USING (auth.uid() = ANY(party_members) OR auth.uid() = party_leader_id);

CREATE POLICY "Authenticated users can create parties" 
ON public.parties 
FOR INSERT 
WITH CHECK (auth.uid() = party_leader_id);

CREATE POLICY "Party leaders can update their parties" 
ON public.parties 
FOR UPDATE 
USING (auth.uid() = party_leader_id);

CREATE POLICY "Party leaders can delete their parties" 
ON public.parties 
FOR DELETE 
USING (auth.uid() = party_leader_id);

-- RLS Policies for party_members
CREATE POLICY "Users can view members of their parties" 
ON public.party_members 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_members.party_id 
        AND (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
    )
);

CREATE POLICY "Party leaders can manage members" 
ON public.party_members 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_members.party_id 
        AND auth.uid() = p.party_leader_id
    )
);

CREATE POLICY "Users can update their own member info" 
ON public.party_members 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for party_quests
CREATE POLICY "Party members can view party quests" 
ON public.party_quests 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_quests.party_id 
        AND (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
    )
);

CREATE POLICY "Party leaders can manage party quests" 
ON public.party_quests 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_quests.party_id 
        AND auth.uid() = p.party_leader_id
    )
);

CREATE POLICY "Party members can update quest progress" 
ON public.party_quests 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_quests.party_id 
        AND (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
    )
);

-- RLS Policies for party_chat
CREATE POLICY "Party members can view party chat" 
ON public.party_chat 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_chat.party_id 
        AND (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
    )
);

CREATE POLICY "Party members can send messages" 
ON public.party_chat 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_chat.party_id 
        AND (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
    )
);

-- RLS Policies for party_leaderboard
CREATE POLICY "Party members can view leaderboard" 
ON public.party_leaderboard 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.parties p 
        WHERE p.party_id = party_leaderboard.party_id 
        AND (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
    )
);

CREATE POLICY "System can update leaderboard" 
ON public.party_leaderboard 
FOR ALL 
USING (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_parties_updated_at
    BEFORE UPDATE ON public.parties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_party_members_updated_at
    BEFORE UPDATE ON public.party_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_party_quests_updated_at
    BEFORE UPDATE ON public.party_quests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_party_leaderboard_updated_at
    BEFORE UPDATE ON public.party_leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for dummy account only
DO $$
DECLARE
    dummy_user_id UUID := 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
    party_uuid UUID;
    member2_uuid UUID := '550e8f5e-29b5-4c8f-b9c4-19a0c8a5f2d1';
    member3_uuid UUID := '6a1f8d7c-3e9a-4b2d-8f5e-2c3a9b8f1e4d';
BEGIN
    -- Insert dummy party
    INSERT INTO public.parties (
        party_id,
        party_name,
        party_description,
        party_leader_id,
        party_members,
        total_xp,
        total_quests_completed,
        party_goal_xp
    ) VALUES (
        gen_random_uuid(),
        'The Productivity Guild',
        'Elite adventurers focused on maximum efficiency and legendary achievements',
        dummy_user_id,
        ARRAY[dummy_user_id, member2_uuid, member3_uuid],
        2450,
        47,
        5000
    ) RETURNING party_id INTO party_uuid;
    
    -- Insert party members
    INSERT INTO public.party_members (party_id, user_id, username, level, xp, role, is_active) VALUES
    (party_uuid, dummy_user_id, 'QuestMaster', 12, 1250, 'Leader', true),
    (party_uuid, member2_uuid, 'ShadowBlade', 10, 800, 'Co-Leader', true),
    (party_uuid, member3_uuid, 'MysticHealer', 8, 400, 'Member', true);
    
    -- Insert party quests (separate inserts to avoid multiple returns)
    INSERT INTO public.party_quests (
        party_id,
        quest_name,
        quest_description,
        assigned_by_user_id,
        xp_reward,
        progress_numerator,
        progress_denominator,
        status
    ) VALUES (
        party_uuid,
        'Weekly Productivity Challenge',
        'Complete 50 daily tasks as a team to unlock the Efficiency Badge',
        dummy_user_id,
        500,
        32,
        50,
        'In Progress'
    );
    
    INSERT INTO public.party_quests (
        party_id,
        quest_name,
        quest_description,
        assigned_by_user_id,
        xp_reward,
        progress_numerator,
        progress_denominator,
        status
    ) VALUES (
        party_uuid,
        'Legendary Skill Mastery',
        'Master 3 new skills collectively to advance party rank',
        dummy_user_id,
        1000,
        2,
        3,
        'In Progress'
    );
    
    -- Insert party chat messages
    INSERT INTO public.party_chat (party_id, user_id, message, timestamp) VALUES
    (party_uuid, dummy_user_id, 'Great progress on the productivity challenge everyone! 🎉', now() - interval '2 hours'),
    (party_uuid, member2_uuid, 'Thanks for the motivation! Just finished my daily coding tasks', now() - interval '1 hour'),
    (party_uuid, member3_uuid, 'Love the teamwork here. Let''s crush that skill mastery quest!', now() - interval '30 minutes'),
    (party_uuid, dummy_user_id, 'Agreed! Who''s working on what skill? Let''s coordinate', now() - interval '15 minutes');
    
    -- Insert party leaderboard data
    INSERT INTO public.party_leaderboard (party_id, user_id, quests_completed, xp_earned, time_range) VALUES
    (party_uuid, dummy_user_id, 12, 850, 'Week'),
    (party_uuid, member2_uuid, 8, 600, 'Week'),
    (party_uuid, member3_uuid, 6, 400, 'Week'),
    (party_uuid, dummy_user_id, 28, 2100, 'Month'),
    (party_uuid, member2_uuid, 22, 1650, 'Month'),
    (party_uuid, member3_uuid, 18, 1200, 'Month');
END $$;