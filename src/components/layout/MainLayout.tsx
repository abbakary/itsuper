import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MovingText } from '../ui/MovingText';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { SettingsDropdown } from '../ui/SettingsDropdown';
import {
  LogOut,
  Settings,
  Bell,
  User,
  Shield,
  Computer,
  BarChart3,
  Users,
  Star
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
}

export function MainLayout({ children, onNavigate }: MainLayoutProps) {
  const { user, userProfile, signOut } = useAuth();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        console.log('🚪 Logging out...');
        await signOut();
        console.log('✅ Logged out successfully');
        // Force navigation to login page
        window.location.href = '/';
      } catch (error) {
        console.error('❌ Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              title="Go to Dashboard"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-blue-500 p-2 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text text-transparent">SuperDoll</h1>
                <p className="text-xs text-gray-500">IT Support & Excellence</p>
              </div>
            </button>

            {/* User Info and Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Profile */}
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`p-2 rounded-lg ${
                  userProfile?.role === 'admin'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {userProfile?.role === 'admin' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{userProfile?.full_name || user?.email || 'User'}</p>
                  <p className="text-gray-500 capitalize">{userProfile?.role || 'user'} Account</p>
                </div>
              </div>

              {/* Settings */}
              {userProfile?.role === 'admin' && onNavigate && (
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
              
              <SettingsDropdown />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 hover:shadow-md"
                title="Sign out of your account"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Moving Vision Text */}
      <MovingText />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2025 SuperDoll IT Support System. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Trust - Excellence in Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
