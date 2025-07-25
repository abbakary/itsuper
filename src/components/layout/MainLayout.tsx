import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LogOut, 
  Settings, 
  Bell, 
  User,
  Shield,
  Computer,
  BarChart3,
  Users
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
}

export function MainLayout({ children, onNavigate }: MainLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-2 rounded-lg">
                <Computer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IT Help Desk</h1>
                <p className="text-xs text-gray-500">Technical Support System</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`p-2 rounded-lg ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {user?.role === 'admin' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-gray-500 capitalize">{user?.role} Account</p>
                </div>
              </div>

              {/* Settings */}
              {user?.role === 'admin' && onNavigate && (
                <>
                  <button 
                    onClick={() => onNavigate('analytics')}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Analytics"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onNavigate('user-management')}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="User Management"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                </>
              )}
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2025 IT Help Desk System. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Need help? Contact IT Support
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}