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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_transactions: {
        Row: {
          amount_lkr: number
          description: string | null
          id: string
          laboratory_id: string | null
          pharmacy_id: string | null
          prescription_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_date: string | null
        }
        Insert: {
          amount_lkr?: number
          description?: string | null
          id?: string
          laboratory_id?: string | null
          pharmacy_id?: string | null
          prescription_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
        }
        Update: {
          amount_lkr?: number
          description?: string | null
          id?: string
          laboratory_id?: string | null
          pharmacy_id?: string | null
          prescription_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_transactions_laboratory_id_fkey"
            columns: ["laboratory_id"]
            isOneToOne: false
            referencedRelation: "laboratory_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_details"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_bookings: {
        Row: {
          address: string
          contact_phone: string
          created_at: string
          customer_name: string
          id: string
          laboratory_id: string
          preferred_date: string
          preferred_time: string
          service_type: string
          special_instructions: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          contact_phone: string
          created_at?: string
          customer_name: string
          id?: string
          laboratory_id: string
          preferred_date: string
          preferred_time: string
          service_type: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          contact_phone?: string
          created_at?: string
          customer_name?: string
          id?: string
          laboratory_id?: string
          preferred_date?: string
          preferred_time?: string
          service_type?: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_bookings_laboratory_id_fkey"
            columns: ["laboratory_id"]
            isOneToOne: false
            referencedRelation: "laboratory_details"
            referencedColumns: ["id"]
          },
        ]
      }
      laboratory_details: {
        Row: {
          address: string
          business_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          home_visit_available: boolean
          home_visit_charges: number | null
          id: string
          operating_hours: Json | null
          registration_number: string
          services_offered: string[] | null
          updated_at: string
          user_id: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address: string
          business_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          home_visit_available?: boolean
          home_visit_charges?: number | null
          id?: string
          operating_hours?: Json | null
          registration_number: string
          services_offered?: string[] | null
          updated_at?: string
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string
          business_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          home_visit_available?: boolean
          home_visit_charges?: number | null
          id?: string
          operating_hours?: Json | null
          registration_number?: string
          services_offered?: string[] | null
          updated_at?: string
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laboratory_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laboratory_details_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          id: string
          notes: string | null
          payment_details: Json | null
          payment_method: string
          pharmacy_id: string | null
          processed_at: string | null
          processed_by: string | null
          requested_amount: number
          requested_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method: string
          pharmacy_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requested_amount: number
          requested_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string
          pharmacy_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requested_amount?: number
          requested_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_details: {
        Row: {
          address: string
          business_name: string
          business_registration_url: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          operating_hours: Json | null
          pharmacist_certificate_url: string | null
          registration_number: string
          updated_at: string | null
          user_id: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address: string
          business_name: string
          business_registration_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          operating_hours?: Json | null
          pharmacist_certificate_url?: string | null
          registration_number: string
          updated_at?: string | null
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string
          business_name?: string
          business_registration_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          operating_hours?: Json | null
          pharmacist_certificate_url?: string | null
          registration_number?: string
          updated_at?: string | null
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacy_details_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_reviews: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          pharmacy_id: string | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          pharmacy_id?: string | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          pharmacy_id?: string | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacy_reviews_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_details"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          preferred_language:
            | Database["public"]["Enums"]["language_code"]
            | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["language_code"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["language_code"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      site_config: {
        Row: {
          config_key: string
          config_value: string | null
          description: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          config_key: string
          config_value?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_resource_type?: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      language_code: "en" | "si" | "ta"
      payment_status: "pending" | "processing" | "completed" | "failed"
      user_role:
        | "customer"
        | "pharmacy"
        | "admin"
        | "laboratory"
        | "developer_admin"
      user_status: "pending" | "verified" | "suspended" | "rejected"
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
      language_code: ["en", "si", "ta"],
      payment_status: ["pending", "processing", "completed", "failed"],
      user_role: [
        "customer",
        "pharmacy",
        "admin",
        "laboratory",
        "developer_admin",
      ],
      user_status: ["pending", "verified", "suspended", "rejected"],
    },
  },
} as const
