import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Shield, Palette, Globe, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsDropdown() {
  const { userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settingsItems = [
    {
      icon: User,
      label: 'Profile Settings',
      description: 'Update your personal information',
      action: () => {
        alert(`Profile Settings\n\nName: ${userProfile?.full_name}\nEmail: ${userProfile?.email}\nRole: ${userProfile?.role}\nOffice: ${userProfile?.office_name}\nDepartment: ${userProfile?.department}\n\nProfile editing coming soon!`);
        setIsOpen(false);
      }
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage notification preferences',
      action: () => {
        alert('Notification Settings\n\n• Email notifications: ON\n• Push notifications: ON\n• Ticket updates: ON\n• System alerts: ON\n\nCustomization coming soon!');
        setIsOpen(false);
      }
    },
    {
      icon: Palette,
      label: 'Appearance',
      description: 'Customize theme and display',
      action: () => {
        alert('Appearance Settings\n\n• Theme: Light Mode\n• Language: English\n• Timezone: Auto-detect\n• Font size: Medium\n\nTheme customization coming soon!');
        setIsOpen(false);
      }
    },
    ...(userProfile?.role === 'admin' ? [{
      icon: Shield,
      label: 'Admin Settings',
      description: 'System administration',
      action: () => {
        alert('Admin Settings\n\n• User management\n• System configuration\n• Security settings\n• Backup & restore\n\nAdmin panel coming soon!');
        setIsOpen(false);
      }
    }] : []),
    {
      icon: Globe,
      label: 'Language & Region',
      description: 'Set your language and timezone',
      action: () => {
        alert('Language & Region\n\n• Language: English (US)\n• Country: United States\n• Timezone: Auto-detect\n• Date format: MM/DD/YYYY\n\nLocalization coming soon!');
        setIsOpen(false);
      }
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      action: () => {
        alert('Help & Support\n\n• User Guide\n• Video Tutorials\n• Contact Support\n• Submit Feedback\n• Report a Bug\n\nHelp center coming soon!');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            <p className="text-sm text-gray-500">Manage your account and preferences</p>
          </div>

          <div className="py-2">
            {settingsItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
                >
                  <div className="p-1 bg-gray-100 rounded-lg">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="text-xs text-gray-500 text-center">
              SuperDoll IT Support v1.0.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
