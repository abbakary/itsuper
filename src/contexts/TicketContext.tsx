import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket } from '../types';
import { supabase } from '../lib/supabase';
import { logSupabaseError, isMissingTableError } from '../utils/errorLogger';
import { ensureCurrentUserProfile } from '../utils/syncUsers';

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Demo tickets for fallback
const DEMO_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Computer Won\'t Start',
    description: 'My computer suddenly stopped working this morning. When I press the power button, nothing happens at all.',
    category: 'Hardware Issues',
    specificIssue: 'Computer not powering on',
    priority: 'high',
    status: 'open',
    userId: 'demo-user',
    reporterName: 'John Doe',
    department: 'Marketing & Sales',
    assignedAdmin: 'Kido Muhammed - Senior IT Tech',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Blue Screen Error',
    description: 'Getting frequent blue screen errors when trying to run multiple applications.',
    category: 'Software Issues',
    specificIssue: 'Blue Screen of Death (BSOD)',
    priority: 'medium',
    status: 'in-progress',
    userId: 'demo-user',
    reporterName: 'Jane Smith',
    department: 'Finance & Accounting',
    assignedAdmin: 'Billy M - Network Admin',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      console.log('🎫 Loading tickets from Supabase...');

      // Load tickets without join - we'll get user info separately if needed
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logSupabaseError('Loading tickets', error);

        // Check if it's a table not found error
        if (isMissingTableError(error)) {
          console.warn('🔧 Database tables not found. Please run the complete_schema.sql in Supabase SQL Editor.');
          setError('Database tables not found. Please run the complete_schema.sql in Supabase SQL Editor.');
          setTickets([]);
          return;
        }

        throw error;
      }

      if (!data || data.length === 0) {
        console.log('📭 No tickets found in database');
        setTickets([]);
        setError(undefined);
        return;
      }

      console.log(`📊 Found ${data.length} tickets in database`);

      const formattedTickets: Ticket[] = data.map(dbTicket => ({
        id: dbTicket.id,
        title: dbTicket.title,
        description: dbTicket.description,
        category: dbTicket.category,
        specificIssue: dbTicket.specific_issue,
        priority: dbTicket.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: dbTicket.status as 'open' | 'in-progress' | 'resolved' | 'closed',
        userId: dbTicket.user_id,
        reporterName: dbTicket.reporter_name,
        department: dbTicket.department,
        assignedAdmin: dbTicket.assigned_admin,
        createdAt: dbTicket.created_at,
        updatedAt: dbTicket.updated_at
      }));

      console.log('✅ Tickets loaded successfully');
      setTickets(formattedTickets);
      setError(undefined);
    } catch (error: any) {
      console.group('❌ Loading tickets failed:');
      console.error('Error message:', error?.message || 'Unknown error');
      console.error('Error code:', error?.code || 'No code');
      console.error('Error details:', error?.details || 'No details');
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.groupEnd();

      // Set error message for display
      const errorMessage = error?.message || 'Unknown database error';
      setError(`Database connection failed: ${errorMessage}. Please check your database connection.`);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🎫 Creating new ticket...');

      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User must be authenticated to create tickets');
      }

      const { error } = await supabase
        .from('tickets')
        .insert({
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category,
          specific_issue: ticketData.specificIssue,
          priority: ticketData.priority,
          status: ticketData.status || 'open',
          reporter_name: ticketData.reporterName,
          department: ticketData.department,
          assigned_admin: ticketData.assignedAdmin || 'Auto-assigned',
          user_id: user.id // Use authenticated user's ID
        });

      if (error) {
        logSupabaseError('Creating ticket', error);
        throw error;
      }

      console.log('✅ Ticket created successfully');
      await loadTickets(); // Reload tickets
    } catch (error: any) {
      logSupabaseError('Creating ticket (catch block)', error);
      throw error;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.assignedAdmin) updateData.assigned_admin = updates.assignedAdmin;
      if (updates.category) updateData.category = updates.category;
      if (updates.specificIssue) updateData.specific_issue = updates.specificIssue;

      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await loadTickets(); // Reload tickets
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadTickets(); // Reload tickets
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  };

  return (
    <TicketContext.Provider value={{ tickets, createTicket, updateTicket, deleteTicket, loading, error }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
