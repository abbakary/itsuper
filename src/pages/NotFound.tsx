import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { AlertCircle } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

export function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <MainLayout onNavigate={onNavigate}>
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </MainLayout>
  );
}