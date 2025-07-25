import { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useTickets } from '../contexts/TicketContext';
import { useAuth } from '../contexts/AuthContext';
import { AnalyticsData } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  FileText
} from 'lucide-react';

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const { tickets } = useTickets();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Redirect normal users to dashboard
  useEffect(() => {
    if (user?.role === 'user') {
      onNavigate('dashboard');
    }
  }, [user, onNavigate]);

  const analyticsData: AnalyticsData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Filter tickets based on selected period
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      if (selectedPeriod === 'month') {
        return ticketDate.getFullYear() === currentYear && ticketDate.getMonth() === currentMonth;
      } else {
        return ticketDate.getFullYear() === selectedYear;
      }
    });

    const resolvedTickets = filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
      return sum + (ticket.resolutionTime || 0);
    }, 0);

    const avgResolutionTime = resolvedTickets.length > 0 ? totalResolutionTime / resolvedTickets.length : 0;

    const satisfactionRatings = filteredTickets.filter(t => t.satisfactionRating).map(t => t.satisfactionRating!);
    const avgSatisfaction = satisfactionRatings.length > 0 
      ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / satisfactionRatings.length 
      : 0;

    // Category distribution
    const ticketsByCategory = filteredTickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority distribution
    const ticketsByPriority = filteredTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution
    const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly trends (last 12 months)
    const monthlyTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate.getFullYear() === date.getFullYear() && 
               ticketDate.getMonth() === date.getMonth();
      });
      
      const monthResolved = monthTickets.filter(t => t.status === 'resolved' || t.status === 'closed');
      const monthAvgResolution = monthResolved.length > 0 
        ? monthResolved.reduce((sum, t) => sum + (t.resolutionTime || 0), 0) / monthResolved.length 
        : 0;

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        tickets: monthTickets.length,
        resolved: monthResolved.length,
        avgResolutionTime: monthAvgResolution
      });
    }

    // Department statistics
    const departmentStats = filteredTickets.reduce((acc, ticket) => {
      if (!acc[ticket.department]) {
        acc[ticket.department] = { tickets: 0, avgResolutionTime: 0, satisfaction: 0 };
      }
      acc[ticket.department].tickets++;
      
      if (ticket.resolutionTime) {
        acc[ticket.department].avgResolutionTime += ticket.resolutionTime;
      }
      if (ticket.satisfactionRating) {
        acc[ticket.department].satisfaction += ticket.satisfactionRating;
      }
      
      return acc;
    }, {} as Record<string, { tickets: number; avgResolutionTime: number; satisfaction: number }>);

    // Calculate averages for departments
    Object.keys(departmentStats).forEach(dept => {
      const deptTickets = filteredTickets.filter(t => t.department === dept);
      const resolvedDeptTickets = deptTickets.filter(t => t.resolutionTime);
      const ratedDeptTickets = deptTickets.filter(t => t.satisfactionRating);
      
      departmentStats[dept].avgResolutionTime = resolvedDeptTickets.length > 0 
        ? departmentStats[dept].avgResolutionTime / resolvedDeptTickets.length 
        : 0;
      
      departmentStats[dept].satisfaction = ratedDeptTickets.length > 0 
        ? departmentStats[dept].satisfaction / ratedDeptTickets.length 
        : 0;
    });

    return {
      totalTickets: filteredTickets.length,
      resolvedTickets: resolvedTickets.length,
      avgResolutionTime,
      satisfactionScore: avgSatisfaction,
      ticketsByCategory,
      ticketsByPriority,
      ticketsByStatus,
      monthlyTrends,
      departmentStats
    };
  }, [tickets, selectedPeriod, selectedYear]);

  const forecastData = useMemo(() => {
    const recentTrends = analyticsData.monthlyTrends.slice(-6);
    const avgTickets = recentTrends.reduce((sum, month) => sum + month.tickets, 0) / recentTrends.length;
    
    const trend = recentTrends.length >= 2 
      ? recentTrends[recentTrends.length - 1].tickets - recentTrends[0].tickets
      : 0;

    const trendDirection: 'up' | 'down' | 'stable' = 
      trend > 2 ? 'up' : trend < -2 ? 'down' : 'stable';

    const predictedTickets = Math.max(0, Math.round(avgTickets + (trend * 0.5)));

    const recommendations = [];
    if (trendDirection === 'up') {
      recommendations.push('Consider increasing IT staff capacity');
      recommendations.push('Implement proactive maintenance programs');
      recommendations.push('Enhance user training to reduce common issues');
    } else if (trendDirection === 'down') {
      recommendations.push('Excellent trend! Maintain current service quality');
      recommendations.push('Document successful resolution processes');
      recommendations.push('Consider reallocating resources to other areas');
    } else {
      recommendations.push('Stable ticket volume - focus on efficiency improvements');
      recommendations.push('Analyze resolution times for optimization opportunities');
    }

    return {
      predictedTickets,
      trendDirection,
      seasonalPattern: 'Analyzing patterns...',
      recommendations
    };
  }, [analyticsData]);

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    const reportData = {
      period: selectedPeriod,
      year: selectedYear,
      analytics: analyticsData,
      forecast: forecastData,
      generatedAt: new Date().toISOString()
    };

    const dataStr = format === 'csv' 
      ? convertToCSV(reportData)
      : JSON.stringify(reportData, null, 2);
    
    const blob = new Blob([dataStr], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `helpdesk-report-${selectedPeriod}-${selectedYear}.${format === 'csv' ? 'csv' : 'json'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any) => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Tickets', data.analytics.totalTickets],
      ['Resolved Tickets', data.analytics.resolvedTickets],
      ['Average Resolution Time (hours)', Math.round(data.analytics.avgResolutionTime / 60)],
      ['Satisfaction Score', data.analytics.satisfactionScore.toFixed(1)],
      ['Predicted Next Month Tickets', data.forecast.predictedTickets],
      ['Trend Direction', data.forecast.trendDirection]
    ];

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-purple-100">Advanced insights and forecasting</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'year')}
                className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2"
              >
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              
              {selectedPeriod === 'year' && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2"
                >
                  {[2024, 2023, 2022, 2021].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalTickets}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {analyticsData.totalTickets > 0 
                    ? Math.round((analyticsData.resolvedTickets / analyticsData.totalTickets) * 100)
                    : 0}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution Time</p>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.round(analyticsData.avgResolutionTime / 60)}h
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction Score</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analyticsData.satisfactionScore.toFixed(1)}/5
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Monthly Trends
            </h3>
            <div className="space-y-3">
              {analyticsData.monthlyTrends.slice(-6).map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{month.tickets} tickets</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (month.tickets / Math.max(...analyticsData.monthlyTrends.map(m => m.tickets))) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Forecasting */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Forecasting
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Next Month Prediction</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{forecastData.predictedTickets} tickets</p>
                <p className="text-sm text-purple-700">
                  Trend: <span className="capitalize font-medium">{forecastData.trendDirection}</span>
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Recommendations:</h4>
                <ul className="space-y-1">
                  {forecastData.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Category and Department Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.ticketsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.totalTickets) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.departmentStats).map(([dept, stats]) => (
                <div key={dept} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">{dept}</span>
                    <span className="text-xs text-gray-500">{stats.tickets} tickets</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Avg Resolution:</span>
                      <span className="font-medium ml-1">{Math.round(stats.avgResolutionTime / 60)}h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Satisfaction:</span>
                      <span className="font-medium ml-1">{stats.satisfaction.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Export Reports
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportReport('csv')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}