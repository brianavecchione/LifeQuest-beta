export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_name: string
          achievement_progress_current: number
          achievement_progress_goal: number
          claimed_at: string | null
          created_at: string
          description: string
          earned_at: string | null
          gold_reward: number
          id: string
          is_completed: boolean
          is_unlockable: boolean
          quest_value: Database["public"]["Enums"]["achievement_tier"]
          tags: string[] | null
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          achievement_name: string
          achievement_progress_current?: number
          achievement_progress_goal?: number
          claimed_at?: string | null
          created_at?: string
          description: string
          earned_at?: string | null
          gold_reward?: number
          id?: string
          is_completed?: boolean
          is_unlockable?: boolean
          quest_value?: Database["public"]["Enums"]["achievement_tier"]
          tags?: string[] | null
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          achievement_name?: string
          achievement_progress_current?: number
          achievement_progress_goal?: number
          claimed_at?: string | null
          created_at?: string
          description?: string
          earned_at?: string | null
          gold_reward?: number
          id?: string
          is_completed?: boolean
          is_unlockable?: boolean
          quest_value?: Database["public"]["Enums"]["achievement_tier"]
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      archived_quests: {
        Row: {
          archived_at: string
          completed_at: string
          completed_date: string
          created_at: string
          description: string | null
          gold_reward: number
          id: string
          original_quest_id: string
          priority: Database["public"]["Enums"]["quest_priority"]
          quest_name: string
          quest_type: Database["public"]["Enums"]["quest_type"]
          tags: string[] | null
          updated_at: string
          user_id: string
          was_in_focus: boolean
          xp_reward: number
        }
        Insert: {
          archived_at?: string
          completed_at: string
          completed_date: string
          created_at?: string
          description?: string | null
          gold_reward?: number
          id?: string
          original_quest_id: string
          priority: Database["public"]["Enums"]["quest_priority"]
          quest_name: string
          quest_type: Database["public"]["Enums"]["quest_type"]
          tags?: string[] | null
          updated_at?: string
          user_id: string
          was_in_focus?: boolean
          xp_reward?: number
        }
        Update: {
          archived_at?: string
          completed_at?: string
          completed_date?: string
          created_at?: string
          description?: string | null
          gold_reward?: number
          id?: string
          original_quest_id?: string
          priority?: Database["public"]["Enums"]["quest_priority"]
          quest_name?: string
          quest_type?: Database["public"]["Enums"]["quest_type"]
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          was_in_focus?: boolean
          xp_reward?: number
        }
        Relationships: []
      }
      daily_reset_logs: {
        Row: {
          created_at: string
          id: string
          quests_reset_count: number
          reset_date: string
          reset_timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          quests_reset_count?: number
          reset_date: string
          reset_timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quests_reset_count?: number
          reset_date?: string
          reset_timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      daily_xp_history: {
        Row: {
          created_at: string
          date: string
          id: string
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      gold_shop_items: {
        Row: {
          availability_status: Database["public"]["Enums"]["availability_status"]
          category: Database["public"]["Enums"]["shop_category"]
          created_at: string
          description: string | null
          duration_days: number | null
          effect_description: string | null
          gold_cost: number
          is_limited_edition: boolean
          name: string
          shop_item_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability_status?: Database["public"]["Enums"]["availability_status"]
          category?: Database["public"]["Enums"]["shop_category"]
          created_at?: string
          description?: string | null
          duration_days?: number | null
          effect_description?: string | null
          gold_cost?: number
          is_limited_edition?: boolean
          name: string
          shop_item_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability_status?: Database["public"]["Enums"]["availability_status"]
          category?: Database["public"]["Enums"]["shop_category"]
          created_at?: string
          description?: string | null
          duration_days?: number | null
          effect_description?: string | null
          gold_cost?: number
          is_limited_edition?: boolean
          name?: string
          shop_item_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: Database["public"]["Enums"]["item_category"]
          created_at: string
          date_acquired: string
          date_expiration: string | null
          description: string | null
          duration_days: number | null
          effect_description: string | null
          equipped: boolean
          item_id: string
          name: string
          rarity: Database["public"]["Enums"]["item_rarity"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["item_category"]
          created_at?: string
          date_acquired?: string
          date_expiration?: string | null
          description?: string | null
          duration_days?: number | null
          effect_description?: string | null
          equipped?: boolean
          item_id?: string
          name: string
          rarity?: Database["public"]["Enums"]["item_rarity"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["item_category"]
          created_at?: string
          date_acquired?: string
          date_expiration?: string | null
          description?: string | null
          duration_days?: number | null
          effect_description?: string | null
          equipped?: boolean
          item_id?: string
          name?: string
          rarity?: Database["public"]["Enums"]["item_rarity"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parties: {
        Row: {
          created_at: string
          party_description: string | null
          party_goal_xp: number
          party_id: string
          party_leader_id: string
          party_members: string[]
          party_name: string
          total_quests_completed: number
          total_xp: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          party_description?: string | null
          party_goal_xp?: number
          party_id?: string
          party_leader_id: string
          party_members?: string[]
          party_name: string
          total_quests_completed?: number
          total_xp?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          party_description?: string | null
          party_goal_xp?: number
          party_id?: string
          party_leader_id?: string
          party_members?: string[]
          party_name?: string
          total_quests_completed?: number
          total_xp?: number
          updated_at?: string
        }
        Relationships: []
      }
      party_chat: {
        Row: {
          message: string
          message_id: string
          party_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          message: string
          message_id?: string
          party_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          message?: string
          message_id?: string
          party_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_chat_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["party_id"]
          },
        ]
      }
      party_leaderboard: {
        Row: {
          created_at: string
          id: string
          party_id: string
          quests_completed: number
          time_range: Database["public"]["Enums"]["leaderboard_time_range"]
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          id?: string
          party_id: string
          quests_completed?: number
          time_range: Database["public"]["Enums"]["leaderboard_time_range"]
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          id?: string
          party_id?: string
          quests_completed?: number
          time_range?: Database["public"]["Enums"]["leaderboard_time_range"]
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "party_leaderboard_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["party_id"]
          },
        ]
      }
      party_members: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          level: number
          party_id: string
          role: Database["public"]["Enums"]["party_role"]
          updated_at: string
          user_id: string
          username: string
          xp: number
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          level?: number
          party_id: string
          role?: Database["public"]["Enums"]["party_role"]
          updated_at?: string
          user_id: string
          username: string
          xp?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          level?: number
          party_id?: string
          role?: Database["public"]["Enums"]["party_role"]
          updated_at?: string
          user_id?: string
          username?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "party_members_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["party_id"]
          },
        ]
      }
      party_quests: {
        Row: {
          assigned_by_user_id: string
          assigned_date: string
          completed_by: string[]
          created_at: string
          due_date: string | null
          party_id: string
          party_quest_id: string
          progress_denominator: number
          progress_numerator: number
          quest_description: string | null
          quest_name: string
          status: Database["public"]["Enums"]["party_quest_status"]
          updated_at: string
          xp_reward: number
        }
        Insert: {
          assigned_by_user_id: string
          assigned_date?: string
          completed_by?: string[]
          created_at?: string
          due_date?: string | null
          party_id: string
          party_quest_id?: string
          progress_denominator?: number
          progress_numerator?: number
          quest_description?: string | null
          quest_name: string
          status?: Database["public"]["Enums"]["party_quest_status"]
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          assigned_by_user_id?: string
          assigned_date?: string
          completed_by?: string[]
          created_at?: string
          due_date?: string | null
          party_id?: string
          party_quest_id?: string
          progress_denominator?: number
          progress_numerator?: number
          quest_description?: string | null
          quest_name?: string
          status?: Database["public"]["Enums"]["party_quest_status"]
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "party_quests_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["party_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          gold_balance: number
          id: string
          level_progress: number
          party_rank: string | null
          updated_at: string
          user_id: string
          user_level: number
          xp_balance: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          gold_balance?: number
          id?: string
          level_progress?: number
          party_rank?: string | null
          updated_at?: string
          user_id: string
          user_level?: number
          xp_balance?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          gold_balance?: number
          id?: string
          level_progress?: number
          party_rank?: string | null
          updated_at?: string
          user_id?: string
          user_level?: number
          xp_balance?: number
        }
        Relationships: []
      }
      quests: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          gold_reward: number
          id: string
          priority: Database["public"]["Enums"]["quest_priority"]
          quest_name: string
          quest_type: Database["public"]["Enums"]["quest_type"]
          status: string
          tags: string[] | null
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          gold_reward?: number
          id?: string
          priority?: Database["public"]["Enums"]["quest_priority"]
          quest_name: string
          quest_type?: Database["public"]["Enums"]["quest_type"]
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          gold_reward?: number
          id?: string
          priority?: Database["public"]["Enums"]["quest_priority"]
          quest_name?: string
          quest_type?: Database["public"]["Enums"]["quest_type"]
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          date_unlocked: string | null
          description: string | null
          gold_cost: number
          name: string
          reward_id: string
          reward_type: Database["public"]["Enums"]["reward_type"]
          status: Database["public"]["Enums"]["reward_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_unlocked?: string | null
          description?: string | null
          gold_cost?: number
          name: string
          reward_id?: string
          reward_type?: Database["public"]["Enums"]["reward_type"]
          status?: Database["public"]["Enums"]["reward_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_unlocked?: string | null
          description?: string | null
          gold_cost?: number
          name?: string
          reward_id?: string
          reward_type?: Database["public"]["Enums"]["reward_type"]
          status?: Database["public"]["Enums"]["reward_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      soundtracks: {
        Row: {
          artist: string
          created_at: string
          duration: string
          id: string
          is_active: boolean
          tags: string[]
          track_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist: string
          created_at?: string
          duration: string
          id?: string
          is_active?: boolean
          tags?: string[]
          track_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist?: string
          created_at?: string
          duration?: string
          id?: string
          is_active?: boolean
          tags?: string[]
          track_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          best_streak: number
          created_at: string
          current_streak: number
          description: string
          id: string
          last_activity_date: string | null
          status: Database["public"]["Enums"]["streak_status"]
          streak_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          created_at?: string
          current_streak?: number
          description: string
          id?: string
          last_activity_date?: string | null
          status?: Database["public"]["Enums"]["streak_status"]
          streak_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          created_at?: string
          current_streak?: number
          description?: string
          id?: string
          last_activity_date?: string | null
          status?: Database["public"]["Enums"]["streak_status"]
          streak_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          created_at: string
          current_gold_balance: number
          inventory_capacity: number
          inventory_slots_used: number
          total_gold_earned: number
          total_gold_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_gold_balance?: number
          inventory_capacity?: number
          inventory_slots_used?: number
          total_gold_earned?: number
          total_gold_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_gold_balance?: number
          inventory_capacity?: number
          inventory_slots_used?: number
          total_gold_earned?: number
          total_gold_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          active_theme: Database["public"]["Enums"]["theme_choice"]
          avatar_choice: Database["public"]["Enums"]["avatar_choice"]
          avatar_image_url: string | null
          bonus_xp_for_streaks_enabled: boolean
          character_name: string
          created_at: string
          daily_quest_reminders_enabled: boolean
          difficulty_multipliers_enabled: boolean
          id: string
          reduce_animations_enabled: boolean
          streak_warnings_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          active_theme?: Database["public"]["Enums"]["theme_choice"]
          avatar_choice?: Database["public"]["Enums"]["avatar_choice"]
          avatar_image_url?: string | null
          bonus_xp_for_streaks_enabled?: boolean
          character_name?: string
          created_at?: string
          daily_quest_reminders_enabled?: boolean
          difficulty_multipliers_enabled?: boolean
          id?: string
          reduce_animations_enabled?: boolean
          streak_warnings_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          active_theme?: Database["public"]["Enums"]["theme_choice"]
          avatar_choice?: Database["public"]["Enums"]["avatar_choice"]
          avatar_image_url?: string | null
          bonus_xp_for_streaks_enabled?: boolean
          character_name?: string
          created_at?: string
          daily_quest_reminders_enabled?: boolean
          difficulty_multipliers_enabled?: boolean
          id?: string
          reduce_animations_enabled?: boolean
          streak_warnings_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: number
      }
      calculate_level_progress: {
        Args: { total_xp: number; current_level: number }
        Returns: number
      }
      calculate_xp_for_level: {
        Args: { level_num: number }
        Returns: number
      }
      claim_achievement: {
        Args: { p_achievement_id: string; p_user_id: string }
        Returns: boolean
      }
      increment_streak: {
        Args: { p_user_id: string; p_streak_name: string }
        Returns: undefined
      }
      recalculate_badge_progress: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      reset_dummy_user_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      seed_basic_streaks: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      seed_comprehensive_badges: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      seed_dummy_account_only: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      seed_locked_achievements: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      seed_locked_rewards: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_daily_xp_history: {
        Args: { p_user_id: string; xp_gained: number }
        Returns: undefined
      }
      update_streak_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_stats: {
        Args: { p_user_id: string; xp_gained: number; gold_gained: number }
        Returns: undefined
      }
    }
    Enums: {
      achievement_tier: "Bronze" | "Silver" | "Gold" | "Legendary"
      availability_status: "Available" | "SoldOut" | "Unavailable"
      avatar_choice:
        | "noble_knight"
        | "wise_mage"
        | "shadow_rogue"
        | "custom"
        | "initials"
      item_category: "Gear" | "Companion"
      item_rarity: "Common" | "Rare" | "Epic" | "Legendary"
      leaderboard_time_range: "Week" | "Month"
      party_quest_status: "In Progress" | "Completed"
      party_role: "Leader" | "Co-Leader" | "Member"
      quest_priority: "Low" | "Medium" | "High"
      quest_type: "Daily" | "Main" | "Side" | "Legendary"
      reward_status: "Locked" | "Unlocked" | "Redeemed"
      reward_type: "Personal" | "Company"
      shop_category: "Personal" | "LifeQuest"
      streak_status: "Active" | "Inactive"
      theme_choice:
        | "dark_forest"
        | "fiery_dungeon"
        | "icy_mountains"
        | "mystical_void"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_tier: ["Bronze", "Silver", "Gold", "Legendary"],
      availability_status: ["Available", "SoldOut", "Unavailable"],
      avatar_choice: [
        "noble_knight",
        "wise_mage",
        "shadow_rogue",
        "custom",
        "initials",
      ],
      item_category: ["Gear", "Companion"],
      item_rarity: ["Common", "Rare", "Epic", "Legendary"],
      leaderboard_time_range: ["Week", "Month"],
      party_quest_status: ["In Progress", "Completed"],
      party_role: ["Leader", "Co-Leader", "Member"],
      quest_priority: ["Low", "Medium", "High"],
      quest_type: ["Daily", "Main", "Side", "Legendary"],
      reward_status: ["Locked", "Unlocked", "Redeemed"],
      reward_type: ["Personal", "Company"],
      shop_category: ["Personal", "LifeQuest"],
      streak_status: ["Active", "Inactive"],
      theme_choice: [
        "dark_forest",
        "fiery_dungeon",
        "icy_mountains",
        "mystical_void",
      ],
    },
  },
} as const
