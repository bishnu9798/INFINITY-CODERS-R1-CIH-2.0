# 🚀 INFINITY CODERS - Freelancer Marketplace Application

A modern full-stack freelancer marketplace application built with React, Node.js, Express, and MongoDB Atlas.

## 📁 Organized Project Structure

```
INFINITY-CODERS-R1-CIH-2.0/
├── 📚 docs/                           # All documentation files
│   ├── README.md                      # Main project documentation
│   ├── SETUP.md                       # Setup instructions
│   ├── COLLABORATIVE-DEVELOPMENT.md   # Collaborative development guide
│   ├── STARTUP-GUIDE.md               # Startup guide
│   ├── TROUBLESHOOTING.md             # Troubleshooting guide
│   └── APPLICATION_STATUS_MIGRATION_SUMMARY.md
├── 🔧 scripts/                        # All utility and management scripts
│   ├── batch/                         # Windows batch files for easy startup
│   │   ├── start-freelancer-market-place.bat
│   │   ├── stop-freelancer-market-place.bat
│   │   ├── check-system.bat
│   │   └── ...
│   ├── database/                      # Database utilities and migrations
│   │   └── reset-database.js
│   └── development/                   # Development utilities
│       ├── create-test-users.cjs
│       ├── final-status-check.js
│       └── sample-resume.txt
├── 🧪 tests/                          # All test files organized by type
│   ├── frontend/                      # Frontend HTML test files
│   │   ├── test-auth-frontend.html
│   │   ├── test-job-application.html
│   │   └── ...
│   ├── backend/                       # Backend-specific tests
│   ├── integration/                   # Integration test scripts
│   │   ├── test-complete-auth.js
│   │   └── ...
│   └── debug/                         # Debug and troubleshooting files
│       ├── debug-auth.html
│       └── ...
├── 💻 src/                            # Frontend source code
│   ├── components/                    # React components
│   │   ├── job.jsx                    # Job portal component
│   │   ├── LandingPage.jsx
│   │   └── ...
│   ├── services/                      # API service files
│   ├── utils/                         # Frontend utilities
│   ├── App.jsx                        # Main app component
│   └── main.jsx                       # Entry point
├── ⚙️ backend/                        # Backend server (organized)
│   ├── models/                        # MongoDB models
│   ├── routes/                        # API routes
│   ├── services/                      # Business logic services
│   ├── middleware/                    # Express middleware
│   ├── database/                      # Database connection
│   ├── uploads/                       # File uploads
│   ├── utils/                         # Backend utilities (organized)
│   │   ├── database/                  # Database utilities
│   │   ├── migration/                 # Database migrations
│   │   └── data-creation/             # Data creation scripts
│   ├── tests/                         # Backend tests (organized)
│   │   ├── unit/                      # Unit tests
│   │   └── debug/                     # Debug files
│   ├── alternative-servers/           # Alternative server implementations
│   ├── .env                          # Environment variables
│   ├── server.js                     # Main server file
│   └── package.json                  # Backend dependencies
├── 🌐 public/                         # Public static assets
├── 📋 Configuration Files (Root Level)
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── .gitignore                    # Git ignore rules
└── 🏠 index.html                      # Main HTML entry point
```

## 🌟 Benefits of This Organization

### ✅ Clear Separation of Concerns
- **Documentation**: All docs in one place (`docs/`)
- **Scripts**: Management and utility scripts organized by purpose (`scripts/`)
- **Tests**: All tests categorized by type and purpose (`tests/`)
- **Source Code**: Clean separation of frontend (`src/`) and backend (`backend/`)

### ✅ Easy Navigation
- Find files quickly by their purpose
- Logical grouping of related functionality
- Consistent naming conventions

### ✅ Better Maintainability
- Reduced clutter in root directory
- Easier to locate specific file types
- Better collaboration through organized structure

### ✅ Development Workflow
- Quick access to startup scripts in `scripts/batch/`
- Dedicated testing directories for different test types
- Organized backend utilities for database management

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v16 or higher
- **NPM**: v8 or higher
- **Internet Connection**: Required for shared MongoDB Atlas database

### Option 1: Use Batch Scripts (Windows)
```bash
# Navigate to project root
cd INFINITY-CODERS-R1-CIH-2.0

# Start the application
scripts/batch/start-freelancer-market-place.bat

# Check system status
scripts/batch/check-system.bat

# Stop the application
scripts/batch/stop-freelancer-market-place.bat
```

### Option 2: Manual Setup
```bash
# Clone the repository
git clone https://github.com/bishnu9798/INFINITY-CODERS-R1-CIH-2.0.git
cd INFINITY-CODERS-R1-CIH-2.0

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install

# Start both servers
npm run start:full
```

## 📚 Documentation

All documentation is now organized in the `docs/` directory:
- **[Main Documentation](docs/README.md)** - Detailed project information
- **[Setup Guide](docs/SETUP.md)** - Step-by-step setup instructions
- **[Collaborative Development](docs/COLLABORATIVE-DEVELOPMENT.md)** - Team development guide
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🧪 Testing

Tests are now organized by category:
- **Frontend Tests**: `tests/frontend/` - HTML-based UI tests
- **Integration Tests**: `tests/integration/` - JavaScript integration tests
- **Debug Tools**: `tests/debug/` - Debugging and diagnostic files

## 🔧 Scripts and Utilities

- **Batch Scripts**: `scripts/batch/` - Windows automation scripts
- **Database Tools**: `scripts/database/` - Database management utilities
- **Development Tools**: `scripts/development/` - Development utilities

## 🌐 Access URLs

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:3002/
- **Health Check**: http://localhost:3002/api/health

## 📞 Support

For detailed setup instructions and troubleshooting, check the documentation in the `docs/` directory or refer to the organized test files in the `tests/` directory.

**Happy coding! 🚀**