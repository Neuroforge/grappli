const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["position", "technique", "link"],
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
      enum: ["Position", "Technique", "Link"],
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one vote per user per target
voteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

// Index for efficient queries
voteSchema.index({ targetType: 1, targetId: 1 });
voteSchema.index({ user: 1 });

// Static method to get vote summary for a target
voteSchema.statics.getVoteSummary = function (targetType, targetId) {
  return this.aggregate([
    {
      $match: {
        targetType,
        targetId: mongoose.Types.ObjectId(targetId),
      },
    },
    {
      $group: {
        _id: "$voteType",
        count: { $sum: 1 },
      },
    },
  ]);
};

// Static method to get user's vote for a target
voteSchema.statics.getUserVote = function (userId, targetType, targetId) {
  return this.findOne({
    user: userId,
    targetType,
    targetId,
  });
};

// Static method to get all votes for a target
voteSchema.statics.getTargetVotes = function (targetType, targetId) {
  return this.find({
    targetType,
    targetId,
  }).populate("user", "username firstName lastName beltRank");
};

// Method to toggle vote
voteSchema.methods.toggleVote = function (newVoteType) {
  if (this.voteType === newVoteType) {
    // Remove vote if same type
    return this.remove();
  } else {
    // Change vote type
    this.voteType = newVoteType;
    return this.save();
  }
};

module.exports = mongoose.model("Vote", voteSchema);
