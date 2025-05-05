export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: number;
          title: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          icon?: string;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: number;
          name: string;
          testimonial: string;
          rating: number;
          avatar_url?: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          testimonial: string;
          rating: number;
          avatar_url?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          testimonial?: string;
          rating?: number;
          avatar_url?: string;
          created_at?: string;
        };
      };
      hero_content: {
        Row: {
          id: number;
          title: string;
          subtitle: string;
          image_url: string;
          cta_text: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          subtitle: string;
          image_url: string;
          cta_text: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          subtitle?: string;
          image_url?: string;
          cta_text?: string;
          created_at?: string;
        };
      };
      about: {
        Row: {
          id: number;
          title: string;
          content: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
          created_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: number;
          address: string;
          phone1: string;
          phone2: string;
          email: string;
          business_hours: string;
          saturday_hours: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          address: string;
          phone1: string;
          phone2: string;
          email: string;
          business_hours: string;
          saturday_hours: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          address?: string;
          phone1?: string;
          phone2?: string;
          email?: string;
          business_hours?: string;
          saturday_hours?: string;
          created_at?: string;
        };
      };
      stats: {
        Row: {
          id: number;
          title: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          value: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          value?: string;
          created_at?: string;
        };
      };
    };
  };
}