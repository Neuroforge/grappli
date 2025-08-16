const express = require("express");
const Technique = require("../models/Technique");
const Position = require("../models/Position");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Get all techniques
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { type, difficulty, search, limit = 50, page = 1 } = req.query;
    const query = { isVerified: true };

    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    let techniques;
    if (search) {
      techniques = await Technique.search(search);
    } else {
      techniques = await Technique.find(query)
        .populate("fromPosition", "name category")
        .populate("toPosition", "name category")
        .populate("createdBy", "username firstName lastName beltRank")
        .sort({ popularity: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
    }

    res.json({
      techniques,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Technique.countDocuments(query),
      },
    });
  } catch (error) {
    console.error("Get techniques error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get technique by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const technique = await Technique.findById(req.params.id)
      .populate("fromPosition", "name category description")
      .populate("toPosition", "name category description")
      .populate("createdBy", "username firstName lastName beltRank");

    if (!technique) {
      return res.status(404).json({ error: "Technique not found" });
    }

    // Update popularity
    await technique.updatePopularity();

    res.json({ technique });
  } catch (error) {
    console.error("Get technique error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new technique
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      fromPosition,
      toPosition,
      difficulty,
      successRate,
      tags,
      imageUrl,
      videoUrl,
      metadata,
      steps,
    } = req.body;

    // Verify positions exist
    const fromPos = await Position.findById(fromPosition);
    const toPos = await Position.findById(toPosition);

    if (!fromPos || !toPos) {
      return res.status(400).json({ error: "Invalid position references" });
    }

    const technique = new Technique({
      name,
      description,
      type,
      fromPosition,
      toPosition,
      difficulty,
      successRate,
      tags: tags || [],
      imageUrl,
      videoUrl,
      metadata,
      steps: steps || [],
      createdBy: req.user._id,
    });

    await technique.save();

    // Add contribution points
    req.user.contributionPoints += 15;
    await req.user.save();

    res.status(201).json({
      message: "Technique created successfully",
      technique: await technique.populate([
        { path: "fromPosition", select: "name category" },
        { path: "toPosition", select: "name category" },
        { path: "createdBy", select: "username firstName lastName beltRank" },
      ]),
    });
  } catch (error) {
    console.error("Create technique error:", error);
    res.status(500).json({ error: "Server error creating technique" });
  }
});

// Update technique
router.put("/:id", auth, async (req, res) => {
  try {
    const technique = await Technique.findById(req.params.id);

    if (!technique) {
      return res.status(404).json({ error: "Technique not found" });
    }

    // Only creator can update
    if (technique.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this technique" });
    }

    const updates = req.body;
    delete updates.createdBy; // Prevent changing creator

    const updatedTechnique = await Technique.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: "fromPosition", select: "name category" },
      { path: "toPosition", select: "name category" },
      { path: "createdBy", select: "username firstName lastName beltRank" },
    ]);

    res.json({
      message: "Technique updated successfully",
      technique: updatedTechnique,
    });
  } catch (error) {
    console.error("Update technique error:", error);
    res.status(500).json({ error: "Server error updating technique" });
  }
});

// Get techniques by type
router.get("/type/:type", optionalAuth, async (req, res) => {
  try {
    const techniques = await Technique.getByType(req.params.type);

    res.json({ techniques });
  } catch (error) {
    console.error("Get techniques by type error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get techniques between positions
router.get(
  "/between/:fromPosition/:toPosition",
  optionalAuth,
  async (req, res) => {
    try {
      const techniques = await Technique.getBetweenPositions(
        req.params.fromPosition,
        req.params.toPosition
      );

      res.json({ techniques });
    } catch (error) {
      console.error("Get techniques between positions error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Search techniques
router.get("/search/:query", optionalAuth, async (req, res) => {
  try {
    const techniques = await Technique.search(req.params.query);

    res.json({ techniques });
  } catch (error) {
    console.error("Search techniques error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get path between positions
router.get(
  "/path/:fromPosition/:toPosition",
  optionalAuth,
  async (req, res) => {
    try {
      const { fromPosition, toPosition } = req.params;
      const maxDepth = parseInt(req.query.maxDepth) || 3;

      // Simple path finding - direct connections first
      const directTechniques = await Technique.find({
        fromPosition,
        toPosition,
        isVerified: true,
      }).populate("fromPosition toPosition createdBy");

      if (directTechniques.length > 0) {
        return res.json({
          path: directTechniques,
          type: "direct",
        });
      }

      // For more complex path finding, you might want to implement a graph algorithm
      // This is a simplified version
      res.json({
        path: [],
        type: "none",
        message:
          "No direct path found. Consider adding intermediate techniques.",
      });
    } catch (error) {
      console.error("Get path error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
