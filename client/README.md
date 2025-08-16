# Jiu Jitsu App - Client

A React application for exploring Brazilian Jiu Jitsu positions, techniques, and instructional content.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Available Scripts

#### Development

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

#### Code Quality

```bash
npm run lint       # Run ESLint to check for code issues
npm run lint:fix   # Run ESLint and automatically fix issues
npm run format     # Format code with Prettier
npm run format:check # Check if code is properly formatted
```

## Code Quality Tools

### ESLint

- **Configuration**: `.eslintrc.js`
- **Rules**: React, React Hooks, and Prettier integration
- **Auto-fix**: Available for most formatting issues

### Prettier

- **Configuration**: `.prettierrc`
- **Ignore**: `.prettierignore`
- **Formatting**: Automatic code formatting with consistent style

### Code Style

- Single quotes for strings
- Semicolons required
- 80 character line width
- 2 space indentation
- Trailing commas in objects and arrays

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, Graph)
├── pages/          # Page components
├── services/       # API services
└── index.css       # Global styles
```

## Features

- Interactive graph visualization of BJJ positions and techniques
- Advanced search with filtering
- User authentication and profiles
- Community-driven content with voting
- Responsive design for mobile and desktop
