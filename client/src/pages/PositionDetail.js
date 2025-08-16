import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, User, Tag } from 'lucide-react';
import api from '../services/api';
import ReportButton from '../components/ReportButton';

const PositionDetail = () => {
  const { id } = useParams();

  const {
    data: positionData,
    isLoading,
    error,
  } = useQuery(['position', id], async () => {
    const response = await api.get(`/api/positions/${id}`);
    return response.data;
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
        <p className="text-red-600 mb-4">Error loading position</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  const { position, techniques } = positionData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/explorer" className="btn-outline">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {position.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {position.category} • {position.difficulty} • Popularity:{' '}
              {position.popularity}
            </p>
          </div>
        </div>
        <ReportButton
          contentType="position"
          contentId={position._id}
          contentTitle={position.name}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {position.description}
            </p>
          </div>

          {/* Related Techniques */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              Related Techniques ({techniques.length})
            </h2>
            {techniques.length > 0 ? (
              <div className="space-y-4">
                {techniques.map(technique => (
                  <div
                    key={technique._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {technique.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {technique.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{technique.type}</span>
                          <span className="capitalize">
                            {technique.difficulty}
                          </span>
                          <span>Success Rate: {technique.successRate}%</span>
                          <span>Popularity: {technique.popularity}</span>
                        </div>
                        {technique.toPosition && (
                          <div className="text-sm text-gray-600 mt-2">
                            Leads to: {technique.toPosition.name}
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/technique/${technique._id}`}
                        className="btn-outline text-sm ml-4"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No techniques found for this position.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Position Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Position Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Category
                </span>
                <p className="text-gray-900 capitalize">{position.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Difficulty
                </span>
                <p className="text-gray-900 capitalize">
                  {position.difficulty}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Popularity
                </span>
                <p className="text-gray-900">{position.popularity}</p>
              </div>
              {position.tags && position.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {position.tags.map((tag, index) => (
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
          {position.createdBy && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Created By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {position.createdBy.firstName} {position.createdBy.lastName}
                  </p>
                  {position.createdBy.beltRank && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full belt-${position.createdBy.beltRank.color}`}
                    >
                      {getBeltDisplay(position.createdBy.beltRank)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          {position.metadata && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gi</span>
                  <span
                    className={
                      position.metadata.gi ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {position.metadata.gi ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">No-Gi</span>
                  <span
                    className={
                      position.metadata.noGi ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {position.metadata.noGi ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Competition</span>
                  <span
                    className={
                      position.metadata.competition
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {position.metadata.competition ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Self Defense</span>
                  <span
                    className={
                      position.metadata.selfDefense
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {position.metadata.selfDefense ? 'Yes' : 'No'}
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

export default PositionDetail;
