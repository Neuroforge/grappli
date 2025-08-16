#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Setting up Jiujitsu Knowledge Platform...\n");

// Check if Node.js version is sufficient
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
if (majorVersion < 16) {
  console.error(
    "❌ Node.js version 16 or higher is required. Current version:",
    nodeVersion
  );
  process.exit(1);
}

console.log("✅ Node.js version check passed:", nodeVersion);

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env file...");
  const envExample = fs.readFileSync(
    path.join(__dirname, "env.example"),
    "utf8"
  );
  fs.writeFileSync(envPath, envExample);
  console.log("✅ .env file created from template");
} else {
  console.log("✅ .env file already exists");
}

// Install dependencies
console.log("\n📦 Installing dependencies...");

try {
  // Install root dependencies
  console.log("Installing root dependencies...");
  execSync("npm install", { stdio: "inherit" });

  // Install server dependencies
  console.log("Installing server dependencies...");
  execSync("npm install", {
    stdio: "inherit",
    cwd: path.join(__dirname, "server"),
  });

  // Install client dependencies
  console.log("Installing client dependencies...");
  execSync("npm install", {
    stdio: "inherit",
    cwd: path.join(__dirname, "client"),
  });

  console.log("✅ All dependencies installed successfully");
} catch (error) {
  console.error("❌ Error installing dependencies:", error.message);
  process.exit(1);
}

console.log("\n🎉 Setup completed successfully!");
console.log("\n📋 Next steps:");
console.log("1. Make sure MongoDB is running");
console.log("2. Update the .env file with your configuration");
console.log('3. Run "npm run dev" to start the development servers');
console.log("4. Open http://localhost:3000 in your browser");
console.log("\n📚 For more information, see the README.md file");
