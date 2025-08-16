# Jiujitsu Knowledge Platform

A community-driven platform for learning and sharing Brazilian Jiu-Jitsu (BJJ) techniques through an interactive knowledge graph with voting system.

## 🌟 Features

- **Interactive Graph Explorer**: Visualize BJJ positions and techniques in 2D/3D with 3D stick figure visualization
- **Community Voting System**: Upvote/downvote content to surface the best information
- **Advanced Search**: Search through positions, techniques, and instructional resources
- **User Profiles**: Belt rank system with contribution tracking
- **Rating System**: Community-rated instructional links and resources
- **Mobile Responsive**: Optimized for all devices with touch-friendly interactions
- **Real-time Updates**: Live graph updates and community contributions

## 🏗️ Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers

### Frontend

- **React** with hooks and context
- **React Router** for navigation
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Force Graph** for 3D/2D graph visualization
- **Babylon.js** for 3D stick figure rendering
- **Lucide React** for icons

## 🚀 Quick Start Guide

### Prerequisites

**Required Software:**

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or MongoDB Atlas account)

**Check if you have Node.js installed:**

```bash
node --version
npm --version
```

**If Node.js is not installed:**

- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **macOS**: Install via [Homebrew](https://brew.sh/) - `brew install node`
- **Linux**: `sudo apt install nodejs npm` (Ubuntu/Debian) or `sudo dnf install nodejs` (Fedora)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd JiuJitsuApp

# Verify you're in the right directory
ls
# You should see: client/ server/ package.json README.md
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root directory
cd ..
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB (Recommended for Development)**

**Windows:**

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Create data directory: `mkdir C:\data\db`
4. Start MongoDB: `mongod`

**macOS:**

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**

```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Use connection string in `.env` file

### Step 4: Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your favorite editor
# Windows: notepad .env
# macOS/Linux: nano .env or code .env
```

**Edit `.env` file with these settings:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (choose one)
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/jiujitsu-knowledge

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jiujitsu-knowledge

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL
CLIENT_URL=http://localhost:3000
```

### Step 5: Start Development Servers

**Option A: Start Both Servers at Once (Recommended)**

```bash
# From the root directory
npm run dev
```

**Option B: Start Servers Separately**

```bash
# Terminal 1 - Start server (port 5000)
cd server
npm start

# Terminal 2 - Start client (port 3000)
cd client
npm start
```

### Step 6: Import GrappleMap Data (Optional)

To enable 3D visualization with stick figures, you can import the GrappleMap database:

```bash
# From the root directory
cd server
node scripts/importGrappleMap.js
```

This will import positions and transitions from the GrappleMap project into your database.

### Step 7: Open Your Browser

```
http://localhost:3000
```

**You should see the Jiujitsu Knowledge homepage! 🎉**

**For 3D visualization, visit:** `http://localhost:3000/explorer-3d`

## 🔧 Troubleshooting

### Common Issues

**"Port 3000 is already in use"**

```bash
# Find what's using port 3000
# Windows:
netstat -ano | findstr :3000

# macOS/Linux:
lsof -i :3000

# Kill the process or use a different port
```

**"MongoDB connection failed"**

- Make sure MongoDB is running
- Check your connection string in `.env`
- For local MongoDB: `mongod` should be running
- For Atlas: Check your IP whitelist

**"Module not found" errors**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Do this for both client and server directories
```

**"Permission denied" (Linux/macOS)**

```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Platform-Specific Notes

**Windows:**

- Use PowerShell or Command Prompt
- Install [Git for Windows](https://git-scm.com/download/win) if needed
- MongoDB installer creates service automatically

**macOS:**

- Install [Homebrew](https://brew.sh/) first: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- Use Terminal or iTerm2

**Linux:**

- Use your preferred terminal
- Install build tools: `sudo apt install build-essential` (Ubuntu/Debian)

## 📁 Project Structure

```
JiuJitsuApp/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── middleware/        # Authentication middleware
│   ├── models/           # MongoDB schemas (including Vote model)
│   ├── routes/           # API routes (including votes.js)
│   └── index.js          # Server entry point
├── client/                # Frontend React app
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components (including VoteButton)
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components (including TopVoted)
│   │   ├── services/     # API services
│   │   └── index.js      # App entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🎯 Core Features

### GrappleMap Integration

- **3D Stick Figure Visualization**: Render BJJ positions using 23-joint stick figures
- **Position Database**: Import and display GrappleMap's extensive position database
- **Transition Animations**: Animate between positions with frame-by-frame transitions
- **3D Camera Controls**: Rotate, mirror, and navigate the 3D view
- **Hybrid 2D/3D Interface**: Combine graph navigation with 3D visualization

### Voting System

- **Upvote/Downvote**: Vote on positions, techniques, and links
- **Vote Scores**: See vote counts and scores on all content
- **Top Voted**: Discover the most voted content
- **Community Curation**: Help surface the best BJJ information

### Graph Explorer

- Interactive 2D/3D visualization of BJJ positions and techniques
- 3D stick figure rendering with Babylon.js
- Filter by category, difficulty, and search terms
- Click on nodes/edges to view details
- Mobile-optimized controls
- 3D camera controls (rotation, mirroring, animation)

### User Authentication

- JWT-based authentication
- User registration with belt rank selection
- Profile management with contribution tracking
- Secure password hashing

### Content Management

- Create and edit positions and techniques
- Add instructional links with ratings
- Community verification system
- Contribution points tracking

### Search & Discovery

- Advanced search across positions, techniques, and links
- Filter by multiple criteria
- Real-time search results
- Vote-based sorting

## 🎨 UI Components

### Belt Rank System

- Visual belt colors (White, Blue, Purple, Brown, Black)
- Stripe indicators
- Belt rank display throughout the app

### Graph Visualization

- Force-directed graph layout
- Color-coded nodes by category
- Thickness-based edge popularity
- Interactive selection and navigation

### Mobile Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Responsive layouts
- Mobile-optimized voting buttons

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Security headers with Helmet
- Input validation and sanitization

## 🚀 Deployment

### Production Build

1. **Build the client**

   ```bash
   cd client
   npm run build
   ```

2. **Set production environment variables**

   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   CLIENT_URL=https://your-domain.com
   ```

3. **Deploy to your preferred platform**
   - Heroku
   - Vercel
   - AWS
   - DigitalOcean

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jiujitsu-knowledge
JWT_SECRET=your-very-secure-jwt-secret
CLIENT_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ☕ Support

If you find this project helpful, consider buying us a coffee:

[Buy Me a Coffee](https://www.buymeacoffee.com/jiujitsuknowledge)

## 🙏 Acknowledgments

### GrappleMap Project

This project would not be possible without the incredible work of **Eelis** and the **GrappleMap project**. GrappleMap is a comprehensive database of interconnected grappling positions and transitions, animated with stick figures, that has been released into the public domain.

**Special thanks to:**

- **[Eelis](https://github.com/Eelis)** - Creator of GrappleMap
- **[GrappleMap GitHub Repository](https://github.com/Eelis/GrappleMap)** - Open source project
- **[GrappleMap Website](https://eelis.net/GrappleMap/index.html)** - Original interactive explorer

Our 3D visualization and position data is directly inspired by and built upon GrappleMap's work. We are grateful for this incredible resource that has helped make BJJ more accessible to practitioners worldwide.

### Other Acknowledgments

- The BJJ community for inspiration
- Open source contributors
- All the amazing BJJ instructors and practitioners

---

**Built with ❤️ for the BJJ community**
