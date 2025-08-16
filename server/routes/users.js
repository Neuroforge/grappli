const express = require("express");
const User = require("../models/User");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Get user profile by ID
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user by username
router.get("/username/:username", optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user by username error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Search users
router.get("/search/:query", optionalAuth, async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: req.params.query, $options: "i" } },
        { firstName: { $regex: req.params.query, $options: "i" } },
        { lastName: { $regex: req.params.query, $options: "i" } },
      ],
    })
      .select("-password")
      .sort({ contributionPoints: -1, joinDate: -1 })
      .limit(20);

    res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get top contributors
router.get("/top-contributors/:limit?", optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const users = await User.find()
      .select("-password")
      .sort({ contributionPoints: -1 })
      .limit(limit);

    res.json({ users });
  } catch (error) {
    console.error("Get top contributors error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get users by belt rank
router.get("/belt/:color", optionalAuth, async (req, res) => {
  try {
    const { stripe } = req.query;
    const query = { "beltRank.color": req.params.color };

    if (stripe !== undefined) {
      query["beltRank.stripe"] = parseInt(stripe);
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ contributionPoints: -1, joinDate: -1 });

    res.json({ users });
  } catch (error) {
    console.error("Get users by belt error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile (already handled in auth routes, but keeping for consistency)
router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName, bio, beltRank } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (bio !== undefined) updates.bio = bio;
    if (beltRank) updates.beltRank = beltRank;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        beltRank: user.beltRank,
        fullName: user.getFullName(),
        beltDisplay: user.getBeltDisplay(),
        profilePicture: user.profilePicture,
        bio: user.bio,
        contributionPoints: user.contributionPoints,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error updating profile" });
  }
});

// Get user statistics
router.get("/:id/stats", optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // You could add more statistics here like:
    // - Number of positions created
    // - Number of techniques created
    // - Number of links shared
    // - Average rating of their contributions

    res.json({
      stats: {
        contributionPoints: user.contributionPoints,
        joinDate: user.joinDate,
        beltRank: user.beltRank,
        beltDisplay: user.getBeltDisplay(),
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
