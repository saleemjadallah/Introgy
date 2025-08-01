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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      category_defaults: {
        Row: {
          category: string
          created_at: string
          frequency: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          frequency: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          frequency?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      connection_suggestions: {
        Row: {
          created_at: string | null
          energy_level_required: number
          expected_response: Database["public"]["Enums"]["connection_expected_response"]
          id: string
          interaction_type: string
          priority: Database["public"]["Enums"]["connection_suggestion_priority"]
          reason_for_suggestion: string | null
          relationship_id: string | null
          relationship_name: string
          suggested: boolean
          suggested_date: string
          suggested_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level_required: number
          expected_response: Database["public"]["Enums"]["connection_expected_response"]
          id?: string
          interaction_type: string
          priority: Database["public"]["Enums"]["connection_suggestion_priority"]
          reason_for_suggestion?: string | null
          relationship_id?: string | null
          relationship_name: string
          suggested?: boolean
          suggested_date: string
          suggested_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level_required?: number
          expected_response?: Database["public"]["Enums"]["connection_expected_response"]
          id?: string
          interaction_type?: string
          priority?: Database["public"]["Enums"]["connection_suggestion_priority"]
          reason_for_suggestion?: string | null
          relationship_id?: string | null
          relationship_name?: string
          suggested?: boolean
          suggested_date?: string
          suggested_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_suggestions_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligent_conversation_starters: {
        Row: {
          confidence_score: number | null
          context: string | null
          created_at: string | null
          id: string
          relationship_id: string | null
          source: Database["public"]["Enums"]["conversation_source"]
          starter: string
          topic: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          context?: string | null
          created_at?: string | null
          id?: string
          relationship_id?: string | null
          source: Database["public"]["Enums"]["conversation_source"]
          starter: string
          topic: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          context?: string | null
          created_at?: string | null
          id?: string
          relationship_id?: string | null
          source?: Database["public"]["Enums"]["conversation_source"]
          starter?: string
          topic?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intelligent_conversation_starters_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      meaningful_interactions: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_favorite: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          category: string
          context: Database["public"]["Enums"]["message_context"]
          created_at: string | null
          energy_required: number
          id: string
          name: string
          personalizable: boolean
          template: string
          tone: Database["public"]["Enums"]["message_tone"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          context: Database["public"]["Enums"]["message_context"]
          created_at?: string | null
          energy_required: number
          id?: string
          name: string
          personalizable?: boolean
          template: string
          tone: Database["public"]["Enums"]["message_tone"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          context?: Database["public"]["Enums"]["message_context"]
          created_at?: string | null
          energy_required?: number
          id?: string
          name?: string
          personalizable?: boolean
          template?: string
          tone?: Database["public"]["Enums"]["message_tone"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      premium_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          plan_type: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan_type?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan_type?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          introvert_level: number | null
          phone: string | null
          preferences: Json | null
          provider: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          introvert_level?: number | null
          phone?: string | null
          preferences?: Json | null
          provider?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          introvert_level?: number | null
          phone?: string | null
          preferences?: Json | null
          provider?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      relationship_communication_prefs: {
        Row: {
          created_at: string
          frequency_preference: string | null
          id: string
          preferred_channel: Database["public"]["Enums"]["communication_channel"]
          relationship_id: string | null
          response_expectations: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          frequency_preference?: string | null
          id?: string
          preferred_channel: Database["public"]["Enums"]["communication_channel"]
          relationship_id?: string | null
          response_expectations?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          frequency_preference?: string | null
          id?: string
          preferred_channel?: Database["public"]["Enums"]["communication_channel"]
          relationship_id?: string | null
          response_expectations?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_communication_prefs_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_contact_info: {
        Row: {
          birthday: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          relationship_id: string | null
          updated_at: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          relationship_id?: string | null
          updated_at?: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          relationship_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_contact_info_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_contexts: {
        Row: {
          created_at: string
          how_we_met: string | null
          id: string
          known_since: string | null
          relationship_id: string | null
          updated_at: string
          value_to_me: string | null
        }
        Insert: {
          created_at?: string
          how_we_met?: string | null
          id?: string
          known_since?: string | null
          relationship_id?: string | null
          updated_at?: string
          value_to_me?: string | null
        }
        Update: {
          created_at?: string
          how_we_met?: string | null
          id?: string
          known_since?: string | null
          relationship_id?: string | null
          updated_at?: string
          value_to_me?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_contexts_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_frequencies: {
        Row: {
          category_default: boolean
          created_at: string
          custom_frequency: Json | null
          id: string
          is_overdue: boolean
          last_interaction: string | null
          next_scheduled: string | null
          overdue_days: number
          relationship_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_default?: boolean
          created_at?: string
          custom_frequency?: Json | null
          id?: string
          is_overdue?: boolean
          last_interaction?: string | null
          next_scheduled?: string | null
          overdue_days?: number
          relationship_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_default?: boolean
          created_at?: string
          custom_frequency?: Json | null
          id?: string
          is_overdue?: boolean
          last_interaction?: string | null
          next_scheduled?: string | null
          overdue_days?: number
          relationship_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relationship_health: {
        Row: {
          created_at: string | null
          frequency: number
          id: string
          last_assessment: string
          overall_score: number
          quality: number
          reciprocity: number
          relationship_id: string | null
          relationship_name: string
          trend: Database["public"]["Enums"]["relationship_trend"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency: number
          id?: string
          last_assessment: string
          overall_score: number
          quality: number
          reciprocity: number
          relationship_id?: string | null
          relationship_name: string
          trend: Database["public"]["Enums"]["relationship_trend"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency?: number
          id?: string
          last_assessment?: string
          overall_score?: number
          quality?: number
          reciprocity?: number
          relationship_id?: string | null
          relationship_name?: string
          trend?: Database["public"]["Enums"]["relationship_trend"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_health_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_health_suggestions: {
        Row: {
          created_at: string | null
          health_id: string | null
          id: string
          suggestion: string
        }
        Insert: {
          created_at?: string | null
          health_id?: string | null
          id?: string
          suggestion: string
        }
        Update: {
          created_at?: string | null
          health_id?: string | null
          id?: string
          suggestion?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_health_suggestions_health_id_fkey"
            columns: ["health_id"]
            isOneToOne: false
            referencedRelation: "relationship_health"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_insights: {
        Row: {
          created_at: string | null
          date_generated: string
          description: string
          id: string
          is_new: boolean
          recommendation: string
          relationship_id: string | null
          relationship_name: string
          severity: Database["public"]["Enums"]["insight_severity"]
          title: string
          type: Database["public"]["Enums"]["insight_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_generated: string
          description: string
          id?: string
          is_new?: boolean
          recommendation: string
          relationship_id?: string | null
          relationship_name: string
          severity: Database["public"]["Enums"]["insight_severity"]
          title: string
          type: Database["public"]["Enums"]["insight_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_generated?: string
          description?: string
          id?: string
          is_new?: boolean
          recommendation?: string
          relationship_id?: string | null
          relationship_name?: string
          severity?: Database["public"]["Enums"]["insight_severity"]
          title?: string
          type?: Database["public"]["Enums"]["insight_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_insights_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_interactions: {
        Row: {
          context: string | null
          created_at: string
          energy_cost: number | null
          follow_up_details: string | null
          follow_up_needed: boolean | null
          id: string
          interaction_date: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          notes: string | null
          quality: number | null
          relationship_id: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          energy_cost?: number | null
          follow_up_details?: string | null
          follow_up_needed?: boolean | null
          id?: string
          interaction_date: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          notes?: string | null
          quality?: number | null
          relationship_id?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          energy_cost?: number | null
          follow_up_details?: string | null
          follow_up_needed?: boolean | null
          id?: string
          interaction_date?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          notes?: string | null
          quality?: number | null
          relationship_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_interactions_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_interests: {
        Row: {
          created_at: string
          id: string
          interest: string
          relationship_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interest: string
          relationship_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interest?: string
          relationship_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_interests_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_memories: {
        Row: {
          created_at: string
          date: string | null
          id: string
          memory: string
          relationship_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: string
          memory: string
          relationship_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: string
          memory?: string
          relationship_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_memories_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_nurturing_status: {
        Row: {
          attention_reason: string | null
          created_at: string
          current_health_score: number | null
          id: string
          last_interaction: string | null
          needs_attention: boolean | null
          next_planned_interaction: string | null
          relationship_id: string | null
          target_frequency: number | null
          updated_at: string
        }
        Insert: {
          attention_reason?: string | null
          created_at?: string
          current_health_score?: number | null
          id?: string
          last_interaction?: string | null
          needs_attention?: boolean | null
          next_planned_interaction?: string | null
          relationship_id?: string | null
          target_frequency?: number | null
          updated_at?: string
        }
        Update: {
          attention_reason?: string | null
          created_at?: string
          current_health_score?: number | null
          id?: string
          last_interaction?: string | null
          needs_attention?: boolean | null
          next_planned_interaction?: string | null
          relationship_id?: string | null
          target_frequency?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_nurturing_status_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_social_profiles: {
        Row: {
          created_at: string
          handle: string
          id: string
          platform: string
          relationship_id: string | null
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          platform: string
          relationship_id?: string | null
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          platform?: string
          relationship_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_social_profiles_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_topics: {
        Row: {
          created_at: string
          id: string
          is_interest: boolean
          relationship_id: string | null
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_interest: boolean
          relationship_id?: string | null
          topic: string
        }
        Update: {
          created_at?: string
          id?: string
          is_interest?: boolean
          relationship_id?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_topics_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      relationships: {
        Row: {
          avatar: string | null
          category: Database["public"]["Enums"]["relationship_category"]
          created_at: string
          id: string
          importance_level: number | null
          name: string
          nickname: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          category: Database["public"]["Enums"]["relationship_category"]
          created_at?: string
          id?: string
          importance_level?: number | null
          name: string
          nickname?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          category?: Database["public"]["Enums"]["relationship_category"]
          created_at?: string
          id?: string
          importance_level?: number | null
          name?: string
          nickname?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduler_settings: {
        Row: {
          batch_similar: boolean
          created_at: string
          id: string
          max_daily_interactions: number
          preferred_days: number[]
          preferred_time_ranges: Json
          quiet_periods: Json
          reminder_style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          batch_similar?: boolean
          created_at?: string
          id?: string
          max_daily_interactions?: number
          preferred_days?: number[]
          preferred_time_ranges?: Json
          quiet_periods?: Json
          reminder_style?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          batch_similar?: boolean
          created_at?: string
          id?: string
          max_daily_interactions?: number
          preferred_days?: number[]
          preferred_time_ranges?: Json
          quiet_periods?: Json
          reminder_style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_strategies: {
        Row: {
          challenges: Json
          createdat: string
          description: string
          energylevel: string
          examplephrases: Json | null
          id: string
          isfavorite: boolean
          personalnote: string | null
          preptime: number
          rating: string | null
          scenariotype: string
          steps: Json
          tags: Json
          title: string
          type: string
          updatedat: string
          user_id: string
        }
        Insert: {
          challenges: Json
          createdat?: string
          description: string
          energylevel: string
          examplephrases?: Json | null
          id?: string
          isfavorite?: boolean
          personalnote?: string | null
          preptime: number
          rating?: string | null
          scenariotype: string
          steps: Json
          tags: Json
          title: string
          type: string
          updatedat?: string
          user_id: string
        }
        Update: {
          challenges?: Json
          createdat?: string
          description?: string
          energylevel?: string
          examplephrases?: Json | null
          id?: string
          isfavorite?: boolean
          personalnote?: string | null
          preptime?: number
          rating?: string | null
          scenariotype?: string
          steps?: Json
          tags?: Json
          title?: string
          type?: string
          updatedat?: string
          user_id?: string
        }
        Relationships: []
      }
      waiting_list: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upgrade_to_premium: {
        Args: { plan_type?: string }
        Returns: boolean
      }
    }
    Enums: {
      communication_channel:
        | "email"
        | "phone"
        | "text"
        | "video"
        | "in-person"
        | "social"
      connection_expected_response:
        | "fast"
        | "medium"
        | "slow"
        | "delayed"
        | "uncertain"
      connection_suggestion_priority: "1" | "2" | "3" | "4" | "5"
      conversation_source:
        | "interest"
        | "previous_conversation"
        | "past_conversation"
        | "life_event"
        | "current_event"
        | "shared_experience"
      insight_severity: "low" | "medium" | "high"
      insight_type:
        | "connection_gap"
        | "interaction_pattern"
        | "energy_impact"
        | "conversation_suggestion"
        | "relationship_health"
        | "other"
      interaction_type:
        | "call"
        | "message"
        | "in-person"
        | "video"
        | "email"
        | "social"
        | "other"
      message_context:
        | "check_in"
        | "life_event"
        | "follow_up"
        | "celebration"
        | "reconnect"
      message_tone: "casual" | "warm" | "professional"
      relationship_category:
        | "family"
        | "friend"
        | "professional"
        | "acquaintance"
      relationship_trend: "improving" | "declining" | "stable"
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
      communication_channel: [
        "email",
        "phone",
        "text",
        "video",
        "in-person",
        "social",
      ],
      connection_expected_response: [
        "fast",
        "medium",
        "slow",
        "delayed",
        "uncertain",
      ],
      connection_suggestion_priority: ["1", "2", "3", "4", "5"],
      conversation_source: [
        "interest",
        "previous_conversation",
        "past_conversation",
        "life_event",
        "current_event",
        "shared_experience",
      ],
      insight_severity: ["low", "medium", "high"],
      insight_type: [
        "connection_gap",
        "interaction_pattern",
        "energy_impact",
        "conversation_suggestion",
        "relationship_health",
        "other",
      ],
      interaction_type: [
        "call",
        "message",
        "in-person",
        "video",
        "email",
        "social",
        "other",
      ],
      message_context: [
        "check_in",
        "life_event",
        "follow_up",
        "celebration",
        "reconnect",
      ],
      message_tone: ["casual", "warm", "professional"],
      relationship_category: [
        "family",
        "friend",
        "professional",
        "acquaintance",
      ],
      relationship_trend: ["improving", "declining", "stable"],
    },
  },
} as const
