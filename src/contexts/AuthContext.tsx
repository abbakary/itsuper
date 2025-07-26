import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  office_name: string;
  department: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    role?: 'user' | 'admin';
    office_name?: string;
    department?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create user profile if it doesn't exist
  const createUserProfile = async (user: User) => {
    try {
      console.log('🔧 Creating missing user profile for:', user.email);

      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || 'User',
        role: user.user_metadata?.role || 'user',
        office_name: user.user_metadata?.office_name || 'SuperDoll Office',
        department: user.user_metadata?.department || 'General',
        is_active: true
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create user profile:', error);
        return null;
      }

      console.log('✅ User profile created successfully');
      return data as UserProfile;
    } catch (error: any) {
      console.error('❌ Exception creating user profile:', error);
      return null;
    }
  };

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.group('❌ Error loading user profile:');
        console.error('Message:', error?.message || 'Unknown error');
        console.error('Code:', error?.code || 'No code');
        console.error('Details:', error?.details || 'No details');
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.groupEnd();

        // If profile not found (PGRST116), try to create it
        if (error.code === 'PGRST116') {
          console.warn('🔧 User profile not found, attempting to create it...');
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.id === userId) {
            const newProfile = await createUserProfile(user);
            if (newProfile) {
              return newProfile;
            }
          }
        }

        // If tables don't exist, create a basic profile from user data
        if (error.message?.includes('does not exist')) {
          console.warn('User profiles table not found, creating fallback profile');
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            return {
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email || 'User',
              role: user.user_metadata?.role || 'user',
              office_name: user.user_metadata?.office_name || 'SuperDoll Office',
              department: user.user_metadata?.department || 'General',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as UserProfile;
          }
        }

        return null;
      }

      return data as UserProfile;
    } catch (error: any) {
      console.group('❌ Exception in loadUserProfile:');
      console.error('Message:', error?.message || 'Unknown error');
      console.error('Name:', error?.name || 'Unknown');
      console.error('Stack:', error?.stack || 'No stack');
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.groupEnd();
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🔐 Initializing authentication...');

    // Add timeout to prevent infinite loading
    const loadTimeout = setTimeout(() => {
      console.warn('⏰ Auth loading timeout, setting loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(loadTimeout);

      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      } else {
        console.log('Initial session:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          loadUserProfile(session.user.id).then(profile => {
            setUserProfile(profile);
            setLoading(false);
          }).catch(() => {
            console.error('Failed to load user profile');
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    }).catch(() => {
      clearTimeout(loadTimeout);
      console.error('Failed to get session');
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await loadUserProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up new user
  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      full_name: string;
      role?: 'user' | 'admin';
      office_name?: string;
      department?: string;
    }
  ) => {
    try {
      console.log('🔐 Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role || 'user',
            office_name: userData.office_name || 'SuperDoll Office',
            department: userData.department || 'General'
          },
          emailRedirectTo: undefined // Disable email confirmation requirement
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ User signed up successfully');

        // Try to create profile immediately after signup
        const profile = await createUserProfile(data.user);
        if (profile) {
          console.log('✅ User profile created immediately after signup');
        } else {
          console.warn('⚠️ Profile creation failed, but signup succeeded. Profile will be created on next login.');
        }

        return { success: true };
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);

        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please check your email and click the confirmation link, or contact your administrator to activate your account.' };
        } else if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials.' };
        }

        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ User signed in successfully');
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      console.log('🔐 Signing out user...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('✅ User signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
      }

      // Reload profile
      const updatedProfile = await loadUserProfile(user.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook to check if user is admin
export function useIsAdmin() {
  const { userProfile } = useAuth();
  return userProfile?.role === 'admin';
}
