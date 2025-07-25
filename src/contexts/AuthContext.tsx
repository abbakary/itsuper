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
    // Auto-login for demo purposes - replace with proper auth in production
    const autoLogin = async () => {
      try {
        const { data: adminUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', 'admin@superdoll.com')
          .single();

        if (error) {
          console.warn('Supabase users table not found, using demo user:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            full_error: JSON.stringify(error, null, 2)
          });
          // Use demo admin user if database is not set up
          setUser({
            id: 'demo-admin',
            email: 'admin@superdoll.com',
            name: 'SuperDoll Admin',
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true,
            officeName: 'SuperDoll HQ',
            department: 'Information Technology'
          });
        } else if (adminUser) {
          setUser({
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role as 'user' | 'admin',
            createdAt: adminUser.created_at,
            lastLogin: new Date().toISOString(),
            isActive: true,
            officeName: adminUser.office_name,
            department: adminUser.department
          });
        }
      } catch (error: any) {
        console.error('Auto-login error:', {
          message: error?.message || 'Unknown error',
          name: error?.name,
          stack: error?.stack,
          full_error: JSON.stringify(error, null, 2)
        });
        // Fallback to demo user
        setUser({
          id: 'demo-admin',
          email: 'admin@superdoll.com',
          name: 'SuperDoll Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          officeName: 'SuperDoll HQ',
          department: 'Information Technology'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
    autoLogin();
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

      const { data: foundUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.log('User lookup error:', error);

        // If user doesn't exist, create them automatically for demo purposes
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('Database tables not found, using demo mode');
          // Use demo user for missing database
          if (email === 'admin@superdoll.com' && password === 'admin123') {
            setUser({
              id: 'demo-admin',
              email: 'admin@superdoll.com',
              name: 'SuperDoll Admin',
              role: 'admin',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              isActive: true,
              officeName: 'SuperDoll HQ',
              department: 'Information Technology'
            });
            return true;
          }
          return false;
        }

        // User not found, create new user
        if (error.details?.includes('Results contain 0 rows') || error.code === 'PGRST116') {
          console.log('User not found, creating new user:', email);
          return await createAndLoginUser(email, password);
        }

        return false;
      }

      // User found, validate password
      const isValidPassword =
        (email === 'admin@superdoll.com' && password === 'admin123') ||
        (email === 'user@superdoll.com' && password === 'user123') ||
        (password === 'password123') || // Default password for other users
        (password === '123456'); // Common test password

      if (isValidPassword) {
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

        setUser(userObj);
        return true;
      }

      console.log('Invalid password for user:', email);
      return false;
    } catch (error: any) {
      console.error('Login error:', {
        message: error?.message || 'Unknown error',
        code: error?.code,
        full_error: JSON.stringify(error, null, 2)
      });
      return false;
    }
  };

  // Helper function to create and login new user
  const createAndLoginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      // Extract name from email
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      const newUserData = {
        email: email,
        name: name,
        role: 'user' as const,
        office_name: 'SuperDoll Branch Office',
        department: 'General'
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert(newUserData)
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw new Error(`Database error creating new user: ${createError.message}`);
      }

      if (createdUser) {
        console.log('User created successfully:', createdUser);

        // Log in the newly created user
        const userObj: User = {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          role: createdUser.role as 'user' | 'admin',
          createdAt: createdUser.created_at,
          lastLogin: new Date().toISOString(),
          isActive: true,
          officeName: createdUser.office_name,
          department: createdUser.department
        };

        setUser(userObj);
        await loadUsers(); // Refresh users list
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error in createAndLoginUser:', error);
      throw error;
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
