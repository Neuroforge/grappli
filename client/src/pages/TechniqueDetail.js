import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, User, Tag, Play } from 'lucide-react';
import api from '../services/api';

const TechniqueDetail = () => {
  const { id } = useParams();

  const {
    data: technique,
    isLoading,
    error,
  } = useQuery(['technique', id], async () => {
    const response = await api.get(`/api/techniques/${id}`);
    return response.data.technique;
  });

  const getBeltDisplay = beltRank => {
    if (!beltRank) return '';
    const color =
      beltRank.color.charAt(0).toUpperCase() + beltRank.color.slice(1);
    const stripeText =
      beltRank.stripe > 0
        ? ` (${beltRank.stripe} stripe${beltRank.stripe > 1 ? 's' : ''})`
        : '';
    return `${color} Belt${stripeText}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading technique</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/explorer" className="btn-outline">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{technique.name}</h1>
          <p className="text-gray-600 mt-1">
            {technique.type} • {technique.difficulty} • Success Rate:{' '}
            {technique.successRate}% • Popularity: {technique.popularity}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {technique.description}
            </p>
          </div>

          {/* Position Flow */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Position Flow</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">
                  From Position
                </h3>
                <p className="text-gray-600">{technique.fromPosition.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {technique.fromPosition.category}
                </p>
              </div>
              <div className="text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <div className="flex-1 p-4 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-900 mb-1">
                  This Technique
                </h3>
                <p className="text-primary-700">{technique.name}</p>
                <p className="text-sm text-primary-600 capitalize">
                  {technique.type}
                </p>
              </div>
              <div className="text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">To Position</h3>
                <p className="text-gray-600">{technique.toPosition.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {technique.toPosition.category}
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          {technique.steps && technique.steps.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Step-by-Step Instructions
              </h2>
              <div className="space-y-4">
                {technique.steps.map((step, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step.description}</p>
                      {step.imageUrl && (
                        <img
                          src={step.imageUrl}
                          alt={`Step ${index + 1}`}
                          className="mt-2 rounded-lg max-w-xs"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {technique.videoUrl && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Video Demonstration
              </h2>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <a
                  href={technique.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technique Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              Technique Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Type</span>
                <p className="text-gray-900 capitalize">{technique.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Difficulty
                </span>
                <p className="text-gray-900 capitalize">
                  {technique.difficulty}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Success Rate
                </span>
                <p className="text-gray-900">{technique.successRate}%</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Popularity
                </span>
                <p className="text-gray-900">{technique.popularity}</p>
              </div>
              {technique.tags && technique.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {technique.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center space-x-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Creator Info */}
          {technique.createdBy && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Created By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {technique.createdBy.firstName}{' '}
                    {technique.createdBy.lastName}
                  </p>
                  {technique.createdBy.beltRank && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full belt-${technique.createdBy.beltRank.color}`}
                    >
                      {getBeltDisplay(technique.createdBy.beltRank)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          {technique.metadata && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gi</span>
                  <span
                    className={
                      technique.metadata.gi ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {technique.metadata.gi ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">No-Gi</span>
                  <span
                    className={
                      technique.metadata.noGi
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {technique.metadata.noGi ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Competition</span>
                  <span
                    className={
                      technique.metadata.competition
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {technique.metadata.competition ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Self Defense</span>
                  <span
                    className={
                      technique.metadata.selfDefense
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {technique.metadata.selfDefense ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requires Strength</span>
                  <span
                    className={
                      technique.metadata.requiresStrength
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {technique.metadata.requiresStrength ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requires Flexibility</span>
                  <span
                    className={
                      technique.metadata.requiresFlexibility
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {technique.metadata.requiresFlexibility ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechniqueDetail;
