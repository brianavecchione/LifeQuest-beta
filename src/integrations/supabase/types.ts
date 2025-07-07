export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_name: string
          achievement_progress_current: number
          achievement_progress_goal: number
          created_at: string
          description: string
          earned_at: string | null
          gold_reward: number
          id: string
          is_completed: boolean
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
          created_at?: string
          description: string
          earned_at?: string | null
          gold_reward?: number
          id?: string
          is_completed?: boolean
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
          created_at?: string
          description?: string
          earned_at?: string | null
          gold_reward?: number
          id?: string
          is_completed?: boolean
          quest_value?: Database["public"]["Enums"]["achievement_tier"]
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
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
      increment_streak: {
        Args: { p_user_id: string; p_streak_name: string }
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
      quest_priority: "Low" | "Medium" | "High"
      quest_type: "Daily" | "Main" | "Side" | "Legendary"
      streak_status: "Active" | "Inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_tier: ["Bronze", "Silver", "Gold", "Legendary"],
      quest_priority: ["Low", "Medium", "High"],
      quest_type: ["Daily", "Main", "Side", "Legendary"],
      streak_status: ["Active", "Inactive"],
    },
  },
} as const
