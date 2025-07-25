import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket } from '../types';
import { supabase } from '../lib/supabase';

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      console.log('Loading tickets from Supabase...');
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (!data) {
        console.log('No data returned from Supabase');
        setTickets([]);
        return;
      }

      console.log('Raw tickets data:', data);

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

      console.log('Formatted tickets:', formattedTickets);
      setTickets(formattedTickets);
    } catch (error: any) {
      console.error('Error loading tickets:', {
        message: error?.message || 'Unknown error',
        error: error,
        stack: error?.stack
      });
      // For now, set empty array and continue
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category,
          specific_issue: ticketData.specificIssue,
          priority: ticketData.priority,
          status: ticketData.status,
          reporter_name: ticketData.reporterName,
          department: ticketData.department,
          assigned_admin: ticketData.assignedAdmin,
          user_id: ticketData.userId
        });

      if (error) throw error;

      await loadTickets(); // Reload tickets
    } catch (error) {
      console.error('Error creating ticket:', error);
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
    <TicketContext.Provider value={{ tickets, createTicket, updateTicket, deleteTicket, loading }}>
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
