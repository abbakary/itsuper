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

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('helpdesk_user');
    const storedUsers = localStorage.getItem('helpdesk_users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.isActive);
    
    if (foundUser && 
        ((email === 'admin@example.com' && password === 'admin123') ||
         (email === 'user@example.com' && password === 'user123'))) {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('helpdesk_user', JSON.stringify(updatedUser));
      
      // Update user's last login in users array
      const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('helpdesk_users', JSON.stringify(updatedUsers));
      
      return true;
    }
    
    return false;
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
