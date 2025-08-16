import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';

const GraphContext = createContext();

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};

export const GraphProvider = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [graphMode, setGraphMode] = useState('2d'); // '2d' or '3d'
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Fetch graph data
  const {
    data: graphData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['graph-data', filterCategory, filterDifficulty],
    async () => {
      const response = await api.get('/api/transitions/graph-data');
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Filter nodes based on category and difficulty
  const filteredNodes =
    graphData?.nodes?.filter(node => {
      if (filterCategory !== 'all' && node.category !== filterCategory) {
        return false;
      }
      if (filterDifficulty !== 'all' && node.difficulty !== filterDifficulty) {
        return false;
      }
      return true;
    }) || [];

  // Filter edges based on filtered nodes
  const filteredEdges =
    graphData?.edges?.filter(edge => {
      const fromNode = filteredNodes.find(n => n.id === edge.source);
      const toNode = filteredNodes.find(n => n.id === edge.target);
      return fromNode && toNode;
    }) || [];

  // Get node by ID
  const getNodeById = id => {
    return graphData?.nodes?.find(node => node.id === id);
  };

  // Get edge by ID
  const getEdgeById = id => {
    return graphData?.edges?.find(edge => edge.id === id);
  };

  // Get connected nodes
  const getConnectedNodes = nodeId => {
    const connectedEdges =
      graphData?.edges?.filter(
        edge => edge.source === nodeId || edge.target === nodeId
      ) || [];

    const connectedNodeIds = new Set();
    connectedEdges.forEach(edge => {
      if (edge.source !== nodeId) connectedNodeIds.add(edge.source);
      if (edge.target !== nodeId) connectedNodeIds.add(edge.target);
    });

    return (
      graphData?.nodes?.filter(node => connectedNodeIds.has(node.id)) || []
    );
  };

  // Get edges between two nodes
  const getEdgesBetween = (node1Id, node2Id) => {
    return (
      graphData?.edges?.filter(
        edge =>
          (edge.source === node1Id && edge.target === node2Id) ||
          (edge.source === node2Id && edge.target === node1Id)
      ) || []
    );
  };

  // Clear selections
  const clearSelections = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Set filters
  const setFilters = (category, difficulty) => {
    setFilterCategory(category);
    setFilterDifficulty(difficulty);
  };

  const value = {
    // Data
    graphData,
    filteredNodes,
    filteredEdges,
    selectedNode,
    selectedEdge,
    graphMode,
    filterCategory,
    filterDifficulty,

    // State
    isLoading,
    error,

    // Actions
    setSelectedNode,
    setSelectedEdge,
    setGraphMode,
    setFilters,
    clearSelections,
    refetch,

    // Utilities
    getNodeById,
    getEdgeById,
    getConnectedNodes,
    getEdgesBetween,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};
