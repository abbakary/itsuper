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
        const { data: adminUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', 'admin@superdoll.com')
          .single();

        if (adminUser) {
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
      } catch (error) {
        console.error('Auto-login error:', error);
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

      if (error) throw error;

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
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: foundUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !foundUser) return false;

      // Simple password check - replace with proper auth in production
      const isValidPassword =
        (email === 'admin@superdoll.com' && password === 'admin123') ||
        (email === 'user@superdoll.com' && password === 'user123') ||
        (password === 'password123'); // Default password for other users

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

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>): Promise<boolean> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('helpdesk_users', JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('helpdesk_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('helpdesk_users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('helpdesk_user');
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
