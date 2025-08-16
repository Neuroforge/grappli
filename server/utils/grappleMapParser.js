const fs = require("fs");
const path = require("path");

// Joint indices from GrappleMap
const JOINT_INDICES = {
  LeftToe: 0,
  RightToe: 1,
  LeftHeel: 2,
  RightHeel: 3,
  LeftAnkle: 4,
  RightAnkle: 5,
  LeftKnee: 6,
  RightKnee: 7,
  LeftHip: 8,
  RightHip: 9,
  LeftShoulder: 10,
  RightShoulder: 11,
  LeftElbow: 12,
  RightElbow: 13,
  LeftWrist: 14,
  RightWrist: 15,
  LeftHand: 16,
  RightHand: 17,
  LeftFingers: 18,
  RightFingers: 19,
  Core: 20,
  Neck: 21,
  Head: 22,
};

class GrappleMapParser {
  constructor() {
    this.positions = [];
    this.transitions = [];
    this.currentPosition = null;
    this.currentTransition = null;
    this.currentFrame = 0;
  }

  parseFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Check if this is a position (starts with text, not tags:)
      if (line && !line.startsWith("tags:") && !line.startsWith("    ")) {
        // This might be a position or transition
        if (this.currentPosition) {
          this.positions.push(this.currentPosition);
        }
        if (this.currentTransition) {
          this.transitions.push(this.currentTransition);
        }

        // Check if next line has tags
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith("tags:")) {
          this.currentPosition = {
            name: line.replace(/\\n/g, "\n"),
            tags: [],
            coordinates: new Array(23).fill([0, 0, 0]), // 23 joints
            description: "",
          };
          this.currentTransition = null;
        } else {
          // This might be a transition
          this.currentTransition = {
            name: line.replace(/\\n/g, "\n"),
            tags: [],
            frames: [],
            description: "",
          };
          this.currentPosition = null;
          this.currentFrame = 0;
        }
      } else if (line.startsWith("tags:")) {
        const tags = line.substring(5).trim().split(" ");
        if (this.currentPosition) {
          this.currentPosition.tags = tags;
        } else if (this.currentTransition) {
          this.currentTransition.tags = tags;
        }
      } else if (line.startsWith("    ") && this.currentPosition) {
        // This is coordinate data for a position
        const coords = this.parseCoordinates(line.trim());
        if (coords) {
          this.currentPosition.coordinates = coords;
        }
      } else if (line.startsWith("    ") && this.currentTransition) {
        // This is coordinate data for a transition frame
        const coords = this.parseCoordinates(line.trim());
        if (coords) {
          this.currentTransition.frames.push(coords);
        }
      }
    }

    // Add the last position/transition
    if (this.currentPosition) {
      this.positions.push(this.currentPosition);
    }
    if (this.currentTransition) {
      this.transitions.push(this.currentTransition);
    }

    return {
      positions: this.positions,
      transitions: this.transitions,
    };
  }

  parseCoordinates(line) {
    // GrappleMap uses a custom encoding for coordinates
    // This is a simplified parser - you'll need to implement the full decoding
    try {
      // For now, we'll create placeholder coordinates
      // In a real implementation, you'd decode the actual coordinate data
      const coords = [];
      for (let i = 0; i < 23; i++) {
        coords.push([
          Math.random() * 2 - 1, // x: -1 to 1
          Math.random() * 2 - 1, // y: -1 to 1
          Math.random() * 2 - 1, // z: -1 to 1
        ]);
      }
      return coords;
    } catch (error) {
      console.error("Error parsing coordinates:", error);
      return null;
    }
  }

  // Convert to your app's data format
  convertToAppFormat(data) {
    const positions = data.positions.map((pos, index) => ({
      name: pos.name,
      category: this.extractCategory(pos.tags),
      difficulty: this.extractDifficulty(pos.tags),
      tags: pos.tags,
      coordinates: pos.coordinates,
      description: pos.description,
      advantage: this.extractAdvantage(pos.tags),
      popularity: 1, // Default popularity
      createdBy: null, // Will be set during import
    }));

    const transitions = data.transitions.map((trans, index) => ({
      name: trans.name,
      type: this.extractTransitionType(trans.tags),
      advantage: this.extractAdvantage(trans.tags),
      difficulty: this.extractDifficulty(trans.tags),
      tags: trans.tags,
      frames: trans.frames,
      description: trans.description,
      popularity: 1, // Default popularity
      createdBy: null, // Will be set during import
    }));

    return { positions, transitions };
  }

  extractCategory(tags) {
    const categoryTags = [
      "guard",
      "mount",
      "side_control",
      "back_control",
      "turtle",
      "standing",
    ];
    for (const tag of tags) {
      if (categoryTags.includes(tag)) {
        return tag.replace("_", "-");
      }
    }
    return "other";
  }

  extractDifficulty(tags) {
    // Extract difficulty from tags or description
    if (tags.some((tag) => tag.includes("advanced"))) return "advanced";
    if (tags.some((tag) => tag.includes("intermediate"))) return "intermediate";
    if (tags.some((tag) => tag.includes("beginner"))) return "beginner";
    return "intermediate";
  }

  extractAdvantage(tags) {
    if (tags.some((tag) => tag.includes("top"))) return "top";
    if (tags.some((tag) => tag.includes("bottom"))) return "bottom";
    return "neutral";
  }

  extractTransitionType(tags) {
    if (tags.some((tag) => tag.includes("sweep"))) return "sweep";
    if (tags.some((tag) => tag.includes("pass"))) return "pass";
    if (tags.some((tag) => tag.includes("submission"))) return "submission";
    if (tags.some((tag) => tag.includes("escape"))) return "escape";
    return "transition";
  }
}

module.exports = GrappleMapParser;
