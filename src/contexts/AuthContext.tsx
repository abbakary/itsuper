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
    // Initialize the app - load users list and set ready state
    const initialize = async () => {
      console.log('🚀 Initializing SuperDoll IT Support System...');
      try {
        await loadUsers();
        console.log('✅ Connected to Supabase database');
      } catch (error: any) {
        console.error('❌ Database connection failed:', error?.message || 'Unknown error');
      } finally {
        setLoading(false);
        console.log('👋 Ready for login');
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
        console.error('Error loading users from Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        throw error;
      }

      if (!data) {
        console.log('No users found in database');
        setUsers([]);
        return;
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

      console.log(`Loaded ${formattedUsers.length} users from database`);
      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Failed to load users:', error?.message || 'Unknown error');
      setUsers([]); // Set empty array on error
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);

      // Use the password validation function or direct query
      const { data: validationResult, error: validationError } = await supabase
        .rpc('validate_user_password', {
          user_email: email,
          user_password: password
        });

      if (validationError) {
        console.log('Validation function not available, using direct query');

        // Fallback to direct query if function doesn't exist
        const { data: foundUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password_hash', password)
          .single();

        if (error) {
          console.error('User lookup error:', {
            message: error.message,
            code: error.code,
            details: error.details
          });

          if (error.details?.includes('Results contain 0 rows')) {
            console.log('Invalid email or password');
            return false;
          }

          throw new Error(`Database error: ${error.message}`);
        }

        if (!foundUser) {
          console.log('Invalid email or password');
          return false;
        }

        // Login successful with direct query
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

        // Update last login time
        await supabase
          .from('users')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', foundUser.id);

        return true;
      }

      // Using validation function result
      if (!validationResult || validationResult.length === 0) {
        console.log('Invalid email or password');
        return false;
      }

      const foundUser = validationResult[0];

      // Login successful with validation function
      const userObj: User = {
        id: foundUser.user_id,
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

      // Update last login time
      await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', foundUser.user_id);

      return true;
    } catch (error: any) {
      console.error('Login error:', {
        message: error?.message || 'Unknown error',
        code: error?.code
      });
      return false;
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive'> & { password?: string }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          office_name: userData.officeName || 'Default Office',
          department: userData.department || 'General',
          password_hash: userData.password || '123456' // Default password
        });

      if (error) {
        console.error('Error creating user in database:', error);
        throw error;
      }

      console.log('User created successfully');
      await loadUsers(); // Reload users
      return true;
    } catch (error: any) {
      console.error('Error creating user:', {
        message: error?.message || 'Unknown error',
        code: error?.code,
        details: error?.details
      });
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
