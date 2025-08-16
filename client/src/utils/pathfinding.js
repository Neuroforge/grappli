// Pathfinding algorithms for BJJ graph
// Implements Traveling Salesman Problem (TSP) approximation for finding shortest path through all selected nodes

/**
 * Calculate distance between two nodes (Euclidean distance)
 */
const calculateDistance = (node1, node2) => {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Find the shortest path between two nodes using Dijkstra's algorithm
 */
const findShortestPath = (graph, startId, endId) => {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialize distances
  Object.keys(graph).forEach(nodeId => {
    distances[nodeId] = Infinity;
    unvisited.add(nodeId);
  });
  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    }

    if (current === null || current === endId) break;

    unvisited.delete(current);

    // Update distances to neighbors
    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor)) {
        const distance = distances[current] + 1; // Assuming unit distance between connected nodes
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = current;
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = endId;
  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }

  return path.length > 1 ? path : null;
};

/**
 * Find optimal path through all selected nodes using Nearest Neighbor heuristic
 * This is an approximation of the Traveling Salesman Problem
 */
export const findOptimalPath = (graph, selectedNodes) => {
  if (selectedNodes.length < 2) {
    return selectedNodes;
  }

  // Convert to array of node objects with positions
  const nodes = selectedNodes.map(node => ({
    id: node.id,
    name: node.name,
    x: node.x || 0,
    y: node.y || 0,
  }));

  // Use Nearest Neighbor algorithm for TSP approximation
  const path = [];
  const unvisited = [...nodes];

  // Start with the first node
  let current = unvisited.shift();
  path.push(current);

  // Find nearest neighbor for each remaining node
  while (unvisited.length > 0) {
    let nearest = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      const distance = calculateDistance(current, node);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = node;
      }
    }

    if (nearest) {
      path.push(nearest);
      unvisited.splice(unvisited.indexOf(nearest), 1);
      current = nearest;
    }
  }

  return path;
};

/**
 * Find detailed path with intermediate nodes between selected positions
 */
export const findDetailedPath = (graph, selectedNodes, allNodes) => {
  const optimalOrder = findOptimalPath(graph, selectedNodes);
  const detailedPath = [];

  // For each pair of consecutive nodes, find the shortest path
  for (let i = 0; i < optimalOrder.length - 1; i++) {
    const startNode = optimalOrder[i];
    const endNode = optimalOrder[i + 1];

    // Find shortest path between these two nodes
    const segmentPath = findShortestPath(graph, startNode.id, endNode.id);

    if (segmentPath) {
      // Convert node IDs to node objects
      const segmentNodes = segmentPath.map(nodeId => {
        const node = allNodes.find(n => n.id === nodeId);
        return node || { id: nodeId, name: `Node ${nodeId}` };
      });

      // Add segment to detailed path (avoid duplicates)
      if (detailedPath.length === 0) {
        detailedPath.push(...segmentNodes);
      } else {
        // Add only the nodes that aren't already in the path
        const lastNodeId = detailedPath[detailedPath.length - 1].id;
        const newNodes = segmentNodes.filter(node => node.id !== lastNodeId);
        detailedPath.push(...newNodes);
      }
    }
  }

  return detailedPath;
};

/**
 * Calculate path statistics
 */
export const calculatePathStats = path => {
  if (!path || path.length < 2) {
    return {
      totalNodes: 0,
      totalTransitions: 0,
      estimatedTime: 0,
    };
  }

  const totalNodes = path.length;
  const totalTransitions = path.length - 1;
  const estimatedTime = totalTransitions * 2; // Assuming 2 minutes per transition

  return {
    totalNodes,
    totalTransitions,
    estimatedTime,
  };
};

/**
 * Validate if a path is feasible (all nodes are reachable)
 */
export const validatePath = (path, graph) => {
  if (!path || path.length < 2) return true;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    // Check if there's a direct connection or path between current and next
    const hasConnection =
      graph[current.id]?.includes(next.id) ||
      findShortestPath(graph, current.id, next.id);

    if (!hasConnection) {
      return false;
    }
  }

  return true;
};
