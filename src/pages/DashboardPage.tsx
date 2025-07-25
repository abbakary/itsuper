import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { TicketList } from '../components/tickets/TicketList';
import { StatCards } from '../components/dashboard/StatCards';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ErrorNotification } from '../components/ui/ErrorNotification';
import { useTickets } from '../contexts/TicketContext';
import { useAuth } from '../contexts/AuthContext';
import { Ticket } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onTicketSelect: (ticketId: string) => void;
}

export function DashboardPage({ onNavigate, onTicketSelect }: DashboardPageProps) {
  const { tickets, error } = useTickets();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');
  const [showError, setShowError] = useState(true);

  const filteredTickets = tickets.filter((ticket: Ticket) => {
    if (user?.role === 'user' && ticket.userId !== user.id) {
      return false;
    }
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const handleTicketClick = (ticket: Ticket) => {
    onTicketSelect(ticket.id);
  };

  return (
    <MainLayout onNavigate={onNavigate}>
      <div className="space-y-6">
        <DashboardHeader onNavigate={onNavigate} />

        {/* Error Notification */}
        {error && showError && (
          <ErrorNotification
            message={error}
            onDismiss={() => setShowError(false)}
          />
        )}

        <StatCards tickets={tickets} userRole={user?.role} />
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All Tickets' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        <TicketList tickets={filteredTickets} onTicketClick={handleTicketClick} />
      </div>
    </MainLayout>
  );
}
