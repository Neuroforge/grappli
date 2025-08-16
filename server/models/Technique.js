const mongoose = require("mongoose");

const techniqueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: [
        "sweep",
        "submission",
        "transition",
        "escape",
        "takedown",
        "guard-pass",
      ],
      required: true,
    },
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
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
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
    videoUrl: {
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
    metadata: {
      gi: { type: Boolean, default: true },
      noGi: { type: Boolean, default: true },
      competition: { type: Boolean, default: true },
      selfDefense: { type: Boolean, default: false },
      requiresStrength: { type: Boolean, default: false },
      requiresFlexibility: { type: Boolean, default: false },
    },
    steps: [
      {
        order: { type: Number, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, default: "" },
      },
    ],
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
techniqueSchema.index({ name: "text", description: "text", tags: "text" });

// Virtual for full technique info
techniqueSchema.virtual("fullInfo").get(function () {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    type: this.type,
    fromPosition: this.fromPosition,
    toPosition: this.toPosition,
    difficulty: this.difficulty,
    successRate: this.successRate,
    tags: this.tags,
    imageUrl: this.imageUrl,
    videoUrl: this.videoUrl,
    popularity: this.popularity,
    metadata: this.metadata,
    steps: this.steps,
    voteCount: this.voteCount,
    voteScore: this.voteScore,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

// Method to update popularity
techniqueSchema.methods.updatePopularity = function () {
  this.popularity = this.popularity + 1;
  return this.save();
};

// Method to update vote counts
techniqueSchema.methods.updateVoteCounts = function () {
  const Vote = mongoose.model("Vote");
  return Vote.getVoteSummary("technique", this._id).then((results) => {
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
techniqueSchema.methods.getUserVote = function (userId) {
  const Vote = mongoose.model("Vote");
  return Vote.getUserVote(userId, "technique", this._id);
};

// Static method to get techniques by type
techniqueSchema.statics.getByType = function (type) {
  return this.find({ type, isVerified: true })
    .populate("fromPosition")
    .populate("toPosition")
    .sort({ voteScore: -1, popularity: -1 });
};

// Static method to get techniques between positions
techniqueSchema.statics.getBetweenPositions = function (
  fromPositionId,
  toPositionId
) {
  return this.find({
    fromPosition: fromPositionId,
    toPosition: toPositionId,
    isVerified: true,
  })
    .populate("fromPosition")
    .populate("toPosition")
    .sort({ voteScore: -1 });
};

// Static method to search techniques
techniqueSchema.statics.search = function (query) {
  return this.find(
    { $text: { $search: query }, isVerified: true },
    { score: { $meta: "textScore" } }
  )
    .populate("fromPosition")
    .populate("toPosition")
    .sort({ voteScore: -1, score: { $meta: "textScore" } });
};

// Static method to get top voted techniques
techniqueSchema.statics.getTopVoted = function (limit = 10) {
  return this.find({ isVerified: true })
    .populate("fromPosition")
    .populate("toPosition")
    .sort({ voteScore: -1 })
    .limit(limit);
};

module.exports = mongoose.model("Technique", techniqueSchema);
