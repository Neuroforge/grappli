const mongoose = require("mongoose");

const transitionSchema = new mongoose.Schema(
  {
    fromPosition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    toPosition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "advance",
        "reversal",
        "escape",
        "sweep",
        "pass",
        "submission",
        "transition",
      ],
      required: true,
    },
    advantage: {
      type: String,
      enum: ["top", "bottom", "neutral"],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    technique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technique",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    frames: {
      type: [[[Number]]], // Array of frames, each frame is array of [x, y, z] coordinates for 23 joints
      default: [],
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

// Ensure unique transitions between positions
transitionSchema.index({ fromPosition: 1, toPosition: 1 }, { unique: true });

// Index for search functionality
transitionSchema.index({ description: "text" });

// Method to update vote counts
transitionSchema.methods.updateVoteCounts = function () {
  const Vote = mongoose.model("Vote");
  return Vote.getVoteSummary("transition", this._id).then((results) => {
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
transitionSchema.methods.getUserVote = function (userId) {
  const Vote = mongoose.model("Vote");
  return Vote.getUserVote(userId, "transition", this._id);
};

// Static method to get transitions from a position
transitionSchema.statics.getFromPosition = function (positionId) {
  return this.find({ fromPosition: positionId, isVerified: true })
    .populate("toPosition", "name category difficulty")
    .populate("technique", "name description")
    .populate("createdBy", "username firstName lastName beltRank")
    .sort({ voteScore: -1, difficulty: 1 });
};

// Static method to get transitions to a position
transitionSchema.statics.getToPosition = function (positionId) {
  return this.find({ toPosition: positionId, isVerified: true })
    .populate("fromPosition", "name category difficulty")
    .populate("technique", "name description")
    .populate("createdBy", "username firstName lastName beltRank")
    .sort({ voteScore: -1, difficulty: 1 });
};

// Static method to get all transitions for graph data
transitionSchema.statics.getGraphData = function () {
  return this.find({ isVerified: true })
    .populate("fromPosition", "name category difficulty coordinates")
    .populate("toPosition", "name category difficulty coordinates")
    .populate("technique", "name description")
    .populate("createdBy", "username firstName lastName beltRank");
};

// Static method to get top voted transitions
transitionSchema.statics.getTopVoted = function (limit = 10) {
  return this.find({ isVerified: true })
    .populate("fromPosition", "name category")
    .populate("toPosition", "name category")
    .populate("technique", "name")
    .populate("createdBy", "username firstName lastName beltRank")
    .sort({ voteScore: -1 })
    .limit(limit);
};

module.exports = mongoose.model("Transition", transitionSchema);
