import React, { useState } from 'react';
import { MessageList } from '../messages/MessageList';
import { MessageInput } from '../messages/MessageInput';
import { TicketStatusUpdate } from './TicketStatusUpdate';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketContext';
import { Ticket } from '../../types';
import { 
  Clock, 
  User, 
  Building2, 
  UserCog, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Play,
  X,
  Tag,
  Wrench,
  Settings,
  Wifi,
  Monitor,
  Zap,
  HardDrive,
  Eye,
  Shield
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const { user } = useAuth();
  const { updateTicket } = useTickets();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleStatusUpdate = (status: Ticket['status'], adminNotes?: string) => {
    updateTicket(ticket.id, { status, adminNotes });
    setShowStatusUpdate(false);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Hardware Issues': Wrench,
      'Software Issues': Settings,
      'Network Issues': Wifi,
      'Peripheral Device Issues': Monitor,
      'Power Issues': Zap,
      'BIOS/UEFI & Firmware Issues': HardDrive,
      'Display Issues': Eye,
      'Security Issues': Shield
    };
    const IconComponent = icons[category as keyof typeof icons] || AlertCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Hardware Issues': 'bg-blue-100 text-blue-800 border-blue-200',
      'Software Issues': 'bg-green-100 text-green-800 border-green-200',
      'Network Issues': 'bg-purple-100 text-purple-800 border-purple-200',
      'Peripheral Device Issues': 'bg-orange-100 text-orange-800 border-orange-200',
      'Power Issues': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'BIOS/UEFI & Firmware Issues': 'bg-gray-100 text-gray-800 border-gray-200',
      'Display Issues': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Security Issues': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'in-progress': return <Play className="w-5 h-5 text-orange-600" />;
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'closed': return <X className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'in-progress': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'resolved': return 'bg-green-50 border-green-200 text-green-800';
      case 'closed': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'open': return 'This ticket has been submitted and is awaiting review by our technical team.';
      case 'in-progress': return 'Our technical team is actively working on resolving this issue.';
      case 'resolved': return 'The issue has been resolved. Please verify the solution and close the ticket if satisfied.';
      case 'closed': return 'This ticket has been completed and closed.';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
              </span>
            </div>
            
            {/* Status Banner */}
            <div className={`p-4 rounded-lg border-2 ${getStatusColor(ticket.status)} mb-4`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(ticket.status)}
                <span className="font-semibold text-lg capitalize">
                  {ticket.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm opacity-80">{getStatusDescription(ticket.status)}</p>
            </div>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowStatusUpdate(!showStatusUpdate)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Update Status
            </button>
          )}
        </div>

        {showStatusUpdate && (
          <TicketStatusUpdate
            currentStatus={ticket.status}
            onStatusUpdate={handleStatusUpdate}
            onCancel={() => setShowStatusUpdate(false)}
          />
        )}
      </div>

      {/* Ticket Information Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Ticket Details */}
        <div className="space-y-6">
          {/* Reporter Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Reporter Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{ticket.reporterName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-gray-900">{ticket.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Assigned Admin:</span>
                <span className="font-medium text-gray-900">{ticket.assignedAdmin}</span>
              </div>
            </div>
          </div>

          {/* Category and Issue Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-600" />
              Issue Details
            </h3>
            
            {/* Category */}
            <div className="mb-4">
              <span className="text-sm text-gray-600 block mb-2">Category:</span>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getCategoryColor(ticket.category)}`}>
                {getCategoryIcon(ticket.category)}
                <span className="font-medium">{ticket.category}</span>
              </div>
            </div>

            {/* Specific Issue - Enhanced Display */}
            <div className="mb-4">
              <span className="text-sm text-gray-600 block mb-2">Specific Issue:</span>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Issue Description</h4>
                    <p className="text-red-700 leading-relaxed">{ticket.specificIssue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Description */}
            <div>
              <span className="text-sm text-gray-600 block mb-2">Additional Details:</span>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{ticket.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline and Admin Notes */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {new Date(ticket.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {ticket.adminNotes && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCog className="w-5 h-5 text-indigo-600" />
                Admin Notes
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 leading-relaxed">{ticket.adminNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussion</h3>
        <MessageList ticketId={ticket.id} />
        <div className="mt-4 pt-4 border-t border-gray-200">
          <MessageInput ticketId={ticket.id} />
        </div>
      </div>
    </div>
  );
}