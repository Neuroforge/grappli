const express = require("express");
const router = express.Router();
const Transition = require("../models/Transition");
const Position = require("../models/Position");
const Technique = require("../models/Technique");
const { auth, optionalAuth } = require("../middleware/auth");

// Get all transitions for graph data
router.get("/graph-data", optionalAuth, async (req, res) => {
  try {
    const transitions = await Transition.getGraphData();

    // Transform data for graph visualization
    const nodes = new Map();
    const edges = [];

    transitions.forEach((transition) => {
      // Add from position
      if (!nodes.has(transition.fromPosition._id.toString())) {
        nodes.set(transition.fromPosition._id.toString(), {
          id: transition.fromPosition._id.toString(),
          name: transition.fromPosition.name,
          category: transition.fromPosition.category,
          difficulty: transition.fromPosition.difficulty,
          coordinates: transition.fromPosition.coordinates,
          advantage: "bottom", // Default, will be updated based on transitions
        });
      }

      // Add to position
      if (!nodes.has(transition.toPosition._id.toString())) {
        nodes.set(transition.toPosition._id.toString(), {
          id: transition.toPosition._id.toString(),
          name: transition.toPosition.name,
          category: transition.toPosition.category,
          difficulty: transition.toPosition.difficulty,
          coordinates: transition.toPosition.coordinates,
          advantage: "bottom", // Default, will be updated based on transitions
        });
      }

      // Add edge
      edges.push({
        id: transition._id.toString(),
        source: transition.fromPosition._id.toString(),
        target: transition.toPosition._id.toString(),
        type: transition.type,
        advantage: transition.advantage,
        description: transition.description,
        difficulty: transition.difficulty,
        technique: transition.technique,
        voteScore: transition.voteScore,
        createdBy: transition.createdBy,
      });
    });

    // Determine position advantage based on transitions
    nodes.forEach((node) => {
      const outgoingEdges = edges.filter((edge) => edge.source === node.id);
      const incomingEdges = edges.filter((edge) => edge.target === node.id);

      const topTransitions = outgoingEdges.filter(
        (edge) => edge.advantage === "top"
      ).length;
      const bottomTransitions = incomingEdges.filter(
        (edge) => edge.advantage === "top"
      ).length;

      // If more top transitions out than in, position is advantageous
      if (topTransitions > bottomTransitions) {
        node.advantage = "top";
      } else if (bottomTransitions > topTransitions) {
        node.advantage = "bottom";
      } else {
        node.advantage = "neutral";
      }
    });

    res.json({
      nodes: Array.from(nodes.values()),
      edges: edges,
    });
  } catch (error) {
    console.error("Error fetching transition graph data:", error);
    res.status(500).json({ error: "Failed to fetch transition data" });
  }
});

// Get transitions from a specific position
router.get("/from/:positionId", optionalAuth, async (req, res) => {
  try {
    const transitions = await Transition.getFromPosition(req.params.positionId);
    res.json(transitions);
  } catch (error) {
    console.error("Error fetching transitions from position:", error);
    res.status(500).json({ error: "Failed to fetch transitions" });
  }
});

// Get transitions to a specific position
router.get("/to/:positionId", optionalAuth, async (req, res) => {
  try {
    const transitions = await Transition.getToPosition(req.params.positionId);
    res.json(transitions);
  } catch (error) {
    console.error("Error fetching transitions to position:", error);
    res.status(500).json({ error: "Failed to fetch transitions" });
  }
});

// Create a new transition
router.post("/", auth, async (req, res) => {
  try {
    const {
      fromPositionId,
      toPositionId,
      type,
      advantage,
      description,
      difficulty,
      techniqueId,
      metadata,
    } = req.body;

    // Validate positions exist
    const fromPosition = await Position.findById(fromPositionId);
    const toPosition = await Position.findById(toPositionId);

    if (!fromPosition || !toPosition) {
      return res.status(404).json({ error: "One or both positions not found" });
    }

    // Check if transition already exists
    const existingTransition = await Transition.findOne({
      fromPosition: fromPositionId,
      toPosition: toPositionId,
    });

    if (existingTransition) {
      return res.status(400).json({ error: "Transition already exists" });
    }

    // Validate technique if provided
    if (techniqueId) {
      const technique = await Technique.findById(techniqueId);
      if (!technique) {
        return res.status(404).json({ error: "Technique not found" });
      }
    }

    const transition = new Transition({
      fromPosition: fromPositionId,
      toPosition: toPositionId,
      type,
      advantage,
      description,
      difficulty,
      technique: techniqueId,
      metadata,
      createdBy: req.user.id,
    });

    await transition.save();

    // Populate the saved transition
    await transition.populate([
      { path: "fromPosition", select: "name category difficulty" },
      { path: "toPosition", select: "name category difficulty" },
      { path: "technique", select: "name description" },
      { path: "createdBy", select: "username firstName lastName beltRank" },
    ]);

    res.status(201).json(transition);
  } catch (error) {
    console.error("Error creating transition:", error);
    res.status(500).json({ error: "Failed to create transition" });
  }
});

// Update a transition
router.put("/:id", auth, async (req, res) => {
  try {
    const transition = await Transition.findById(req.params.id);

    if (!transition) {
      return res.status(404).json({ error: "Transition not found" });
    }

    // Check if user is the creator or admin
    if (transition.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this transition" });
    }

    const updatedTransition = await Transition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate([
      { path: "fromPosition", select: "name category difficulty" },
      { path: "toPosition", select: "name category difficulty" },
      { path: "technique", select: "name description" },
      { path: "createdBy", select: "username firstName lastName beltRank" },
    ]);

    res.json(updatedTransition);
  } catch (error) {
    console.error("Error updating transition:", error);
    res.status(500).json({ error: "Failed to update transition" });
  }
});

// Delete a transition
router.delete("/:id", auth, async (req, res) => {
  try {
    const transition = await Transition.findById(req.params.id);

    if (!transition) {
      return res.status(404).json({ error: "Transition not found" });
    }

    // Check if user is the creator or admin
    if (transition.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this transition" });
    }

    await Transition.findByIdAndDelete(req.params.id);
    res.json({ message: "Transition deleted successfully" });
  } catch (error) {
    console.error("Error deleting transition:", error);
    res.status(500).json({ error: "Failed to delete transition" });
  }
});

// Get top voted transitions
router.get("/top-voted", optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transitions = await Transition.getTopVoted(limit);
    res.json(transitions);
  } catch (error) {
    console.error("Error fetching top voted transitions:", error);
    res.status(500).json({ error: "Failed to fetch top voted transitions" });
  }
});

module.exports = router;
