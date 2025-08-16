/**
 * Jiujitsu Knowledge Platform - Position Model
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2025 Neuroforge
 */

const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: [
        "guard",
        "mount",
        "side-control",
        "back-control",
        "turtle",
        "standing",
        "other",
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    coordinates: {
      type: [[Number]], // Array of [x, y, z] coordinates for 23 joints
      default: Array(23).fill([0, 0, 0]),
    },
    metadata: {
      gi: { type: Boolean, default: true },
      noGi: { type: Boolean, default: true },
      competition: { type: Boolean, default: true },
      selfDefense: { type: Boolean, default: false },
    },
    // Vote-related fields
    voteCount: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
    voteScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
positionSchema.index({ name: "text", description: "text", tags: "text" });

// Virtual for full position info
positionSchema.virtual("fullInfo").get(function () {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    category: this.category,
    difficulty: this.difficulty,
    tags: this.tags,
    imageUrl: this.imageUrl,
    popularity: this.popularity,
    coordinates: this.coordinates,
    metadata: this.metadata,
    voteCount: this.voteCount,
    voteScore: this.voteScore,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

// Method to update popularity
positionSchema.methods.updatePopularity = function () {
  // This could be based on views, links, etc.
  this.popularity = this.popularity + 1;
  return this.save();
};

// Method to update vote counts
positionSchema.methods.updateVoteCounts = function () {
  const Vote = mongoose.model("Vote");
  return Vote.getVoteSummary("position", this._id).then((results) => {
    let upvotes = 0;
    let downvotes = 0;

    results.forEach((result) => {
      if (result._id === "upvote") {
        upvotes = result.count;
      } else if (result._id === "downvote") {
        downvotes = result.count;
      }
    });

    this.voteCount.upvotes = upvotes;
    this.voteCount.downvotes = downvotes;
    this.voteScore = upvotes - downvotes;
    return this.save();
  });
};

// Method to get user's vote
positionSchema.methods.getUserVote = function (userId) {
  const Vote = mongoose.model("Vote");
  return Vote.getUserVote(userId, "position", this._id);
};

// Static method to get positions by category
positionSchema.statics.getByCategory = function (category) {
  return this.find({ category, isVerified: true }).sort({
    voteScore: -1,
    popularity: -1,
  });
};

// Static method to search positions
positionSchema.statics.search = function (query) {
  return this.find(
    { $text: { $search: query }, isVerified: true },
    { score: { $meta: "textScore" } }
  ).sort({ voteScore: -1, score: { $meta: "textScore" } });
};

// Static method to get top voted positions
positionSchema.statics.getTopVoted = function (limit = 10) {
  return this.find({ isVerified: true }).sort({ voteScore: -1 }).limit(limit);
};

module.exports = mongoose.model("Position", positionSchema);
