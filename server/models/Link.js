const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "video",
        "article",
        "instructional",
        "social-media",
        "competition",
        "other",
      ],
      required: true,
    },
    platform: {
      type: String,
      enum: [
        "youtube",
        "instagram",
        "facebook",
        "twitter",
        "bjjfanatics",
        "flograppling",
        "other",
      ],
      default: "other",
    },
    targetType: {
      type: String,
      enum: ["position", "technique"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Position", "Technique"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      votes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rating: {
            type: Number,
            min: 1,
            max: 5,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      duration: { type: String, default: "" },
      instructor: { type: String, default: "" },
      language: { type: String, default: "English" },
      quality: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
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
linkSchema.index({ title: "text", description: "text" });

// Method to add rating
linkSchema.methods.addRating = function (userId, rating) {
  // Remove existing rating from this user
  this.rating.votes = this.rating.votes.filter(
    (vote) => vote.user.toString() !== userId.toString()
  );

  // Add new rating
  this.rating.votes.push({ user: userId, rating });

  // Calculate new average
  const totalRating = this.rating.votes.reduce(
    (sum, vote) => sum + vote.rating,
    0
  );
  this.rating.average = totalRating / this.rating.votes.length;
  this.rating.count = this.rating.votes.length;

  return this.save();
};

// Method to get rating from user
linkSchema.methods.getUserRating = function (userId) {
  const vote = this.rating.votes.find(
    (vote) => vote.user.toString() === userId.toString()
  );
  return vote ? vote.rating : null;
};

// Method to update vote counts
linkSchema.methods.updateVoteCounts = function () {
  const Vote = mongoose.model("Vote");
  return Vote.getVoteSummary("link", this._id).then((results) => {
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
linkSchema.methods.getUserVote = function (userId) {
  const Vote = mongoose.model("Vote");
  return Vote.getUserVote(userId, "link", this._id);
};

// Static method to get links by target
linkSchema.statics.getByTarget = function (targetType, targetId) {
  return this.find({
    targetType,
    targetId,
    isActive: true,
    isVerified: true,
  })
    .populate("createdBy", "username firstName lastName beltRank")
    .sort({ voteScore: -1, "rating.average": -1, "rating.count": -1 });
};

// Static method to get top rated links
linkSchema.statics.getTopRated = function (limit = 10) {
  return this.find({
    isActive: true,
    isVerified: true,
    "rating.count": { $gte: 3 },
  })
    .populate("createdBy", "username firstName lastName beltRank")
    .sort({ voteScore: -1, "rating.average": -1, "rating.count": -1 })
    .limit(limit);
};

// Static method to get top voted links
linkSchema.statics.getTopVoted = function (limit = 10) {
  return this.find({
    isActive: true,
    isVerified: true,
  })
    .populate("createdBy", "username firstName lastName beltRank")
    .sort({ voteScore: -1 })
    .limit(limit);
};

module.exports = mongoose.model("Link", linkSchema);
