const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    beltRank: {
      color: {
        type: String,
        enum: ["white", "blue", "purple", "brown", "black"],
        default: "white",
      },
      stripe: {
        type: Number,
        min: 0,
        max: 4,
        default: 0,
      },
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    contributionPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

// Method to get belt display
userSchema.methods.getBeltDisplay = function () {
  const stripeText =
    this.beltRank.stripe > 0
      ? ` (${this.beltRank.stripe} stripe${
          this.beltRank.stripe > 1 ? "s" : ""
        })`
      : "";
  return `${
    this.beltRank.color.charAt(0).toUpperCase() + this.beltRank.color.slice(1)
  } Belt${stripeText}`;
};

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return this.getFullName();
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
