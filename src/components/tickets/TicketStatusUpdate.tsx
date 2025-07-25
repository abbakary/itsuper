import React, { useState } from 'react';
import { Ticket } from '../../types';
import { CheckCircle, Clock, Play, X, AlertCircle } from 'lucide-react';

interface TicketStatusUpdateProps {
  currentStatus: Ticket['status'];
  onStatusUpdate: (status: Ticket['status'], adminNotes?: string) => void;
  onCancel: () => void;
}

export function TicketStatusUpdate({ currentStatus, onStatusUpdate, onCancel }: TicketStatusUpdateProps) {
  const [status, setStatus] = useState<Ticket['status']>(currentStatus);
  const [adminNotes, setAdminNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusUpdate(status, adminNotes);
  };

  const statusOptions = [
    { 
      value: 'open' as const, 
      label: 'Open', 
      icon: AlertCircle,
      color: 'text-blue-600',
      description: 'Ticket is awaiting review'
    },
    { 
      value: 'in-progress' as const, 
      label: 'In Progress', 
      icon: Play,
      color: 'text-orange-600',
      description: 'Currently being worked on'
    },
    { 
      value: 'resolved' as const, 
      label: 'Resolved', 
      icon: CheckCircle,
      color: 'text-green-600',
      description: 'Issue has been fixed'
    },
    { 
      value: 'closed' as const, 
      label: 'Closed', 
      icon: X,
      color: 'text-gray-600',
      description: 'Ticket is completed'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mt-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600" />
        Update Ticket Status
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            New Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <label
                  key={option.value}
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    status === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value as Ticket['status'])}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 ${option.color}`} />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                  {status === option.value && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes (Optional)
          </label>
          <textarea
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add notes about the resolution, actions taken, or any follow-up needed..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Update Status
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}