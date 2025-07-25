import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket } from '../types';

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Load tickets from localStorage
    const storedTickets = localStorage.getItem('helpdesk_tickets');
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      // Initialize with demo tickets
      const demoTickets: Ticket[] = [
        {
          id: '1',
          title: 'Computer Won\'t Start',
          description: 'My computer suddenly stopped working this morning. When I press the power button, nothing happens at all.',
          category: 'Hardware Issues',
          specificIssue: 'Computer not powering on',
          priority: 'high',
          status: 'open',
          userId: '2',
          reporterName: 'John Doe',
          department: 'Marketing & Sales',
          assignedAdmin: 'John Smith (IT Manager)',
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
          userId: '2',
          reporterName: 'Jane Smith',
          department: 'Finance & Accounting',
          assignedAdmin: 'Sarah Johnson (Senior Tech)',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          adminNotes: 'Investigating memory issues. Running diagnostics.'
        }
      ];
      setTickets(demoTickets);
      localStorage.setItem('helpdesk_tickets', JSON.stringify(demoTickets));
    }
  }, []);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === id
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    );
    setTickets(updatedTickets);
    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
  };

  const deleteTicket = (id: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    setTickets(updatedTickets);
    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
  };

  return (
    <TicketContext.Provider value={{ tickets, createTicket, updateTicket, deleteTicket }}>
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