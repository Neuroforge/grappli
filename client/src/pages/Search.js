import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  Filter,
  ExternalLink,
  Star,
  User,
} from 'lucide-react';
import VoteButton from '../components/VoteButton';
import api from '../services/api';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // all, positions, techniques, links
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery(
    ['search', searchTerm, searchType, category, difficulty],
    async () => {
      if (!searchTerm.trim())
        return { positions: [], techniques: [], links: [] };

      const results = { positions: [], techniques: [], links: [] };

      if (searchType === 'all' || searchType === 'positions') {
        try {
          const response = await api.get(
            `/api/positions/search/${encodeURIComponent(searchTerm)}`
          );
          results.positions = response.data.positions;
        } catch (error) {
          console.error('Error searching positions:', error);
        }
      }

      if (searchType === 'all' || searchType === 'techniques') {
        try {
          const response = await api.get(
            `/api/techniques/search/${encodeURIComponent(searchTerm)}`
          );
          results.techniques = response.data.techniques;
        } catch (error) {
          console.error('Error searching techniques:', error);
        }
      }

      if (searchType === 'all' || searchType === 'links') {
        try {
          const response = await api.get(
            `/api/links/search/${encodeURIComponent(searchTerm)}`
          );
          results.links = response.data.links;
        } catch (error) {
          console.error('Error searching links:', error);
        }
      }

      return results;
    },
    {
      enabled: searchTerm.trim().length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'guard', label: 'Guard' },
    { value: 'mount', label: 'Mount' },
    { value: 'side-control', label: 'Side Control' },
    { value: 'back-control', label: 'Back Control' },
    { value: 'turtle', label: 'Turtle' },
    { value: 'standing', label: 'Standing' },
    { value: 'other', label: 'Other' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const searchTypes = [
    { value: 'all', label: 'All' },
    { value: 'positions', label: 'Positions' },
    { value: 'techniques', label: 'Techniques' },
    { value: 'links', label: 'Links' },
  ];

  const handleSearch = e => {
    e.preventDefault();
    // The search will trigger automatically via react-query
  };

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

  const renderPositionCard = position => (
    <div
      key={position._id}
      className="card card-mobile hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {position.name}
          </h3>
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
        <div className="flex flex-col items-end space-y-2">
          <Link
            to={`/position/${position._id}`}
            className="btn-outline text-sm touch-target self-start sm:self-center"
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

  const renderTechniqueCard = technique => (
    <div
      key={technique._id}
      className="card card-mobile hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {technique.name}
          </h3>
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
            <span className="bg-gray-100 px-2 py-1 rounded">
              Popularity: {technique.popularity}
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
        <div className="flex flex-col items-end space-y-2">
          <Link
            to={`/technique/${technique._id}`}
            className="btn-outline text-sm touch-target self-start sm:self-center"
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

  const renderLinkCard = link => (
    <div
      key={link._id}
      className="card card-mobile hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {link.title}
          </h3>
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
        <div className="flex flex-col items-end space-y-2">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm touch-target self-start sm:self-center"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mobile-text-2xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2 mobile-text-sm">
          Find positions, techniques, and instructional links
        </p>
      </div>

      {/* Search Form */}
      <div className="card card-mobile">
        <form onSubmit={handleSearch} className="mobile-form">
          {/* Search Input */}
          <div className="mobile-form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search for positions, techniques, or links..."
                className="input-field input-field-mobile pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mobile-search-filters">
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Type
              </label>
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="input-field input-field-mobile"
              >
                {searchTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="input-field input-field-mobile"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="input-field input-field-mobile"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {searchTerm && (
        <div className="space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600 mobile-text-sm">
                Searching...
              </span>
            </div>
          )}

          {error && (
            <div className="card card-mobile">
              <p className="text-red-600 mobile-text-sm">
                Error performing search. Please try again.
              </p>
            </div>
          )}

          {searchResults && !isLoading && (
            <>
              {/* Positions */}
              {searchResults.positions.length > 0 && (
                <div>
                  <h2 className="mobile-text-xl font-semibold text-gray-900 mb-4">
                    Positions ({searchResults.positions.length})
                  </h2>
                  <div className="grid gap-4">
                    {searchResults.positions.map(renderPositionCard)}
                  </div>
                </div>
              )}

              {/* Techniques */}
              {searchResults.techniques.length > 0 && (
                <div>
                  <h2 className="mobile-text-xl font-semibold text-gray-900 mb-4">
                    Techniques ({searchResults.techniques.length})
                  </h2>
                  <div className="grid gap-4">
                    {searchResults.techniques.map(renderTechniqueCard)}
                  </div>
                </div>
              )}

              {/* Links */}
              {searchResults.links.length > 0 && (
                <div>
                  <h2 className="mobile-text-xl font-semibold text-gray-900 mb-4">
                    Links ({searchResults.links.length})
                  </h2>
                  <div className="grid gap-4">
                    {searchResults.links.map(renderLinkCard)}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchResults.positions.length === 0 &&
                searchResults.techniques.length === 0 &&
                searchResults.links.length === 0 && (
                  <div className="card card-mobile text-center py-12">
                    <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="mobile-text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 mobile-text-sm">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <div className="card card-mobile text-center py-12">
          <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="mobile-text-lg font-medium text-gray-900 mb-2">
            Start searching
          </h3>
          <p className="text-gray-600 mobile-text-sm">
            Enter a search term to find positions, techniques, and instructional
            links
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
