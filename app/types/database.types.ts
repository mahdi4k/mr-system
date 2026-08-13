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
    };
    Enums: {
      ad_status: AdStatus;
      article_status: ArticleStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
