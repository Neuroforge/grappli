import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

const TransitionForm = ({ fromPosition, toPosition, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const createTransitionMutation = useMutation(
    async data => {
      const response = await api.post('/api/transitions', {
        fromPositionId: fromPosition.id,
        toPositionId: toPosition.id,
        ...data,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Transition added successfully!');
        queryClient.invalidateQueries(['graph-data']);
        reset();
        onClose();
      },
      onError: error => {
        toast.error(error.response?.data?.error || 'Failed to add transition');
      },
    }
  );

  const onSubmit = async data => {
    setIsSubmitting(true);
    try {
      await createTransitionMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Transition
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Position Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">From Position:</div>
            <div className="font-medium text-gray-900">{fromPosition.name}</div>
            <div className="text-sm text-gray-600 mt-2 mb-2">To Position:</div>
            <div className="font-medium text-gray-900">{toPosition.name}</div>
          </div>

          {/* Transition Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transition Type *
            </label>
            <select
              {...register('type', { required: 'Transition type is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="advance">Advance</option>
              <option value="reversal">Reversal</option>
              <option value="escape">Escape</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Advantage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advantage *
            </label>
            <select
              {...register('advantage', { required: 'Advantage is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select advantage</option>
              <option value="top">Top (Advantageous)</option>
              <option value="bottom">Bottom (Disadvantageous)</option>
            </select>
            {errors.advantage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.advantage.message}
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the transition..."
            />
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Applicable Contexts
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('metadata.gi')}
                  defaultChecked
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Gi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('metadata.noGi')}
                  defaultChecked
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">No-Gi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('metadata.competition')}
                  defaultChecked
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Competition</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('metadata.selfDefense')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Self Defense</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Transition</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransitionForm;
