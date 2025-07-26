import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AlertCircle, User, Send } from 'lucide-react';

export function SimpleTicketForm({ onSubmit }: { onSubmit?: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    reporterName: '',
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reporterName || !formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          title: formData.title,
          description: formData.description,
          priority: 'medium',
          category: 'General Issue',
          specific_issue: formData.title,
          reporter_name: formData.reporterName,
          department: 'General',
          assigned_admin: 'Auto-assigned',
          user_id: user?.id || 'demo-user',
          status: 'open'
        });

      if (error) throw error;

      // Reset form
      setFormData({
        reporterName: '',
        title: '',
        description: ''
      });

      alert('Ticket created successfully!');
      onSubmit?.();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-blue-500 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <AlertCircle className="w-7 h-7" />
            Create Support Ticket
          </h2>
          <p className="mt-2 opacity-90">Submit your IT support request quickly and easily</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Your Full Name *
              </label>
              <input
                type="text"
                id="reporterName"
                value={formData.reporterName}
                onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Issue Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Briefly describe your issue (e.g., Computer won't start, Printer not working)"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-blue-500 text-white px-6 py-4 rounded-lg hover:from-yellow-500 hover:to-blue-600 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Creating Ticket...' : 'Submit Ticket'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
            <p className="font-medium">Need more detailed support?</p>
            <p>Our admin team will contact you for additional information if needed.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
