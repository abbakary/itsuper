import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { TicketDetail } from '../components/tickets/TicketDetail';
import { useTickets } from '../contexts/TicketContext';
import { ArrowLeft } from 'lucide-react';

interface TicketPageProps {
  ticketId: string | null;
  onNavigate: (page: string) => void;
}

export function TicketPage({ ticketId, onNavigate }: TicketPageProps) {
  const { tickets } = useTickets();
  
  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) {
    return (
      <MainLayout onNavigate={onNavigate}>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Ticket not found</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onNavigate={onNavigate}>
      <div className="mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
      <TicketDetail ticket={ticket} />
    </MainLayout>
  );
}