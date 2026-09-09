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

export type ArticleStatus = "draft" | "published" | "archived";

export type CatalogPartType =
  | "cpu"
  | "motherboard"
  | "graphic"
  | "power"
  | "ram"
  | "fan"
  | "ssd"
  | "case";

export type CatalogSyncStatus = "active" | "failed" | "retrying" | "never";

export type PriceSource = "automatic" | "manual";

export type MatchStatus = "pending" | "approved" | "rejected";

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
          telegram_notification_claimed_at: string | null;
          telegram_notified_at: string | null;
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
          telegram_notification_claimed_at?: string | null;
          telegram_notified_at?: string | null;
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
          telegram_notification_claimed_at?: string | null;
          telegram_notified_at?: string | null;
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
      conversations: {
        Row: {
          ad_id: string;
          buyer_id: string;
          created_at: string;
          id: string;
          seller_id: string;
          updated_at: string;
        };
        Insert: {
          ad_id: string;
          buyer_id: string;
          created_at?: string;
          id?: string;
          seller_id: string;
          updated_at?: string;
        };
        Update: {
          ad_id?: string;
          buyer_id?: string;
          created_at?: string;
          id?: string;
          seller_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_ad_id_fkey";
            columns: ["ad_id"];
            isOneToOne: false;
            referencedRelation: "ads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      articles: {
        Row: {
          author_id: string;
          category_name: string;
          category_slug: string;
          content: string;
          created_at: string;
          excerpt: string;
          featured_image_path: string | null;
          featured_image_url: string | null;
          id: string;
          published_at: string | null;
          slug: string;
          status: ArticleStatus;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          category_name: string;
          category_slug: string;
          content: string;
          created_at?: string;
          excerpt: string;
          featured_image_path?: string | null;
          featured_image_url?: string | null;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: ArticleStatus;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          category_name?: string;
          category_slug?: string;
          content?: string;
          created_at?: string;
          excerpt?: string;
          featured_image_path?: string | null;
          featured_image_url?: string | null;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: ArticleStatus;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: number;
          read_at: string | null;
          sender_id: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: never;
          read_at?: string | null;
          sender_id: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: never;
          read_at?: string | null;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
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
      catalog_audit_history: {
        Row: {
          action: string;
          changed_at: string;
          changed_by: string | null;
          id: number;
          part_type: CatalogPartType;
          price_after: number | null;
          price_before: number | null;
          product_id: number;
          title_after: string | null;
          title_before: string | null;
        };
        Insert: {
          action: string;
          changed_at?: string;
          changed_by?: string | null;
          id?: never;
          part_type: CatalogPartType;
          price_after?: number | null;
          price_before?: number | null;
          product_id: number;
          title_after?: string | null;
          title_before?: string | null;
        };
        Update: {
          action?: string;
          changed_at?: string;
          changed_by?: string | null;
          id?: never;
          part_type?: CatalogPartType;
          price_after?: number | null;
          price_before?: number | null;
          product_id?: number;
          title_after?: string | null;
          title_before?: string | null;
        };
        Relationships: [];
      };
      catalog_product_content: {
        Row: {
          claim_token: string | null;
          claimed_at: string | null;
          created_at: string;
          current_price: number | null;
          failure_count: number;
          fetched_at: string | null;
          image_url: string | null;
          last_error: string | null;
          last_success_at: string | null;
          lease_until: string | null;
          next_fetch_at: string | null;
          part_type: CatalogPartType;
          price_source: PriceSource;
          product_id: number;
          sync_status: CatalogSyncStatus;
          title: string;
          torob_product_id: string | null;
          updated_at: string;
        };
        Insert: {
          claim_token?: string | null;
          claimed_at?: string | null;
          created_at?: string;
          current_price?: number | null;
          failure_count?: number;
          fetched_at?: string | null;
          image_url?: string | null;
          last_error?: string | null;
          last_success_at?: string | null;
          lease_until?: string | null;
          next_fetch_at?: string | null;
          part_type: CatalogPartType;
          price_source?: PriceSource;
          product_id: number;
          sync_status?: CatalogSyncStatus;
          title: string;
          torob_product_id?: string | null;
          updated_at?: string;
        };
        Update: {
          claim_token?: string | null;
          claimed_at?: string | null;
          created_at?: string;
          current_price?: number | null;
          failure_count?: number;
          fetched_at?: string | null;
          image_url?: string | null;
          last_error?: string | null;
          last_success_at?: string | null;
          lease_until?: string | null;
          next_fetch_at?: string | null;
          part_type?: CatalogPartType;
          price_source?: PriceSource;
          product_id?: number;
          sync_status?: CatalogSyncStatus;
          title?: string;
          torob_product_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_product_exclusions: {
        Row: {
          deleted_at: string;
          deleted_by: string | null;
          part_type: CatalogPartType;
          product_id: number;
        };
        Insert: {
          deleted_at?: string;
          deleted_by?: string | null;
          part_type: CatalogPartType;
          product_id: number;
        };
        Update: {
          deleted_at?: string;
          deleted_by?: string | null;
          part_type?: CatalogPartType;
          product_id?: number;
        };
        Relationships: [];
      };
      price_history: {
        Row: {
          id: number;
          part_type: CatalogPartType;
          price: number;
          product_id: number;
          provider: string;
          recorded_at: string;
        };
        Insert: {
          id?: never;
          part_type: CatalogPartType;
          price: number;
          product_id: number;
          provider?: string;
          recorded_at?: string;
        };
        Update: {
          id?: never;
          part_type?: CatalogPartType;
          price?: number;
          product_id?: number;
          provider?: string;
          recorded_at?: string;
        };
        Relationships: [];
      };
      torob_match_candidates: {
        Row: {
          candidate_image_url: string | null;
          candidate_name: string;
          candidate_price: number | null;
          candidate_torob_product_id: string;
          created_at: string;
          id: string;
          part_type: CatalogPartType;
          product_id: number;
          rank: number;
          reviewed_at: string | null;
          reviewed_by: string | null;
          search_query: string;
          status: MatchStatus;
        };
        Insert: {
          candidate_image_url?: string | null;
          candidate_name: string;
          candidate_price?: number | null;
          candidate_torob_product_id: string;
          created_at?: string;
          id?: string;
          part_type: CatalogPartType;
          product_id: number;
          rank: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          search_query: string;
          status?: MatchStatus;
        };
        Update: {
          candidate_image_url?: string | null;
          candidate_name?: string;
          candidate_price?: number | null;
          candidate_torob_product_id?: string;
          created_at?: string;
          id?: string;
          part_type?: CatalogPartType;
          product_id?: number;
          rank?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          search_query?: string;
          status?: MatchStatus;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_or_create_conversation: {
        Args: { ad_uuid: string };
        Returns: string;
      };
      is_conversation_participant: {
        Args: { conversation_uuid: string };
        Returns: boolean;
      };
      mark_conversation_read: {
        Args: { conversation_uuid: string };
        Returns: undefined;
      };
      update_owned_ad: {
        Args: {
          p_ad_id: string;
          p_category_id: number;
          p_city_id: number;
          p_description: string;
          p_images: Json | null;
          p_price: number | null;
          p_province_id: number;
          p_title: string;
        };
        Returns: string[];
      };
    };
    Enums: {
      ad_status: AdStatus;
      article_status: ArticleStatus;
      catalog_part_type: CatalogPartType;
      catalog_sync_status: CatalogSyncStatus;
      match_status: MatchStatus;
      price_source: PriceSource;
    };
    CompositeTypes: Record<string, never>;
  };
}
