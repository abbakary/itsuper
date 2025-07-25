import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewckojvsymagyjwsfzwn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Y2tvanZzeW1hZ3lqd3NmenduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjcxNTYsImV4cCI6MjA2ODkwMzE1Nn0.G5uv3850aKSIX7c8a91wQBcOAkQ2K2s8qwbEy-5NN-U'

console.log('🔧 Initializing Supabase client with authentication...');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database type definitions
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'user' | 'admin'
          office_name: string
          department: string
          avatar_url: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'user' | 'admin'
          office_name?: string
          department?: string
          avatar_url?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'user' | 'admin'
          office_name?: string
          department?: string
          avatar_url?: string | null
          phone?: string | null
          is_active?: boolean
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
          admin_notes: string | null
          resolution_notes: string | null
          resolved_at: string | null
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
          assigned_admin?: string
          user_id: string
          admin_notes?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
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
          admin_notes?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string
          sender_name: string
          sender_role: 'user' | 'admin'
          message: string
          is_internal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id: string
          sender_name: string
          sender_role: 'user' | 'admin'
          message: string
          is_internal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: 'user' | 'admin'
          message?: string
          is_internal?: boolean
          created_at?: string
        }
      }
    }
    Functions: {
      get_user_profile: {
        Args: { user_id?: string }
        Returns: {
          id: string
          email: string
          full_name: string
          role: string
          office_name: string
          department: string
          avatar_url: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
  }
}

// Test authentication and database connection
const testConnection = async () => {
  console.log('🔍 Testing Supabase connection and authentication...');
  
  try {
    // Test basic connectivity
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('📱 Current session:', session ? 'Active' : 'None', sessionError ? `Error: ${sessionError.message}` : '');
    
    // Test database access
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.warn('🔧 Tables not found. Please run the complete_schema.sql in Supabase SQL Editor.');
      }
    } else {
      console.log('✅ Database connection successful');
    }
    
  } catch (error: any) {
    console.error('❌ Connection test failed:', error.message);
  }
};

// Run connection test
testConnection();
