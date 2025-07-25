import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewckojvsymagyjwsfzwn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3Y2tvanZzeW1hZ3lqd3NmenduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjcxNTYsImV4cCI6MjA2ODkwMzE1Nn0.G5uv3850aKSIX7c8a91wQBcOAkQ2K2s8qwbEy-5NN-U'

export const supabase = createClient(supabaseUrl, supabaseKey)

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
