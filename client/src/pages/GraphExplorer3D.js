import React, { useState, useCallback, useRef } from 'react';
import { useGraph } from '../contexts/GraphContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Box,
  Square,
  Settings,
  Info,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  Play,
  Pause,
  RotateCw,
  FlipHorizontal,
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import toast from 'react-hot-toast';
import StickFigure3D from '../components/StickFigure3D';
import PathFinder from '../components/PathFinder';
import { findDetailedPath, calculatePathStats } from '../utils/pathfinding';

const GraphExplorer3D = () => {
  const {
    filteredNodes,
    filteredEdges,
    selectedNode,
    selectedEdge,
    graphMode,
    filterCategory,
    filterDifficulty,
    setSelectedNode,
    setSelectedEdge,
    setGraphMode,
    setFilters,
    clearSelections,
    isLoading,
    error,
  } = useGraph();

  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showPathFinder, setShowPathFinder] = useState(false);
  const [selectedPathNodes, setSelectedPathNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [isPathfinding, setIsPathfinding] = useState(false);

  // 3D View states
  const [show3DView, setShow3DView] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentTransition, setCurrentTransition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState('external'); // external, red, blue
  const [rotation, setRotation] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);

  const graphRef = useRef();

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

  const handleNodeClick = useCallback(
    node => {
      setSelectedNode(node);
      setSelectedEdge(null);
      setCurrentPosition(node);
      setCurrentTransition(null);
      toast.success(`Selected: ${node.name}`);
    },
    [setSelectedNode, setSelectedEdge]
  );

  const handleEdgeClick = useCallback(
    edge => {
      setSelectedEdge(edge);
      setSelectedNode(null);
      setCurrentTransition(edge);
      setCurrentPosition(null);
      toast.success(`Selected: ${edge.name}`);
    },
    [setSelectedEdge, setSelectedNode]
  );

  const handleBackgroundClick = useCallback(() => {
    clearSelections();
    setCurrentPosition(null);
    setCurrentTransition(null);
  }, [clearSelections]);

  const handleZoomToFit = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoom(1.5, 200);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoom(0.75, 200);
    }
  }, []);

  // 3D View handlers
  const handleViewModeChange = useCallback(mode => {
    setViewMode(mode);
  }, []);

  const handleRotationChange = useCallback(value => {
    setRotation(value);
  }, []);

  const handleFlipToggle = useCallback(() => {
    setIsMirrored(!isMirrored);
  }, [isMirrored]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    toast.success('Animation completed');
  }, []);

  // Pathfinding handlers
  const handleNodeSelect = useCallback(
    (nodeId, isSelected) => {
      if (isSelected) {
        const node = filteredNodes.find(n => n.id === nodeId);
        if (node && !selectedPathNodes.find(n => n.id === nodeId)) {
          setSelectedPathNodes(prev => [...prev, node]);
          toast.success(`Added ${node.name} to path`);
        }
      } else {
        setSelectedPathNodes(prev => prev.filter(n => n.id !== nodeId));
      }
    },
    [filteredNodes, selectedPathNodes]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedPathNodes([]);
    setPath([]);
  }, []);

  const handleFindPath = useCallback(
    async nodes => {
      setIsPathfinding(true);
      try {
        // Create adjacency graph from edges
        const graph = {};
        filteredEdges.forEach(edge => {
          if (!graph[edge.source]) graph[edge.source] = [];
          if (!graph[edge.target]) graph[edge.target] = [];
          graph[edge.source].push(edge.target);
          graph[edge.target].push(edge.source);
        });

        // Find detailed path
        const detailedPath = findDetailedPath(graph, nodes, filteredNodes);

        if (detailedPath && detailedPath.length > 0) {
          setPath(detailedPath);
          const stats = calculatePathStats(detailedPath);
          toast.success(
            `Path found! ${stats.totalNodes} positions, ${stats.totalTransitions} transitions`
          );
        } else {
          toast.error('No valid path found between selected positions');
        }
      } catch (error) {
        console.error('Pathfinding error:', error);
        toast.error('Failed to find path');
      } finally {
        setIsPathfinding(false);
      }
    },
    [filteredEdges, filteredNodes]
  );

  const handleClearPath = useCallback(() => {
    setPath([]);
  }, []);

  const filteredNodesBySearch = filteredNodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEdgesBySearch = filteredEdges.filter(edge =>
    edge.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mobile-text-sm">Loading graph data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4 mobile-text-sm">
            Error loading graph data
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary btn-mobile"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="mobile-text-2xl font-bold text-gray-900">
            Graph Explorer 3D
          </h1>
          <p className="text-gray-600 mt-2 mobile-text-sm">
            Explore BJJ positions and techniques with 3D stick figure
            visualization
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="btn-outline flex items-center space-x-2 touch-target"
          >
            <Info className="w-4 h-4" />
            <span className="mobile-only">Help</span>
          </button>

          <button
            onClick={() => setShowPathFinder(!showPathFinder)}
            className={`btn-outline flex items-center space-x-2 touch-target ${
              showPathFinder ? 'bg-primary-600 text-white' : ''
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="mobile-only">Path Finder</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center space-x-2 touch-target"
          >
            <Filter className="w-4 h-4" />
            <span className="mobile-only">Filters</span>
          </button>

          <button
            onClick={() => setShow3DView(!show3DView)}
            className={`btn-outline flex items-center space-x-2 touch-target ${
              show3DView ? 'bg-primary-600 text-white' : ''
            }`}
          >
            <Box className="w-4 h-4" />
            <span className="mobile-only">3D View</span>
          </button>

          {/* Mobile Controls Toggle */}
          <button
            onClick={() => setShowMobileControls(!showMobileControls)}
            className="md:hidden btn-outline flex items-center space-x-2 touch-target"
          >
            <Settings className="w-4 h-4" />
            <span>Controls</span>
          </button>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="card card-mobile">
          <h3 className="mobile-text-lg font-semibold mb-4">
            How to Use the 3D Graph Explorer
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">2D Graph</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click on nodes to select positions</li>
                <li>• Click on edges to select techniques</li>
                <li>• Drag to move nodes around</li>
                <li>• Use zoom controls to navigate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">3D Visualization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View stick figure representations</li>
                <li>• Animate transitions between positions</li>
                <li>• Rotate and zoom the 3D view</li>
                <li>• Flip the view for different perspectives</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="card card-mobile">
          <div className="mobile-search-filters">
            {/* Search */}
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search positions and techniques..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field input-field-mobile pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={e => setFilters(e.target.value, filterDifficulty)}
                className="input-field input-field-mobile"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="mobile-form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filterDifficulty}
                onChange={e => setFilters(filterCategory, e.target.value)}
                className="input-field input-field-mobile"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 2D Graph */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-[400px] sm:h-[500px] md:h-[600px] relative">
            {graphMode === '2d' ? (
              <ForceGraph2D
                ref={graphRef}
                graphData={{
                  nodes: filteredNodesBySearch,
                  links: filteredEdgesBySearch,
                }}
                nodeLabel="name"
                linkLabel="name"
                nodeColor={node => {
                  if (selectedNode && selectedNode.id === node.id) {
                    return '#EF4444'; // Red for selected node
                  }

                  // Color by advantage (top/bottom)
                  if (node.advantage === 'top') {
                    return '#10B981'; // Green for advantageous positions
                  } else if (node.advantage === 'bottom') {
                    return '#EF4444'; // Red for disadvantaged positions
                  } else {
                    return '#6B7280'; // Gray for neutral positions
                  }
                }}
                linkColor={link => {
                  // Color by transition type and advantage
                  if (link.advantage === 'top') {
                    return '#10B981'; // Green for advantageous transitions
                  } else if (link.advantage === 'bottom') {
                    return '#EF4444'; // Red for disadvantaged transitions
                  } else {
                    return '#6B7280'; // Gray for neutral transitions
                  }
                }}
                nodeRelSize={6}
                linkWidth={link => Math.max(1, link.popularity / 10)}
                onNodeClick={handleNodeClick}
                onLinkClick={handleEdgeClick}
                onBackgroundClick={handleBackgroundClick}
                cooldownTicks={100}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
              />
            ) : (
              <ForceGraph3D
                ref={graphRef}
                graphData={{
                  nodes: filteredNodesBySearch,
                  links: filteredEdgesBySearch,
                }}
                nodeLabel="name"
                linkLabel="name"
                nodeColor={node => {
                  if (selectedNode && selectedNode.id === node.id) {
                    return '#EF4444'; // Red for selected node
                  }

                  // Color by advantage (top/bottom)
                  if (node.advantage === 'top') {
                    return '#10B981'; // Green for advantageous positions
                  } else if (node.advantage === 'bottom') {
                    return '#EF4444'; // Red for disadvantaged positions
                  } else {
                    return '#6B7280'; // Gray for neutral positions
                  }
                }}
                linkColor={link => {
                  // Color by transition type and advantage
                  if (link.advantage === 'top') {
                    return '#10B981'; // Green for advantageous transitions
                  } else if (link.advantage === 'bottom') {
                    return '#EF4444'; // Red for disadvantaged transitions
                  } else {
                    return '#6B7280'; // Gray for neutral transitions
                  }
                }}
                nodeRelSize={6}
                linkWidth={link => Math.max(1, link.popularity / 10)}
                onNodeClick={handleNodeClick}
                onLinkClick={handleEdgeClick}
                onBackgroundClick={handleBackgroundClick}
                cooldownTicks={100}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
              />
            )}
          </div>
        </div>

        {/* 3D View */}
        {show3DView && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                3D Stick Figure View
              </h3>

              {/* 3D Controls */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    View:
                  </label>
                  <select
                    value={viewMode}
                    onChange={e => handleViewModeChange(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="external">External</option>
                    <option value="red">Red Player</option>
                    <option value="blue">Blue Player</option>
                  </select>
                </div>

                <button
                  onClick={handleFlipToggle}
                  className={`btn-outline text-sm touch-target ${
                    isMirrored ? 'bg-primary-600 text-white' : ''
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  Flip
                </button>

                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`btn-outline text-sm touch-target ${
                    isAnimating ? 'bg-primary-600 text-white' : ''
                  }`}
                >
                  {isAnimating ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isAnimating ? 'Pause' : 'Animate'}
                </button>
              </div>

              {/* Rotation Slider */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={e => handleRotationChange(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="h-[400px] sm:h-[500px] md:h-[600px]">
              <StickFigure3D
                position={currentPosition}
                transition={currentTransition}
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Graph Controls */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setGraphMode('2d')}
              className={`p-2 rounded-lg touch-target ${
                graphMode === '2d'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGraphMode('3d')}
              className={`p-2 rounded-lg touch-target ${
                graphMode === '3d'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Box className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleZoomToFit}
            className="btn-outline text-sm touch-target"
          >
            Zoom to Fit
          </button>

          <button
            onClick={clearSelections}
            className="btn-outline text-sm touch-target"
          >
            Clear Selection
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {filteredNodesBySearch.length} positions •{' '}
          {filteredEdgesBySearch.length} techniques
        </div>
      </div>

      {/* Mobile Graph Controls */}
      {showMobileControls && (
        <div className="mobile-graph-controls">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Graph Controls</h3>
            <button
              onClick={() => setShowMobileControls(false)}
              className="text-gray-400 hover:text-gray-600 touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGraphMode('2d')}
              className={`p-3 rounded-lg text-sm font-medium touch-target ${
                graphMode === '2d'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Square className="w-4 h-4 mx-auto mb-1" />
              2D View
            </button>
            <button
              onClick={() => setGraphMode('3d')}
              className={`p-3 rounded-lg text-sm font-medium touch-target ${
                graphMode === '3d'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Box className="w-4 h-4 mx-auto mb-1" />
              3D View
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            <button
              onClick={handleZoomIn}
              className="p-3 rounded-lg bg-gray-200 text-gray-700 touch-target"
            >
              <ZoomIn className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={handleZoomToFit}
              className="p-3 rounded-lg bg-gray-200 text-gray-700 touch-target"
            >
              <RotateCcw className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-3 rounded-lg bg-gray-200 text-gray-700 touch-target"
            >
              <ZoomOut className="w-4 h-4 mx-auto" />
            </button>
          </div>

          <div className="mt-3">
            <button
              onClick={clearSelections}
              className="w-full p-3 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium touch-target"
            >
              Clear Selection
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-3">
            {filteredNodesBySearch.length} positions •{' '}
            {filteredEdgesBySearch.length} techniques
          </div>
        </div>
      )}

      {/* Path Finder Panel */}
      {showPathFinder && (
        <div className="card card-mobile">
          <PathFinder
            selectedNodes={selectedPathNodes}
            onNodeSelect={handleNodeSelect}
            onClearSelection={handleClearSelection}
            onFindPath={handleFindPath}
            onClearPath={handleClearPath}
            path={path}
            isPathfinding={isPathfinding}
          />
        </div>
      )}

      {/* Selection Panel */}
      {(selectedNode || selectedEdge) && (
        <div className="card card-mobile">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="mobile-text-lg font-semibold mb-2">
                {selectedNode ? selectedNode.name : selectedEdge.name}
              </h3>
              <p className="text-gray-600 mb-4 mobile-text-sm">
                {selectedNode
                  ? `Category: ${selectedNode.category} • Difficulty: ${selectedNode.difficulty} • Popularity: ${selectedNode.popularity}`
                  : `Type: ${selectedEdge.type} • From: ${selectedEdge.from} • To: ${selectedEdge.to} • Popularity: ${selectedEdge.popularity}`}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {selectedNode && (
                  <>
                    <Link
                      to={`/position/${selectedNode.id}`}
                      className="btn-primary flex items-center space-x-2 touch-target"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>

                    <button
                      onClick={() => handleNodeSelect(selectedNode.id, true)}
                      className="btn-outline touch-target"
                    >
                      Add to Path
                    </button>
                  </>
                )}

                {selectedEdge && (
                  <Link
                    to={`/technique/${selectedEdge.id}`}
                    className="btn-primary flex items-center space-x-2 touch-target"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                )}

                {isAuthenticated && (
                  <button className="btn-outline touch-target">Add Link</button>
                )}
              </div>
            </div>

            <button
              onClick={clearSelections}
              className="text-gray-400 hover:text-gray-600 touch-target self-start sm:self-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphExplorer3D;
