export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string;
          role: "admin" | "viewer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email: string;
          role?: "admin" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string;
          role?: "admin" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          original_price: number;
          selling_price: number | null;
          is_out_of_stock: boolean;
          category_id: string;
          images: string[];
          featured: boolean;
          active: boolean;
          product_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          original_price: number;
          selling_price?: number | null;
          is_out_of_stock?: boolean;
          category_id: string;
          images?: string[];
          featured?: boolean;
          active?: boolean;
          product_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          original_price?: number;
          selling_price?: number | null;
          is_out_of_stock?: boolean;
          category_id?: string;
          images?: string[];
          featured?: boolean;
          active?: boolean;
          product_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      hero_banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          media_url: string;
          media_type: "image" | "video";
          mobile_media_url: string | null;
          mobile_media_type: "image" | "video" | null;
          button_text: string | null;
          button_link: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          media_url: string;
          media_type: "image" | "video";
          mobile_media_url?: string | null;
          mobile_media_type?: "image" | "video" | null;
          button_text?: string | null;
          button_link?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          media_url?: string;
          media_type?: "image" | "video";
          mobile_media_url?: string | null;
          mobile_media_type?: "image" | "video" | null;
          button_text?: string | null;
          button_link?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: boolean;
          shop_name: string;
          logo: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          instagram: string | null;
          facebook: string | null;
          address: string | null;
          announcement_enabled?: boolean | null;
          announcement_text?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          shop_name: string;
          logo?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          address?: string | null;
          announcement_enabled?: boolean | null;
          announcement_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          shop_name?: string;
          logo?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          address?: string | null;
          announcement_enabled?: boolean | null;
          announcement_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          location: string | null;
          rating: number;
          review_text: string;
          avatar_url: string | null;
          active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          location?: string | null;
          rating?: number;
          review_text: string;
          avatar_url?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          location?: string | null;
          rating?: number;
          review_text?: string;
          avatar_url?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface Testimonial {
  id: string;
  customer_name: string;
  location: string | null;
  rating: number;
  review_text: string;
  avatar_url: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
