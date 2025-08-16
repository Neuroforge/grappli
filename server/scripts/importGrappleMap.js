const mongoose = require("mongoose");
const GrappleMapParser = require("../utils/grappleMapParser");
const Position = require("../models/Position");
const Transition = require("../models/Transition");
const Technique = require("../models/Technique");
const User = require("../models/User");
const path = require("path");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/jiujitsu-app"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const importGrappleMapData = async () => {
  try {
    console.log("Starting GrappleMap data import...");

    // Parse GrappleMap data
    const parser = new GrappleMapParser();
    const grappleMapPath = path.join(
      __dirname,
      "../../GrappleMap-master/GrappleMap.txt"
    );

    console.log("Parsing GrappleMap data...");
    const rawData = parser.parseFile(grappleMapPath);
    const appData = parser.convertToAppFormat(rawData);

    console.log(
      `Found ${appData.positions.length} positions and ${appData.transitions.length} transitions`
    );

    // Find or create admin user for ownership
    let adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log("Creating admin user for data ownership...");
      adminUser = new User({
        username: "grapplemap-admin",
        email: "admin@grapplemap.com",
        firstName: "GrappleMap",
        lastName: "Admin",
        isAdmin: true,
        beltRank: "black",
        yearsOfExperience: 10,
      });
      await adminUser.save();
    }

    // Import positions
    console.log("Importing positions...");
    const positionMap = new Map(); // To map GrappleMap IDs to MongoDB IDs

    for (const positionData of appData.positions) {
      try {
        // Check if position already exists
        let position = await Position.findOne({ name: positionData.name });

        if (!position) {
          position = new Position({
            ...positionData,
            createdBy: adminUser._id,
            coordinates: positionData.coordinates || [],
            tags: positionData.tags || [],
            popularity: positionData.popularity || 1,
          });
          await position.save();
          console.log(`Created position: ${position.name}`);
        } else {
          console.log(`Position already exists: ${position.name}`);
        }

        // Store mapping for transitions
        positionMap.set(positionData.name, position._id);
      } catch (error) {
        console.error(`Error importing position ${positionData.name}:`, error);
      }
    }

    // Import transitions
    console.log("Importing transitions...");
    let transitionCount = 0;

    for (const transitionData of appData.transitions) {
      try {
        // Find from and to positions
        const fromPosition = await Position.findOne({
          name: transitionData.fromPosition,
        });
        const toPosition = await Position.findOne({
          name: transitionData.toPosition,
        });

        if (!fromPosition || !toPosition) {
          console.log(
            `Skipping transition ${transitionData.name} - positions not found`
          );
          continue;
        }

        // Check if transition already exists
        const existingTransition = await Transition.findOne({
          fromPosition: fromPosition._id,
          toPosition: toPosition._id,
          name: transitionData.name,
        });

        if (!existingTransition) {
          const transition = new Transition({
            name: transitionData.name,
            fromPosition: fromPosition._id,
            toPosition: toPosition._id,
            type: transitionData.type,
            advantage: transitionData.advantage,
            difficulty: transitionData.difficulty,
            description: transitionData.description,
            tags: transitionData.tags || [],
            frames: transitionData.frames || [],
            popularity: transitionData.popularity || 1,
            createdBy: adminUser._id,
          });

          await transition.save();
          transitionCount++;
          console.log(`Created transition: ${transition.name}`);
        } else {
          console.log(`Transition already exists: ${transitionData.name}`);
        }
      } catch (error) {
        console.error(
          `Error importing transition ${transitionData.name}:`,
          error
        );
      }
    }

    console.log(
      `Import completed! Created ${transitionCount} new transitions.`
    );

    // Update graph data
    console.log("Updating graph data...");
    const positions = await Position.find().populate("createdBy", "username");
    const transitions = await Transition.find()
      .populate("fromPosition", "name category difficulty")
      .populate("toPosition", "name category difficulty")
      .populate("createdBy", "username");

    console.log(
      `Database now contains ${positions.length} positions and ${transitions.length} transitions`
    );
  } catch (error) {
    console.error("Import error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

// Run the import
if (require.main === module) {
  connectDB().then(() => {
    importGrappleMapData();
  });
}

module.exports = { importGrappleMapData };
