import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from 'react-query';
import { Flag, AlertTriangle, X, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ReportButton = ({ contentType, contentId, contentTitle, onReport }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    {
      value: 'inappropriate',
      label: 'Inappropriate Content',
      description: 'Content that is offensive, violent, or inappropriate',
    },
    {
      value: 'spam',
      label: 'Spam',
      description: 'Repeated or unwanted promotional content',
    },
    {
      value: 'misleading',
      label: 'Misleading Information',
      description: 'Incorrect or dangerous technique information',
    },
    {
      value: 'copyright',
      label: 'Copyright Violation',
      description: 'Content that violates copyright or intellectual property',
    },
    {
      value: 'quality',
      label: 'Low Quality',
      description: 'Poor quality video, audio, or instructional content',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Other issues not covered above',
    },
  ];

  const reportMutation = useMutation(
    async reportData => {
      const response = await api.post('/api/reports', reportData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success(
          'Report submitted successfully. Thank you for helping keep our community safe.'
        );
        setShowModal(false);
        setReason('');
        setDescription('');
        if (onReport) onReport();
      },
      onError: error => {
        toast.error(
          error.message || 'Failed to submit report. Please try again.'
        );
      },
    }
  );

  const handleSubmit = async e => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a reason for reporting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportMutation.mutateAsync({
        contentType,
        contentId,
        contentTitle,
        reason,
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors touch-target"
        title="Report this content"
      >
        <Flag className="w-4 h-4" />
        <span className="text-sm">Report</span>
      </button>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          />
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Report Content
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Reporting: <span className="font-medium">{contentTitle}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Help us maintain a safe and quality community by reporting
                  inappropriate or low-quality content.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Report *
                  </label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a reason...</option>
                    {reportReasons.map(reportReason => (
                      <option
                        key={reportReason.value}
                        value={reportReason.value}
                      >
                        {reportReason.label}
                      </option>
                    ))}
                  </select>
                  {reason && (
                    <p className="text-xs text-gray-500 mt-1">
                      {reportReasons.find(r => r.value === reason)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Please provide any additional details that will help us understand the issue..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;
