import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const VoteButton = ({
  targetType,
  targetId,
  initialVoteCount = { upvotes: 0, downvotes: 0 },
  initialUserVote = null,
}) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [userVote, setUserVote] = useState(initialUserVote);
  const [voteCount, setVoteCount] = useState(initialVoteCount);

  // Get vote summary
  const { data: voteData, refetch: refetchVotes } = useQuery(
    ['votes', targetType, targetId],
    async () => {
      const response = await api.get(`/api/votes/${targetType}/${targetId}`);
      return response.data;
    },
    {
      enabled: !!targetId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Update local state when vote data changes
  useEffect(() => {
    if (voteData) {
      setUserVote(voteData.userVote);

      // Calculate vote counts from summary
      let upvotes = 0;
      let downvotes = 0;

      voteData.voteSummary.forEach(summary => {
        if (summary._id === 'upvote') {
          upvotes = summary.count;
        } else if (summary._id === 'downvote') {
          downvotes = summary.count;
        }
      });

      setVoteCount({ upvotes, downvotes });
    }
  }, [voteData]);

  // Vote mutation
  const voteMutation = useMutation(
    async ({ voteType }) => {
      const response = await api.post(`/api/votes/${targetType}/${targetId}`, {
        voteType,
      });
      return response.data;
    },
    {
      onSuccess: data => {
        setUserVote(data.userVote);
        setVoteCount(data.target.voteCount);

        // Invalidate related queries
        queryClient.invalidateQueries(['votes', targetType, targetId]);
        queryClient.invalidateQueries([targetType, targetId]);

        // Show success message
        const action = data.userVote
          ? `Vote ${data.userVote}d`
          : 'Vote removed';
        toast.success(action);
      },
      onError: error => {
        toast.error(error.response?.data?.error || 'Failed to vote');
      },
    }
  );

  const handleVote = voteType => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }

    voteMutation.mutate({ voteType });
  };

  const voteScore = voteCount.upvotes - voteCount.downvotes;

  return (
    <div className="flex items-center space-x-2">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('upvote')}
        disabled={voteMutation.isLoading}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors touch-target ${
          userVote === 'upvote'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
        }`}
        title="Upvote"
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="hidden sm:inline">{voteCount.upvotes}</span>
      </button>

      {/* Vote Score */}
      <div className="flex items-center space-x-1">
        <span
          className={`text-sm font-medium ${
            voteScore > 0
              ? 'text-green-600'
              : voteScore < 0
                ? 'text-red-600'
                : 'text-gray-600'
          }`}
        >
          {voteScore > 0 ? '+' : ''}
          {voteScore}
        </span>
      </div>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('downvote')}
        disabled={voteMutation.isLoading}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors touch-target ${
          userVote === 'downvote'
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
        }`}
        title="Downvote"
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="hidden sm:inline">{voteCount.downvotes}</span>
      </button>

      {/* Loading indicator */}
      {voteMutation.isLoading && (
        <div className="flex items-center space-x-1">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
          <span className="text-xs text-gray-500">Voting...</span>
        </div>
      )}
    </div>
  );
};

export default VoteButton;
