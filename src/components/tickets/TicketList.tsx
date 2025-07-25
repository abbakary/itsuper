import { Ticket } from '../../types';
import { 
  Clock, 
  User, 
  Building2, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  X,
  Wrench,
  Settings,
  Wifi,
  Monitor,
  Zap,
  HardDrive,
  Eye,
  Shield
} from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

export function TicketList({ tickets, onTicketClick }: TicketListProps) {
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
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Hardware Issues': 'bg-blue-100 text-blue-700 border-blue-200',
      'Software Issues': 'bg-green-100 text-green-700 border-green-200',
      'Network Issues': 'bg-purple-100 text-purple-700 border-purple-200',
      'Peripheral Device Issues': 'bg-orange-100 text-orange-700 border-orange-200',
      'Power Issues': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'BIOS/UEFI & Firmware Issues': 'bg-gray-100 text-gray-700 border-gray-200',
      'Display Issues': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Security Issues': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'in-progress': return <Play className="w-4 h-4 text-orange-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'closed': return <X className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => onTicketClick(ticket)}
          className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] overflow-hidden"
        >
          {/* Priority Indicator Strip */}
          <div className={`h-1 ${getPriorityColor(ticket.priority)}`} />
          
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {ticket.title}
                </h3>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status || 'open')}`}>
                  {getStatusIcon(ticket.status || 'open')}
                  <span className="font-medium capitalize">{(ticket.status || 'open').replace('-', ' ')}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm ${getCategoryColor(ticket.category)}`}>
                {getCategoryIcon(ticket.category)}
                <span className="font-medium">{ticket.category}</span>
              </div>
            </div>

            {/* Specific Issue Preview */}
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium line-clamp-2">
                {ticket.specificIssue}
              </p>
            </div>

            {/* Reporter Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">{ticket.reporterName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{ticket.department}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                #{ticket.id.slice(-6)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}