const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// Google OAuth
router.get("/google", (req, res) => {
  // Redirect to Google OAuth
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline`;

  res.redirect(googleAuthUrl);
});

// Google OAuth callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?error=No authorization code`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?error=${tokenData.error}`
      );
    }

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    // Find or create user
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = new User({
        username: userData.email.split("@")[0],
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for OAuth users
        beltColor: "white",
        beltStripe: 0,
        isEmailVerified: true,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?error=Authentication failed`
    );
  }
});

// Twitter OAuth
router.get("/twitter", (req, res) => {
  // Redirect to Twitter OAuth
  const twitterAuthUrl =
    `https://api.twitter.com/oauth/authorize?` +
    `oauth_token=${process.env.TWITTER_OAUTH_TOKEN}&` +
    `oauth_callback=${process.env.TWITTER_REDIRECT_URI}`;

  res.redirect(twitterAuthUrl);
});

// Twitter OAuth callback
router.get("/twitter/callback", async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;

    if (!oauth_token || !oauth_verifier) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?error=Missing OAuth parameters`
      );
    }

    // Exchange for access token
    const tokenResponse = await fetch(
      "https://api.twitter.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          oauth_token,
          oauth_verifier,
          oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
          oauth_consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        }),
      }
    );

    const tokenData = await tokenResponse.text();
    const params = new URLSearchParams(tokenData);

    // Get user info from Twitter
    const userResponse = await fetch(`https://api.twitter.com/2/users/me`, {
      headers: {
        Authorization: `Bearer ${params.get("oauth_token")}`,
      },
    });

    const userData = await userResponse.json();

    // Find or create user
    let user = await User.findOne({
      email: `${userData.data.username}@twitter.com`,
    });

    if (!user) {
      user = new User({
        username: userData.data.username,
        email: `${userData.data.username}@twitter.com`,
        firstName: userData.data.name?.split(" ")[0] || userData.data.username,
        lastName: userData.data.name?.split(" ").slice(1).join(" ") || "",
        password: await bcrypt.hash(Math.random().toString(36), 10),
        beltColor: "white",
        beltStripe: 0,
        isEmailVerified: true,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("Twitter OAuth error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?error=Authentication failed`
    );
  }
});

// Instagram OAuth
router.get("/instagram", (req, res) => {
  // Redirect to Instagram OAuth
  const instagramAuthUrl =
    `https://api.instagram.com/oauth/authorize?` +
    `client_id=${process.env.INSTAGRAM_CLIENT_ID}&` +
    `redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=user_profile,user_media`;

  res.redirect(instagramAuthUrl);
});

// Instagram OAuth callback
router.get("/instagram/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?error=No authorization code`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?error=${tokenData.error}`
      );
    }

    // Get user info from Instagram
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenData.access_token}`
    );
    const userData = await userResponse.json();

    // Find or create user
    let user = await User.findOne({
      email: `${userData.username}@instagram.com`,
    });

    if (!user) {
      user = new User({
        username: userData.username,
        email: `${userData.username}@instagram.com`,
        firstName: userData.username,
        lastName: "",
        password: await bcrypt.hash(Math.random().toString(36), 10),
        beltColor: "white",
        beltStripe: 0,
        isEmailVerified: true,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("Instagram OAuth error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?error=Authentication failed`
    );
  }
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, beltRank } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email or username already exists",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      beltRank: beltRank || { color: "white", stripe: 0 },
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        beltRank: user.beltRank,
        fullName: user.getFullName(),
        beltDisplay: user.getBeltDisplay(),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
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
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        beltRank: req.user.beltRank,
        fullName: req.user.getFullName(),
        beltDisplay: req.user.getBeltDisplay(),
        profilePicture: req.user.profilePicture,
        bio: req.user.bio,
        contributionPoints: req.user.contributionPoints,
        joinDate: req.user.joinDate,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
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

// Change password
router.put("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error changing password" });
  }
});

module.exports = router;
