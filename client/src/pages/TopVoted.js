import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ExternalLink,
  Star,
  User,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import VoteButton from '../components/VoteButton';
import api from '../services/api';

const TopVoted = () => {
  const [activeTab, setActiveTab] = useState('positions');

  const { data: topPositions, isLoading: positionsLoading } = useQuery(
    ['top-voted', 'positions'],
    async () => {
      const response = await api.get('/api/votes/top/position?limit=20');
      return response.data.topContent;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const { data: topTechniques, isLoading: techniquesLoading } = useQuery(
    ['top-voted', 'techniques'],
    async () => {
      const response = await api.get('/api/votes/top/technique?limit=20');
      return response.data.topContent;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const { data: topLinks, isLoading: linksLoading } = useQuery(
    ['top-voted', 'links'],
    async () => {
      const response = await api.get('/api/votes/top/link?limit=20');
      return response.data.topContent;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

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

  const renderPositionCard = (position, index) => (
    <div
      key={position._id}
      className="card card-mobile hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-bold text-primary-600">
              #{index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {position.name}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {position.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {position.category}
            </span>
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {position.difficulty}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              Popularity: {position.popularity}
            </span>
          </div>
          {position.createdBy && (
            <div className="flex items-center space-x-2 mt-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {position.createdBy.firstName} {position.createdBy.lastName}
              </span>
              {position.createdBy.beltRank && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full belt-${position.createdBy.beltRank.color}`}
                >
                  {getBeltDisplay(position.createdBy.beltRank)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <Link
            to={`/position/${position._id}`}
            className="btn-outline text-sm touch-target"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <VoteButton
            targetType="position"
            targetId={position._id}
            initialVoteCount={position.voteCount}
          />
        </div>
      </div>
    </div>
  );

  const renderTechniqueCard = (technique, index) => (
    <div
      key={technique._id}
      className="card card-mobile hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-bold text-primary-600">
              #{index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {technique.name}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {technique.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {technique.type}
            </span>
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {technique.difficulty}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              Success Rate: {technique.successRate}%
            </span>
          </div>
          {technique.fromPosition && technique.toPosition && (
            <div className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">
              From: {technique.fromPosition.name} → To:{' '}
              {technique.toPosition.name}
            </div>
          )}
          {technique.createdBy && (
            <div className="flex items-center space-x-2 mt-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {technique.createdBy.firstName} {technique.createdBy.lastName}
              </span>
              {technique.createdBy.beltRank && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full belt-${technique.createdBy.beltRank.color}`}
                >
                  {getBeltDisplay(technique.createdBy.beltRank)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <Link
            to={`/technique/${technique._id}`}
            className="btn-outline text-sm touch-target"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <VoteButton
            targetType="technique"
            targetId={technique._id}
            initialVoteCount={technique.voteCount}
          />
        </div>
      </div>
    </div>
  );

  const renderLinkCard = (link, index) => (
    <div
      key={link._id}
      className="card card-mobile hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-bold text-primary-600">
              #{index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {link.title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {link.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {link.type}
            </span>
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {link.platform}
            </span>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>
                {link.rating.average.toFixed(1)} ({link.rating.count})
              </span>
            </div>
          </div>
          {link.createdBy && (
            <div className="flex items-center space-x-2 mt-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {link.createdBy.firstName} {link.createdBy.lastName}
              </span>
              {link.createdBy.beltRank && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full belt-${link.createdBy.beltRank.color}`}
                >
                  {getBeltDisplay(link.createdBy.beltRank)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm touch-target"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <VoteButton
            targetType="link"
            targetId={link._id}
            initialVoteCount={link.voteCount}
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'positions', label: 'Positions', count: topPositions?.length || 0 },
    {
      id: 'techniques',
      label: 'Techniques',
      count: topTechniques?.length || 0,
    },
    { id: 'links', label: 'Links', count: topLinks?.length || 0 },
  ];

  const isLoading = positionsLoading || techniquesLoading || linksLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mobile-text-2xl font-bold text-gray-900">
          Top Voted Content
        </h1>
        <p className="text-gray-600 mt-2 mobile-text-sm">
          Discover the most voted positions, techniques, and instructional links
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm touch-target ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 mobile-text-sm">
            Loading top voted content...
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'positions' && topPositions && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="mobile-text-xl font-semibold text-gray-900">
                  Top Voted Positions
                </h2>
              </div>
              <div className="grid gap-4">
                {topPositions.map((position, index) =>
                  renderPositionCard(position, index)
                )}
              </div>
            </div>
          )}

          {activeTab === 'techniques' && topTechniques && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="mobile-text-xl font-semibold text-gray-900">
                  Top Voted Techniques
                </h2>
              </div>
              <div className="grid gap-4">
                {topTechniques.map((technique, index) =>
                  renderTechniqueCard(technique, index)
                )}
              </div>
            </div>
          )}

          {activeTab === 'links' && topLinks && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="mobile-text-xl font-semibold text-gray-900">
                  Top Voted Links
                </h2>
              </div>
              <div className="grid gap-4">
                {topLinks.map((link, index) => renderLinkCard(link, index))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (
        <>
          {activeTab === 'positions' &&
            (!topPositions || topPositions.length === 0) && (
              <div className="card card-mobile text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="mobile-text-lg font-medium text-gray-900 mb-2">
                  No voted positions yet
                </h3>
                <p className="text-gray-600 mobile-text-sm">
                  Start voting on positions to see them appear here
                </p>
              </div>
            )}

          {activeTab === 'techniques' &&
            (!topTechniques || topTechniques.length === 0) && (
              <div className="card card-mobile text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="mobile-text-lg font-medium text-gray-900 mb-2">
                  No voted techniques yet
                </h3>
                <p className="text-gray-600 mobile-text-sm">
                  Start voting on techniques to see them appear here
                </p>
              </div>
            )}

          {activeTab === 'links' && (!topLinks || topLinks.length === 0) && (
            <div className="card card-mobile text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="mobile-text-lg font-medium text-gray-900 mb-2">
                No voted links yet
              </h3>
              <p className="text-gray-600 mobile-text-sm">
                Start voting on links to see them appear here
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopVoted;
