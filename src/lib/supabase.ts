import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://isjdpnugxkhhkhxdpdpc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzamRwbnVneGtoaGtoeGRwZHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTU5NTAsImV4cCI6MjA2ODgzMTk1MH0.itIdQDrDuxcJWXpyHuiDmoDGUVrwk3lzRvwzpzvMOkY'

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
  console.log('�� Testing Supabase connection and authentication...');

  try {
    // Test basic connectivity
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('📱 Current session:', session ? 'Active' : 'None');

    if (sessionError) {
      console.group('⚠️ Session Error:');
      console.error('Message:', sessionError.message);
      console.error('Details:', sessionError);
      console.groupEnd();
    }

    // Test database access
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);

    if (error) {
      console.group('❌ Database Connection Failed:');
      console.error('Message:', error.message || 'Unknown error');
      console.error('Code:', error.code || 'No code');
      console.error('Details:', error.details || 'No details');
      console.error('Hint:', error.hint || 'No hint');

      // Try to stringify the full error
      try {
        console.error('Full Error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      } catch {
        console.error('Raw Error Object:', error);
      }

      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.warn('🔧 SOLUTION: Tables not found. Run complete_schema.sql in Supabase SQL Editor.');
      } else if (error.message?.includes('JWT') || error.message?.includes('authorization')) {
        console.warn('🔑 SOLUTION: Authentication issue. Check your Supabase API key.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        console.warn('🌐 SOLUTION: Network issue. Check internet connection and Supabase URL.');
      }

      console.groupEnd();
    } else {
      console.log('✅ Database connection successful');
    }

  } catch (error: any) {
    console.group('❌ Connection Test Failed:');
    console.error('Message:', error?.message || 'Unknown error');
    console.error('Name:', error?.name || 'Unknown');
    console.error('Stack:', error?.stack || 'No stack trace');
    console.groupEnd();
  }
};

// Run connection test
testConnection();
