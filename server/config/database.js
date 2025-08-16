const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/jiujitsu-knowledge",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);

    // Create text indexes for search functionality
    await mongoose.connection.db.collection("positions").createIndex({
      name: "text",
      description: "text",
      tags: "text",
    });

    await mongoose.connection.db.collection("techniques").createIndex({
      name: "text",
      description: "text",
      tags: "text",
    });

    await mongoose.connection.db.collection("links").createIndex({
      title: "text",
      description: "text",
    });
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
