import React from 'react';
import { Ticket } from '../../types';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Play, 
  TrendingUp,
  Users,
  Building2,
  BarChart3
} from 'lucide-react';

interface StatCardsProps {
  tickets: Ticket[];
  userRole?: 'user' | 'admin';
}

export function StatCards({ tickets }: StatCardsProps) {
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  
  const totalTickets = tickets.length;
  const uniqueUsers = new Set(tickets.map(t => t.reporterName)).size;
  const uniqueDepartments = new Set(tickets.map(t => t.department)).size;
  
  const resolutionRate = totalTickets > 0 ? Math.round(((resolvedTickets + closedTickets) / totalTickets) * 100) : 0;

  const stats = [
    {
      title: 'Open Tickets',
      value: openTickets,
      icon: AlertCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'In Progress',
      value: inProgressTickets,
      icon: Play,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Resolved',
      value: resolvedTickets,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Closed',
      value: closedTickets,
      icon: Clock,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      title: 'Resolution Rate',
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Active Users',
      value: uniqueUsers,
      icon: Users,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Departments',
      value: uniqueDepartments,
      icon: Building2,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: BarChart3,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
