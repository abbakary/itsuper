import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewckojvsymagyjwsfzwn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Y2tvanZzeW1hZ3lqd3NmenduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjcxNTYsImV4cCI6MjA2ODkwMzE1Nn0.G5uv3850aKSIX7c8a91wQBcOAkQ2K2s8qwbEy-5NN-U'

// Debug logging
console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  keyPrefix: supabaseKey.substring(0, 20) + '...'
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Disable session persistence for now to avoid auth issues
  }
});

// Test connection
supabase.from('users').select('count').limit(1).then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      full_error: JSON.stringify(error, null, 2)
    });
  } else {
    console.log('Supabase connection test successful');
  }
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'admin'
          office_name: string
          department: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'user' | 'admin'
          office_name: string
          department: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'admin'
          office_name?: string
          department?: string
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: 'open' | 'in-progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          category: string
          specific_issue: string
          reporter_name: string
          department: string
          assigned_admin: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'open' | 'in-progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          category: string
          specific_issue: string
          reporter_name: string
          department: string
          assigned_admin: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'open' | 'in-progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          category?: string
          specific_issue?: string
          reporter_name?: string
          department?: string
          assigned_admin?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          ticket_id: string
          sender_name: string
          sender_role: 'user' | 'admin'
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_name: string
          sender_role: 'user' | 'admin'
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_name?: string
          sender_role?: 'user' | 'admin'
          message?: string
          created_at?: string
        }
      }
    }
  }
}
