const express = require("express");
const Link = require("../models/Link");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Get all links
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      type,
      platform,
      targetType,
      targetId,
      limit = 50,
      page = 1,
    } = req.query;
    const query = { isActive: true, isVerified: true };

    if (type) query.type = type;
    if (platform) query.platform = platform;
    if (targetType) query.targetType = targetType;
    if (targetId) query.targetId = targetId;

    const links = await Link.find(query)
      .populate("createdBy", "username firstName lastName beltRank")
      .sort({ "rating.average": -1, "rating.count": -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      links,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Link.countDocuments(query),
      },
    });
  } catch (error) {
    console.error("Get links error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get link by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id).populate(
      "createdBy",
      "username firstName lastName beltRank"
    );

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json({ link });
  } catch (error) {
    console.error("Get link error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new link
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      url,
      description,
      type,
      platform,
      targetType,
      targetId,
      metadata,
    } = req.body;

    const link = new Link({
      title,
      url,
      description,
      type,
      platform,
      targetType,
      targetId,
      targetModel: targetType === "position" ? "Position" : "Technique",
      metadata,
      createdBy: req.user._id,
    });

    await link.save();

    // Add contribution points
    req.user.contributionPoints += 5;
    await req.user.save();

    res.status(201).json({
      message: "Link created successfully",
      link: await link.populate(
        "createdBy",
        "username firstName lastName beltRank"
      ),
    });
  } catch (error) {
    console.error("Create link error:", error);
    res.status(500).json({ error: "Server error creating link" });
  }
});

// Update link
router.put("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Only creator can update
    if (link.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this link" });
    }

    const updates = req.body;
    delete updates.createdBy; // Prevent changing creator

    const updatedLink = await Link.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username firstName lastName beltRank");

    res.json({
      message: "Link updated successfully",
      link: updatedLink,
    });
  } catch (error) {
    console.error("Update link error:", error);
    res.status(500).json({ error: "Server error updating link" });
  }
});

// Rate a link
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    await link.addRating(req.user._id, rating);

    res.json({
      message: "Rating added successfully",
      link: await link.populate(
        "createdBy",
        "username firstName lastName beltRank"
      ),
    });
  } catch (error) {
    console.error("Rate link error:", error);
    res.status(500).json({ error: "Server error rating link" });
  }
});

// Get user's rating for a link
router.get("/:id/rating", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    const userRating = link.getUserRating(req.user._id);

    res.json({ userRating });
  } catch (error) {
    console.error("Get user rating error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get links by target
router.get("/target/:targetType/:targetId", optionalAuth, async (req, res) => {
  try {
    const links = await Link.getByTarget(
      req.params.targetType,
      req.params.targetId
    );

    res.json({ links });
  } catch (error) {
    console.error("Get links by target error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get top rated links
router.get("/top-rated/:limit?", optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const links = await Link.getTopRated(limit);

    res.json({ links });
  } catch (error) {
    console.error("Get top rated links error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Search links
router.get("/search/:query", optionalAuth, async (req, res) => {
  try {
    const links = await Link.find(
      {
        $text: { $search: req.params.query },
        isActive: true,
        isVerified: true,
      },
      { score: { $meta: "textScore" } }
    )
      .populate("createdBy", "username firstName lastName beltRank")
      .sort({ score: { $meta: "textScore" } });

    res.json({ links });
  } catch (error) {
    console.error("Search links error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
