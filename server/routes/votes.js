const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const Vote = require("../models/Vote");
const Position = require("../models/Position");
const Technique = require("../models/Technique");
const Link = require("../models/Link");

// Vote on content (position, technique, or link)
router.post("/:targetType/:targetId", auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const { voteType } = req.body;
    const userId = req.user.id;

    // Validate vote type
    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Validate target type
    if (!["position", "technique", "link"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid target type" });
    }

    // Check if target exists
    let target;
    switch (targetType) {
      case "position":
        target = await Position.findById(targetId);
        break;
      case "technique":
        target = await Technique.findById(targetId);
        break;
      case "link":
        target = await Link.findById(targetId);
        break;
    }

    if (!target) {
      return res.status(404).json({ error: "Target not found" });
    }

    // Check if user already voted
    let existingVote = await Vote.findOne({
      user: userId,
      targetType,
      targetId,
    });

    if (existingVote) {
      // Toggle vote if same type, change if different
      if (existingVote.voteType === voteType) {
        await existingVote.remove();
      } else {
        existingVote.voteType = voteType;
        await existingVote.save();
      }
    } else {
      // Create new vote
      existingVote = new Vote({
        user: userId,
        targetType,
        targetId,
        targetModel: targetType.charAt(0).toUpperCase() + targetType.slice(1),
        voteType,
      });
      await existingVote.save();
    }

    // Update vote counts on target
    await target.updateVoteCounts();

    // Get updated vote summary
    const voteSummary = await Vote.getVoteSummary(targetType, targetId);
    const userVote = await Vote.getUserVote(userId, targetType, targetId);

    res.json({
      message: "Vote updated successfully",
      voteSummary,
      userVote: userVote ? userVote.voteType : null,
      target: {
        id: target._id,
        voteCount: target.voteCount,
        voteScore: target.voteScore,
      },
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get vote summary for content
router.get("/:targetType/:targetId", optionalAuth, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user?.id;

    // Validate target type
    if (!["position", "technique", "link"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid target type" });
    }

    // Get vote summary
    const voteSummary = await Vote.getVoteSummary(targetType, targetId);

    // Get user's vote if authenticated
    let userVote = null;
    if (userId) {
      const vote = await Vote.getUserVote(userId, targetType, targetId);
      userVote = vote ? vote.voteType : null;
    }

    res.json({
      voteSummary,
      userVote,
    });
  } catch (error) {
    console.error("Get vote summary error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's votes
router.get("/user/votes", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, targetType } = req.query;

    const query = { user: userId };
    if (targetType) {
      query.targetType = targetType;
    }

    const votes = await Vote.find(query)
      .populate("user", "username firstName lastName beltRank")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Vote.countDocuments(query);

    res.json({
      votes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalVotes: count,
    });
  } catch (error) {
    console.error("Get user votes error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get top voted content
router.get("/top/:targetType", async (req, res) => {
  try {
    const { targetType } = req.params;
    const { limit = 10 } = req.query;

    // Validate target type
    if (!["position", "technique", "link"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid target type" });
    }

    let topContent;
    switch (targetType) {
      case "position":
        topContent = await Position.getTopVoted(parseInt(limit));
        break;
      case "technique":
        topContent = await Technique.getTopVoted(parseInt(limit));
        break;
      case "link":
        topContent = await Link.getTopVoted(parseInt(limit));
        break;
    }

    res.json({
      topContent,
      targetType,
    });
  } catch (error) {
    console.error("Get top voted error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove user's vote
router.delete("/:targetType/:targetId", auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user.id;

    // Validate target type
    if (!["position", "technique", "link"].includes(targetType)) {
      return res.status(400).json({ error: "Invalid target type" });
    }

    // Find and remove vote
    const vote = await Vote.findOneAndDelete({
      user: userId,
      targetType,
      targetId,
    });

    if (!vote) {
      return res.status(404).json({ error: "Vote not found" });
    }

    // Update vote counts on target
    let target;
    switch (targetType) {
      case "position":
        target = await Position.findById(targetId);
        break;
      case "technique":
        target = await Technique.findById(targetId);
        break;
      case "link":
        target = await Link.findById(targetId);
        break;
    }

    if (target) {
      await target.updateVoteCounts();
    }

    res.json({
      message: "Vote removed successfully",
      target: target
        ? {
            id: target._id,
            voteCount: target.voteCount,
            voteScore: target.voteScore,
          }
        : null,
    });
  } catch (error) {
    console.error("Remove vote error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
