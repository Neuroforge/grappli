const express = require("express");
const Position = require("../models/Position");
const Technique = require("../models/Technique");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Get all positions
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, search, limit = 50, page = 1 } = req.query;
    const query = { isVerified: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    let positions;
    if (search) {
      positions = await Position.search(search);
    } else {
      positions = await Position.find(query)
        .populate("createdBy", "username firstName lastName beltRank")
        .sort({ popularity: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
    }

    res.json({
      positions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Position.countDocuments(query),
      },
    });
  } catch (error) {
    console.error("Get positions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get position by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id).populate(
      "createdBy",
      "username firstName lastName beltRank"
    );

    if (!position) {
      return res.status(404).json({ error: "Position not found" });
    }

    // Update popularity
    await position.updatePopularity();

    // Get related techniques
    const techniques = await Technique.find({
      $or: [{ fromPosition: position._id }, { toPosition: position._id }],
      isVerified: true,
    })
      .populate("fromPosition", "name category")
      .populate("toPosition", "name category")
      .populate("createdBy", "username firstName lastName beltRank")
      .sort({ popularity: -1 });

    res.json({
      position,
      techniques,
    });
  } catch (error) {
    console.error("Get position error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new position
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      tags,
      imageUrl,
      coordinates,
      metadata,
    } = req.body;

    const position = new Position({
      name,
      description,
      category,
      difficulty,
      tags: tags || [],
      imageUrl,
      coordinates,
      metadata,
      createdBy: req.user._id,
    });

    await position.save();

    // Add contribution points
    req.user.contributionPoints += 10;
    await req.user.save();

    res.status(201).json({
      message: "Position created successfully",
      position: await position.populate(
        "createdBy",
        "username firstName lastName beltRank"
      ),
    });
  } catch (error) {
    console.error("Create position error:", error);
    res.status(500).json({ error: "Server error creating position" });
  }
});

// Update position
router.put("/:id", auth, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({ error: "Position not found" });
    }

    // Only creator or admin can update
    if (position.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this position" });
    }

    const updates = req.body;
    delete updates.createdBy; // Prevent changing creator

    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate("createdBy", "username firstName lastName beltRank");

    res.json({
      message: "Position updated successfully",
      position: updatedPosition,
    });
  } catch (error) {
    console.error("Update position error:", error);
    res.status(500).json({ error: "Server error updating position" });
  }
});

// Get positions by category
router.get("/category/:category", optionalAuth, async (req, res) => {
  try {
    const positions = await Position.getByCategory(
      req.params.category
    ).populate("createdBy", "username firstName lastName beltRank");

    res.json({ positions });
  } catch (error) {
    console.error("Get positions by category error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Search positions
router.get("/search/:query", optionalAuth, async (req, res) => {
  try {
    const positions = await Position.search(req.params.query).populate(
      "createdBy",
      "username firstName lastName beltRank"
    );

    res.json({ positions });
  } catch (error) {
    console.error("Search positions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get graph data for visualization
router.get("/graph/data", optionalAuth, async (req, res) => {
  try {
    const positions = await Position.find({ isVerified: true }).select(
      "name category coordinates popularity"
    );

    const techniques = await Technique.find({ isVerified: true })
      .populate("fromPosition", "name")
      .populate("toPosition", "name")
      .select("name type fromPosition toPosition popularity");

    const nodes = positions.map((pos) => ({
      id: pos._id,
      name: pos.name,
      category: pos.category,
      coordinates: pos.coordinates,
      popularity: pos.popularity,
      type: "position",
    }));

    const edges = techniques.map((tech) => ({
      id: tech._id,
      name: tech.name,
      type: tech.type,
      from: tech.fromPosition._id,
      to: tech.toPosition._id,
      popularity: tech.popularity,
    }));

    res.json({
      nodes,
      edges,
    });
  } catch (error) {
    console.error("Get graph data error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
