import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, BarChart3 } from 'lucide-react';

interface DashboardHeaderProps {
  onNavigate: (page: string) => void;
}

export function DashboardHeader({ onNavigate }: DashboardHeaderProps) {
  const { user, userProfile } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userProfile?.role === 'admin' ? 'Admin Dashboard' : 'My Tickets'}
            </h1>
            <p className="text-gray-600">
              {userProfile?.role === 'admin'
                ? 'Manage and resolve support tickets'
                : 'View and track your support requests'
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {userProfile?.role !== 'admin' && (
            <button
              onClick={() => onNavigate('create-ticket')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create New Ticket
            </button>
          )}
          {userProfile?.role === 'admin' && (
            <button
              onClick={() => onNavigate('create-ticket')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
