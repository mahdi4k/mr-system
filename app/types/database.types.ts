export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdStatus =
  | "pending"
  | "published"
  | "sold"
  | "archived"
  | "rejected";

export interface Database {
  public: {
    Tables: {
      ad_categories: {
        Row: {
          icon: string;
          id: number;
          is_active: boolean;
          name: string;
          sort_order: number;
          value: string;
        };
        Insert: {
          icon: string;
          id: number;
          is_active?: boolean;
          name: string;
          sort_order?: number;
          value: string;
        };
        Update: {
          icon?: string;
          id?: number;
          is_active?: boolean;
          name?: string;
          sort_order?: number;
          value?: string;
        };
        Relationships: [];
      };
      ad_images: {
        Row: {
          ad_id: string;
          created_at: string;
          id: string;
          sort_order: number;
          storage_path: string;
          url: string;
        };
        Insert: {
          ad_id: string;
          created_at?: string;
          id?: string;
          sort_order?: number;
          storage_path: string;
          url: string;
        };
        Update: {
          ad_id?: string;
          created_at?: string;
          id?: string;
          sort_order?: number;
          storage_path?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ad_images_ad_id_fkey";
            columns: ["ad_id"];
            isOneToOne: false;
            referencedRelation: "ads";
            referencedColumns: ["id"];
          },
        ];
      };
      ads: {
        Row: {
          category_id: number;
          city_id: number;
          created_at: string;
          description: string;
          id: string;
          price: number | null;
          province_id: number;
          status: AdStatus;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category_id: number;
          city_id: number;
          created_at?: string;
          description: string;
          id?: string;
          price?: number | null;
          province_id: number;
          status?: AdStatus;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category_id?: number;
          city_id?: number;
          created_at?: string;
          description?: string;
          id?: string;
          price?: number | null;
          province_id?: number;
          status?: AdStatus;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ads_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "ad_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ads_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      ad_status: AdStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
