export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CommunicationPreference = 'email' | 'text' | 'phone' | 'in-person';
export type NoteType = 'manual' | 'transcript';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          digest_time: string;
          digest_enabled: boolean;
          skip_when_caught_up: boolean;
          timezone: string;
          gmail_refresh_token: string | null;
          gmail_access_token: string | null;
          gmail_token_expiry: string | null;
          last_digest_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          digest_time?: string;
          digest_enabled?: boolean;
          skip_when_caught_up?: boolean;
          timezone?: string;
          gmail_refresh_token?: string | null;
          gmail_access_token?: string | null;
          gmail_token_expiry?: string | null;
          last_digest_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          digest_time?: string;
          digest_enabled?: boolean;
          skip_when_caught_up?: boolean;
          timezone?: string;
          gmail_refresh_token?: string | null;
          gmail_access_token?: string | null;
          gmail_token_expiry?: string | null;
          last_digest_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          company: string | null;
          role: string | null;
          location: string | null;
          how_we_met: string | null;
          linkedin_url: string | null;
          name_phonetic: string | null;
          communication_preference: CommunicationPreference;
          personal_intel: string | null;
          cadence_days: number | null;
          last_contacted_at: string | null;
          ai_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          role?: string | null;
          location?: string | null;
          how_we_met?: string | null;
          linkedin_url?: string | null;
          name_phonetic?: string | null;
          communication_preference?: CommunicationPreference;
          personal_intel?: string | null;
          cadence_days?: number | null;
          last_contacted_at?: string | null;
          ai_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          role?: string | null;
          location?: string | null;
          how_we_met?: string | null;
          linkedin_url?: string | null;
          name_phonetic?: string | null;
          communication_preference?: CommunicationPreference;
          personal_intel?: string | null;
          cadence_days?: number | null;
          last_contacted_at?: string | null;
          ai_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          content: string;
          note_type: NoteType;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          content: string;
          note_type?: NoteType;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          user_id?: string;
          content?: string;
          note_type?: NoteType;
          created_at?: string;
        };
      };
      action_items: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          description: string;
          is_completed: boolean;
          source_note_id: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          description: string;
          is_completed?: boolean;
          source_note_id?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          contact_id?: string;
          user_id?: string;
          description?: string;
          is_completed?: boolean;
          source_note_id?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
    };
    Enums: {
      communication_preference: CommunicationPreference;
      note_type: NoteType;
    };
  };
}

// Convenience types for common usage
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export type Note = Database['public']['Tables']['notes']['Row'];
export type NoteInsert = Database['public']['Tables']['notes']['Insert'];
export type NoteUpdate = Database['public']['Tables']['notes']['Update'];

export type ActionItem = Database['public']['Tables']['action_items']['Row'];
export type ActionItemInsert = Database['public']['Tables']['action_items']['Insert'];
export type ActionItemUpdate = Database['public']['Tables']['action_items']['Update'];
