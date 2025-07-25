import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => Promise<boolean>;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize but don't auto-login - let users login manually
    const initialize = async () => {
      try {
        // Just load users list, don't auto-login
        await loadUsers();
        console.log('🚀 SuperDoll IT Support System initialized');
        console.log('👋 Please login with your credentials');
      } catch (error: any) {
        console.error('Initialization error:', {
          message: error?.message || 'Unknown error',
          full_error: JSON.stringify(error, null, 2)
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error loading users:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          full_error: JSON.stringify(error, null, 2)
        });
        throw error;
      }

      const formattedUsers: User[] = data.map(dbUser => ({
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as 'user' | 'admin',
        createdAt: dbUser.created_at,
        lastLogin: dbUser.updated_at,
        isActive: true,
        officeName: dbUser.office_name,
        department: dbUser.department
      }));

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error loading users:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        stack: error?.stack,
        full_error: JSON.stringify(error, null, 2)
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);

      // Look up user in Supabase database
      const { data: foundUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('User lookup error:', {
          message: error.message,
          code: error.code,
          details: error.details
        });

        if (error.details?.includes('Results contain 0 rows')) {
          console.log('User not found in database:', email);
          return false;
        }

        // Database connection or other errors
        throw new Error(`Database error: ${error.message}`);
      }

      if (!foundUser) {
        console.log('No user found for email:', email);
        return false;
      }

      // For now, we'll use a simple password validation
      // In production, you should hash passwords and store them securely
      // This is a basic implementation for demo purposes
      const isValidPassword = password === '123456' || password === 'password123';

      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return false;
      }

      // Login successful - create user session
      const userObj: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role as 'user' | 'admin',
        createdAt: foundUser.created_at,
        lastLogin: new Date().toISOString(),
        isActive: true,
        officeName: foundUser.office_name,
        department: foundUser.department
      };

      console.log('Login successful for user:', userObj.name);
      setUser(userObj);

      // Update last login time in database
      await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', foundUser.id);

      return true;
    } catch (error: any) {
      console.error('Login error:', {
        message: error?.message || 'Unknown error',
        code: error?.code
      });
      return false;
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          office_name: userData.officeName || 'Default Office',
          department: userData.department || 'General'
        });

      if (error) throw error;

      await loadUsers(); // Reload users
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          role: updates.role,
          office_name: updates.officeName,
          department: updates.department
        })
        .eq('id', id);

      if (error) throw error;

      await loadUsers(); // Reload users
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadUsers(); // Reload users
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      users, 
      createUser, 
      updateUser, 
      deleteUser 
    }}>
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
