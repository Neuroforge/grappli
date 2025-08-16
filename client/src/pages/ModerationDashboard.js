import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import {
  Flag,
  Eye,
  X,
  Check,
  AlertTriangle,
  Clock,
  User,
  ExternalLink,
  Filter,
  Search,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ModerationDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reports, isLoading } = useQuery(
    ['reports', filter],
    async () => {
      const response = await api.get(`/api/reports?status=${filter}`);
      return response.data.reports;
    }
  );

  const updateReportMutation = useMutation(
    async ({ reportId, action }) => {
      const response = await api.put(`/api/reports/${reportId}`, { action });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reports']);
        toast.success('Report updated successfully');
      },
      onError: error => {
        toast.error(error.message || 'Failed to update report');
      },
    }
  );

  const handleAction = async (reportId, action) => {
    await updateReportMutation.mutateAsync({ reportId, action });
  };

  const getStatusBadge = status => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      reviewed: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      resolved: { color: 'bg-green-100 text-green-800', icon: Check },
      dismissed: { color: 'bg-gray-100 text-gray-800', icon: X },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getReasonBadge = reason => {
    const reasonConfig = {
      inappropriate: {
        color: 'bg-red-100 text-red-800',
        label: 'Inappropriate',
      },
      spam: { color: 'bg-orange-100 text-orange-800', label: 'Spam' },
      misleading: {
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Misleading',
      },
      copyright: { color: 'bg-purple-100 text-purple-800', label: 'Copyright' },
      quality: { color: 'bg-gray-100 text-gray-800', label: 'Low Quality' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' },
    };

    const config = reasonConfig[reason] || reasonConfig.other;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredReports =
    reports?.filter(
      report =>
        report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    ) || [];

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access the moderation dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mobile-space-y">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mobile-text-2xl font-bold text-gray-900">
            Moderation Dashboard
          </h1>
          <p className="text-gray-600 mobile-text-sm">
            Review and manage reported content
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Flag className="w-5 h-5 text-red-500" />
          <span className="text-sm text-gray-600">
            {filteredReports.length} reports
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600">
              No reports match your current filters.
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusBadge(report.status)}
                    {getReasonBadge(report.reason)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {report.contentTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reported by {report.reporter.username} on{' '}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {report.contentUrl && (
                    <a
                      href={report.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View content"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Report Details
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {report.description || 'No additional details provided.'}
                </p>
                <div className="text-xs text-gray-500">
                  Content Type: {report.contentType} | ID: {report.contentId}
                </div>
              </div>

              {report.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(report.id, 'resolve')}
                    disabled={updateReportMutation.isLoading}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" />
                    <span>Resolve</span>
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'dismiss')}
                    disabled={updateReportMutation.isLoading}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                    <span>Dismiss</span>
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'review')}
                    disabled={updateReportMutation.isLoading}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Mark Reviewed</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModerationDashboard;
