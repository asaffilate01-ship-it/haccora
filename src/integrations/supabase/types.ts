export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          meta: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          meta?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          meta?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          created_at: string
          id: string
          kind: string
          message: string | null
          read_at: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          message?: string | null
          read_at?: string | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          message?: string | null
          read_at?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      checks: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          kind: string
          note: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          kind: string
          note?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          kind?: string
          note?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          expires_at: string | null
          file_url: string | null
          id: string
          title: string
          user_id: string
          version: string | null
        }
        Insert: {
          category: string
          created_at?: string
          expires_at?: string | null
          file_url?: string | null
          id?: string
          title: string
          user_id: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          expires_at?: string | null
          file_url?: string | null
          id?: string
          title?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      expiry_items: {
        Row: {
          batch: string | null
          created_at: string
          expires_on: string
          id: string
          location: string | null
          name: string
          note: string | null
          qty: number | null
          status: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          batch?: string | null
          created_at?: string
          expires_on: string
          id?: string
          location?: string | null
          name: string
          note?: string | null
          qty?: number | null
          status?: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          batch?: string | null
          created_at?: string
          expires_on?: string
          id?: string
          location?: string | null
          name?: string
          note?: string | null
          qty?: number | null
          status?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          closed_at: string | null
          created_at: string
          description: string | null
          id: string
          kind: string
          occurred_at: string
          root_cause: string | null
          severity: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind: string
          occurred_at?: string
          root_cause?: string | null
          severity?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          occurred_at?: string
          root_cause?: string | null
          severity?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          language: string
          location: string | null
          restaurant_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          language?: string
          location?: string | null
          restaurant_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string
          location?: string | null
          restaurant_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          category: string | null
          cert_expires_on: string | null
          contact: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          name: string
          note: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cert_expires_on?: string | null
          contact?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          name: string
          note?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cert_expires_on?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          name?: string
          note?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      temperature_logs: {
        Row: {
          created_at: string
          id: string
          location: string
          logged_at: string
          note: string | null
          reading: number
          status: string
          target_max: number | null
          target_min: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          logged_at?: string
          note?: string | null
          reading: number
          status?: string
          target_max?: number | null
          target_min?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          logged_at?: string
          note?: string | null
          reading?: number
          status?: string
          target_max?: number | null
          target_min?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waste_entries: {
        Row: {
          cost_eur: number | null
          created_at: string
          id: string
          item: string
          logged_at: string
          note: string | null
          qty: number
          reason: string
          unit: string
          user_id: string
        }
        Insert: {
          cost_eur?: number | null
          created_at?: string
          id?: string
          item: string
          logged_at?: string
          note?: string | null
          qty: number
          reason: string
          unit?: string
          user_id: string
        }
        Update: {
          cost_eur?: number | null
          created_at?: string
          id?: string
          item?: string
          logged_at?: string
          note?: string | null
          qty?: number
          reason?: string
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_inspector: { Args: { _user_id: string }; Returns: boolean }
      is_manager_or_owner: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "manager" | "chef" | "staff" | "inspector"
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
      app_role: ["owner", "manager", "chef", "staff", "inspector"],
    },
  },
} as const
