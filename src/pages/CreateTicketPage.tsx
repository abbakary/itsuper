import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { TicketForm } from '../components/tickets/TicketForm';
import { SimpleTicketForm } from '../components/tickets/SimpleTicketForm';
import { useAuth } from '../contexts/AuthContext';

interface CreateTicketPageProps {
  onNavigate: (page: string) => void;
}

export function CreateTicketPage({ onNavigate }: CreateTicketPageProps) {
  const handleSubmit = () => {
    onNavigate('dashboard');
  };

  return (
    <MainLayout onNavigate={onNavigate}>
      <TicketForm onSubmit={handleSubmit} />
    </MainLayout>
  );
}
