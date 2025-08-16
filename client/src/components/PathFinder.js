import React, { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Target,
  Route,
  X,
  Play,
  MapPin,
  ArrowRight,
  Trash2,
  Info,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PathFinder = ({
  selectedNodes,
  onNodeSelect,
  onClearSelection,
  onFindPath,
  onClearPath,
  path,
  isPathfinding = false,
}) => {
  const { getThemeClass } = useTheme();
  const [showInfo, setShowInfo] = useState(false);

  const handleFindPath = useCallback(() => {
    if (selectedNodes.length < 2) {
      toast.error('Please select at least 2 positions to find a path');
      return;
    }
    onFindPath(selectedNodes);
  }, [selectedNodes, onFindPath]);

  const handleClearPath = useCallback(() => {
    onClearPath();
    toast.success('Path cleared');
  }, [onClearPath]);

  const handleClearSelection = useCallback(() => {
    onClearSelection();
    toast.success('Selection cleared');
  }, [onClearSelection]);

  const removeNode = useCallback(
    nodeId => {
      onNodeSelect(nodeId, false); // Deselect the node
    },
    [onNodeSelect]
  );

  const getPathDescription = () => {
    if (!path || path.length === 0) return '';

    const steps = path.length - 1;
    const positions = path.length;

    return `${positions} positions, ${steps} transitions`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Path Finder</h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-gray-600"
            title="Path Finder Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearSelection}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            title="Clear Selection"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Select multiple positions to design your BJJ game plan. The path
            finder will create the shortest route connecting all selected
            positions.
          </p>
        </div>
      )}

      {/* Selected Nodes */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Selected Positions ({selectedNodes.length})
          </span>
          {selectedNodes.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedNodes.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Click on positions to select them</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedNodes.map((node, index) => (
              <div
                key={node.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-500">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {node.name}
                  </span>
                </div>
                <button
                  onClick={() => removeNode(node.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove from selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Path Actions */}
      <div className="space-y-3">
        <button
          onClick={handleFindPath}
          disabled={selectedNodes.length < 2 || isPathfinding}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedNodes.length < 2 || isPathfinding
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {isPathfinding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Finding Path...</span>
            </>
          ) : (
            <>
              <Route className="w-4 h-4" />
              <span>Find Shortest Path</span>
            </>
          )}
        </button>

        {path && path.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Path Found
              </span>
              <button
                onClick={handleClearPath}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear Path
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Play className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Your Game Plan
                </span>
              </div>
              <p className="text-xs text-green-700 mb-3">
                {getPathDescription()}
              </p>

              <div className="space-y-2">
                {path.map((node, index) => (
                  <div key={node.id} className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <span className="text-sm text-green-800">{node.name}</span>
                    {index < path.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">How to use:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click on positions to select them</li>
              <li>Select at least 2 positions</li>
              <li>
                Click &quot;Find Shortest Path&quot; to create your game plan
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathFinder;
