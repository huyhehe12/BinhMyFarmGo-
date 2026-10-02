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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      locations: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["location_category"]
          contact: string | null
          created_at: string
          embed_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          maps_url: string
          name: string
          verified: boolean
        }
        Insert: {
          address?: string | null
          category: Database["public"]["Enums"]["location_category"]
          contact?: string | null
          created_at?: string
          embed_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          maps_url: string
          name: string
          verified?: boolean
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["location_category"]
          contact?: string | null
          created_at?: string
          embed_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          maps_url?: string
          name?: string
          verified?: boolean
        }
        Relationships: []
      }
      lookup_attempts: {
        Row: {
          created_at: string
          id: number
          ip: string
        }
        Insert: {
          created_at?: string
          id?: number
          ip: string
        }
        Update: {
          created_at?: string
          id?: number
          ip?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          channel: string
          created_at: string
          detail: string | null
          id: string
          request_id: string
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          detail?: string | null
          id?: string
          request_id: string
          status: string
        }
        Update: {
          channel?: string
          created_at?: string
          detail?: string | null
          id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          address: string | null
          code: string
          confirmed_total: number | null
          contact_method: string
          created_at: string
          customer_name: string
          customer_phone: string
          delivery_method: string
          desired_date: string | null
          id: string
          is_demo: boolean
          note: string | null
          payment_confirmed_at: string | null
          payment_confirmed_by: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          seller_note: string | null
          shipping_fee: number | null
          status: Database["public"]["Enums"]["request_status"]
          submission_key: string
          supplier_id: string
          time_slot: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          confirmed_total?: number | null
          contact_method: string
          created_at?: string
          customer_name: string
          customer_phone: string
          delivery_method: string
          desired_date?: string | null
          id?: string
          is_demo: boolean
          note?: string | null
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          seller_note?: string | null
          shipping_fee?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          submission_key: string
          supplier_id: string
          time_slot?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          confirmed_total?: number | null
          contact_method?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          delivery_method?: string
          desired_date?: string | null
          id?: string
          is_demo?: boolean
          note?: string | null
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          seller_note?: string | null
          shipping_fee?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          submission_key?: string
          supplier_id?: string
          time_slot?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requests_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      request_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          request_id: string
          status: Database["public"]["Enums"]["request_status"] | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          request_id: string
          status?: Database["public"]["Enums"]["request_status"] | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          request_id?: string
          status?: Database["public"]["Enums"]["request_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_items: {
        Row: {
          id: string
          product_name: string
          product_slug: string
          quantity: number
          reference_price: string | null
          request_id: string
          unit: string
        }
        Insert: {
          id?: string
          product_name: string
          product_slug: string
          quantity: number
          reference_price?: string | null
          request_id: string
          unit: string
        }
        Update: {
          id?: string
          product_name?: string
          product_slug?: string
          quantity?: number
          reference_price?: string | null
          request_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_members: {
        Row: {
          supplier_id: string
          user_id: string
        }
        Insert: {
          supplier_id: string
          user_id: string
        }
        Update: {
          supplier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_members_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          bank_account: string | null
          bank_bin: string | null
          bank_holder: string | null
          bank_name: string | null
          bank_verified: boolean
          contact_verified: boolean
          created_at: string
          id: string
          is_demo: boolean
          name: string
          phone: string | null
          zalo_user_id: string | null
        }
        Insert: {
          bank_account?: string | null
          bank_bin?: string | null
          bank_holder?: string | null
          bank_name?: string | null
          bank_verified?: boolean
          contact_verified?: boolean
          created_at?: string
          id: string
          is_demo?: boolean
          name: string
          phone?: string | null
          zalo_user_id?: string | null
        }
        Update: {
          bank_account?: string | null
          bank_bin?: string | null
          bank_holder?: string | null
          bank_name?: string | null
          bank_verified?: boolean
          contact_verified?: boolean
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          phone?: string | null
          zalo_user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_supplier_member: {
        Args: { _supplier_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "supplier"
      location_category:
        | "diem_ban"
        | "nha_vuon"
        | "trai_nghiem"
        | "diem_nhan_hang"
      payment_status: "chua_thanh_toan" | "cho_kiem_tra" | "da_thanh_toan"
      request_status: "cho_xac_nhan" | "da_xac_nhan" | "hoan_tat" | "da_huy"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "supplier"],
      location_category: [
        "diem_ban",
        "nha_vuon",
        "trai_nghiem",
        "diem_nhan_hang",
      ],
      payment_status: ["chua_thanh_toan", "cho_kiem_tra", "da_thanh_toan"],
      request_status: ["cho_xac_nhan", "da_xac_nhan", "hoan_tat", "da_huy"],
    },
  },
} as const
