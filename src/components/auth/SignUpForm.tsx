import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Building, Users } from 'lucide-react';

export function SignUpForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: 'password123',
    full_name: '',
    role: 'user' as 'user' | 'admin',
    office_name: 'SuperDoll HQ',
    department: 'General'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setIsSubmitting(true);
    setError('');

    try {
      const { success, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.full_name,
          role: formData.role,
          office_name: formData.office_name,
          department: formData.department
        }
      );

      if (success) {
        setSuccess(true);
      } else {
        setError(signUpError || 'Failed to create account');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-6">Your SuperDoll IT Support account has been created successfully.</p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join the SuperDoll IT Support System</p>
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">✅ Quick Setup: Default password is pre-filled</p>
          <p className="text-xs text-green-600">Just enter your name and email to get started!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="john.doe@superdoll.com"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            title="Please enter a valid email address (e.g., john.doe@superdoll.com)"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password *
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="office_name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Office Location *
          </label>
          <select
            id="office_name"
            value={formData.office_name}
            onChange={(e) => setFormData(prev => ({ ...prev, office_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {offices.map(office => (
              <option key={office} value={office}>{office}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Department *
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-yellow-400 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-blue-600 transition-all duration-300 font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
