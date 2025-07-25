import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { TicketProvider } from './contexts/TicketContext';
import { MessageProvider } from './contexts/MessageContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { TicketPage } from './pages/TicketPage';
import { NotFound } from './pages/NotFound';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage 
            onNavigate={setCurrentPage}
            onTicketSelect={(ticketId) => {
              setSelectedTicketId(ticketId);
              setCurrentPage('ticket');
            }}
          />
        );
      case 'create-ticket':
        return (
          <CreateTicketPage 
            onNavigate={setCurrentPage}
          />
        );
      case 'ticket':
        return (
          <TicketPage 
            ticketId={selectedTicketId}
            onNavigate={setCurrentPage}
          />
        );
      case 'analytics':
        return (
          <AnalyticsPage 
            onNavigate={setCurrentPage}
          />
        );
      case 'user-management':
        return (
          <UserManagementPage 
            onNavigate={setCurrentPage}
          />
        );
      default:
        return <NotFound onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <MessageProvider>
          <AppContent />
        </MessageProvider>
      </TicketProvider>
    </AuthProvider>
  );
}

export default App;