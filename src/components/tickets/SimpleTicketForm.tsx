import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketContext';
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
      console.log('🎫 Creating ticket with data:', formData);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        throw new Error('You must be logged in to create a ticket');
      }

      console.log('�� Current user:', currentUser.id);

      const ticketData = {
        title: formData.title,
        description: formData.description,
        priority: 'medium',
        category: 'General Issue',
        specific_issue: formData.title,
        reporter_name: formData.reporterName,
        department: 'General',
        assigned_admin: 'Auto-assigned',
        user_id: currentUser.id,
        status: 'open'
      };

      console.log('📝 Inserting ticket data:', ticketData);

      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Ticket created successfully:', data);

      // Reset form
      setFormData({
        reporterName: '',
        title: '',
        description: ''
      });

      alert('Ticket created successfully!');
      onSubmit?.();
    } catch (error: any) {
      console.error('💥 Error creating ticket:', error);
      const errorMessage = error?.message || 'Failed to create ticket';
      alert(`Error: ${errorMessage}. Please try again or contact support.`);
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

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Issue Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-none"
                placeholder="Please provide more details about your issue. What were you doing when it occurred? What error messages did you see? The more details you provide, the faster we can help you."
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
