import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorNotificationProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorNotification({ message, onDismiss }: ErrorNotificationProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Database Connection Notice
          </h3>
          <div className="mt-1 text-sm text-yellow-700">
            <p>{message}</p>
            <p className="mt-2 text-xs">
              To enable full functionality, please run the SQL schema in your Supabase dashboard.
            </p>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
