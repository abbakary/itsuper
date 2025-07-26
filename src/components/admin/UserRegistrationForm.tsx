import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserPlus, Building, Mail, Lock, Users } from 'lucide-react';

interface UserRegistrationFormProps {
  onClose?: () => void;
  onUserCreated?: () => void;
}

export function UserRegistrationForm({ onClose, onUserCreated }: UserRegistrationFormProps) {
  const { createUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'user' | 'admin',
    officeName: '',
    department: '',
    password: '123456' // Default password
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    'Information Technology',
    'Human Resources', 
    'Finance & Accounting',
    'Marketing & Sales',
    'Operations & Production',
    'Research & Development',
    'Customer Service',
    'General'
  ];

  const offices = [
    'SuperDoll HQ',
    'SuperDoll IT Center',
    'SuperDoll Network Center', 
    'SuperDoll Hardware Lab',
    'SuperDoll Branch Office',
    'SuperDoll Regional Office'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const success = await createUser({
        email: formData.email,
        name: formData.name,
        role: formData.role,
        officeName: formData.officeName,
        department: formData.department,
        password: formData.password
      });

      if (success) {
        alert(`User "${formData.name}" created successfully!`);
        setFormData({
          email: '',
          name: '',
          role: 'user',
          officeName: '',
          department: '',
          password: '123456'
        });
        onUserCreated?.();
        onClose?.();
      } else {
        setError('Failed to create user. Please check the details and try again.');
      }
    } catch (error: any) {
      setError(`Error: ${error.message || 'Failed to create user'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <UserPlus className="w-7 h-7" />
            Create New User Account
          </h2>
          <p className="mt-2 opacity-90">Add a new user to the SuperDoll IT Support System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@superdoll.com"
                required
              />
            </div>
          </div>

          {/* Role and Office */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Role *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="officeName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Office Location *
              </label>
              <select
                id="officeName"
                value={formData.officeName}
                onChange={(e) => setFormData(prev => ({ ...prev, officeName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Office</option>
                {offices.map(office => (
                  <option key={office} value={office}>{office}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department and Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Initial Password *
              </label>
              <input
                type="text"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123456"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              {isCreating ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
