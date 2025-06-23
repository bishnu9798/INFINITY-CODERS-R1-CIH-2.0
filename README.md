# INFINITY-CODERS-R1-CIH-2.0
## CENTRAL INDIA HACKATHON 2.0

# 🚀 Freelancer-market-place Application

A full-stack freelancer marketplace application built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### 🎯 Landing Page Experience
- **Modern Design**: Beautiful, responsive landing page with gradient animations
- **Interactive Demo**: Live preview of job seeker and recruiter workflows
- **Social Proof**: Company logos, user testimonials, and live activity feed
- **Animated Elements**: Counters, typing animations, and smooth transitions
- **Pricing Information**: Transparent pricing tiers for all user types
- **Newsletter Signup**: Stay updated with platform news and opportunities
- **FAQ Section**: Comprehensive answers to common questions
- **Mobile Optimized**: Perfect experience across all devices

### 👨‍💻 For Job Seekers
- **User Authentication**: Secure login/register with JWT tokens
- **Profile Management**: Create comprehensive professional profiles
- **Job Search & Filtering**: Advanced search with multiple criteria
- **Smart Matching**: AI-powered job recommendations based on skills
- **Application System**: Apply for jobs with resume upload
- **Application Tracking**: Monitor status and history of applications
- **Real-time Updates**: Live notifications and data synchronization

### 👔 For Recruiters
- **Company Registration**: Create detailed company profiles
- **Job Management**: Post, edit, delete, and manage job listings
- **Candidate Management**: View and manage job applications
- **Application Review**: Review candidate profiles and resumes
- **Hiring Workflow**: Streamlined hiring process management
- **Analytics Dashboard**: Track hiring metrics and performance
- **Team Collaboration**: Multi-user company accounts

### 🔧 Technical Features
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization with MongoDB Atlas
- **Secure Authentication**: JWT-based authentication system
- **File Upload**: Resume upload and storage functionality
- **RESTful API**: Well-structured backend API endpoints

## 🔧 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **File Upload**: Multer for resume handling

## 🚀 Quick Start

### Option 1: MongoDB Version (Recommended)
```bash
# Double-click this file for full database integration:
start-freelancer-market-place-mongodb.bat
```

### Option 2: Stable Test Version
```bash
# Double-click this file for stable test version:
start-freelancer-market-place-stable.bat
```

### Option 3: Manual Start
```bash
# Start Backend (Terminal 1)
cd backend
node server-mongodb.js

# Start Frontend (Terminal 2)
npx vite
```

### Option 3: Using NPM Scripts
```bash
# Install concurrently first
npm install

# Start both servers simultaneously
npm run start:full
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:3002/api
- **Health Check**: http://localhost:3002/api/health

## 🔑 Test Accounts

### Recruiter Account
- **Email**: manishmodi0408@gmail.com
- **Password**: 987654
- **Company**: The Tech World

### Job Seeker Account
- **Email**: manish1@gmail.com
- **Password**: 123456

## 🛠️ Management Scripts

### Start System
```bash
start-freelancer-market-place.bat    # Windows batch file
# OR
npm run start:full      # NPM script
```

### Stop System
```bash
stop-freelancer-market-place.bat     # Windows batch file
# OR
npm run stop           # NPM script
```

### Check System Health
```bash
check-system.bat       # Windows batch file
# OR
npm run check         # NPM script
```

## 📋 System Requirements

- **Node.js**: v16 or higher
- **NPM**: v8 or higher
- **Internet**: For MongoDB Atlas connection
- **Ports**: 3002 (backend), 5173 (frontend)

## 🔍 Troubleshooting

### Common Issues

1. **"Network Error" or "Login Failed"**
   - Run `check-system.bat` to diagnose
   - Ensure both servers are running
   - Check if ports 3002 and 5173 are available

2. **"Port already in use"**
   - Run `stop-freelancer-market-place.bat` first
   - Wait 5 seconds, then start again

3. **"Cannot connect to MongoDB"**
   - Check internet connection
   - Verify MongoDB Atlas credentials in backend/.env

4. **Frontend not loading**
   - Clear browser cache (Ctrl+F5)
   - Try different browser
   - Check if port 5173 is blocked by firewall

### Debug Steps

1. **Check System Status**:
   ```bash
   check-system.bat
   ```

2. **View Logs**:
   - Backend logs appear in backend terminal
   - Frontend logs appear in frontend terminal
   - Browser console (F12) for frontend errors

3. **Restart Everything**:
   ```bash
   stop-freelancer-market-place.bat
   start-freelancer-market-place.bat
   ```

## 📁 Project Structure

```
freelancer-market-place/
├── backend/                 # Backend server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── database/           # Database connection
│   ├── uploads/            # Resume uploads
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
├── src/                    # Frontend source
│   ├── components/        # React components
│   │   ├── LandingPage.jsx           # Main landing page
│   │   ├── AnimatedCounter.jsx       # Animated statistics
│   │   ├── FeatureCard.jsx          # Interactive feature cards
│   │   ├── TypingAnimation.jsx      # Dynamic typing effect
│   │   ├── InteractiveDemo.jsx      # Live platform demo
│   │   ├── SocialProof.jsx          # Company logos & testimonials
│   │   ├── LiveActivityFeed.jsx     # Real-time activity updates
│   │   ├── NewsletterSignup.jsx     # Email subscription
│   │   ├── FloatingActionButton.jsx # Quick access menu
│   │   ├── ScrollToTop.jsx          # Smooth scroll to top
│   │   └── landing-page.css         # Custom animations
│   ├── services/          # API services
│   └── App.jsx           # Main app component
├── start-freelancer-market-place.bat   # Start script
├── stop-freelancer-market-place.bat    # Stop script
├── check-system.bat       # Health check
└── README.md             # This file
```

## 🎨 Landing Page Components

The landing page is built with modular, reusable components:

### Core Components
- **LandingPage.jsx**: Main landing page container with all sections
- **AnimatedCounter.jsx**: Smooth counting animations for statistics
- **TypingAnimation.jsx**: Dynamic typing effect for hero section
- **FeatureCard.jsx**: Interactive cards with hover effects and animations

### Interactive Elements
- **InteractiveDemo.jsx**: Live demo showing job seeker and recruiter workflows
- **SocialProof.jsx**: Company logos, user avatars, and trust indicators
- **LiveActivityFeed.jsx**: Real-time activity updates with smooth animations
- **NewsletterSignup.jsx**: Email subscription with success states

### Navigation & UX
- **FloatingActionButton.jsx**: Quick access menu for key actions
- **ScrollToTop.jsx**: Smooth scroll to top functionality
- **landing-page.css**: Custom CSS animations and responsive design

## 🔐 Environment Variables

Backend environment variables (backend/.env):
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

# Server Configuration
PORT=3002
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-secret-key
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/recruiter/all` - Get recruiter's applications
- `PUT /api/applications/:id/status` - Update application status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Frontend running on http://localhost:5173/
- ✅ Backend running on http://localhost:3002/
- ✅ MongoDB connected and operational
- ✅ Authentication working
- ✅ Job posting and application features working

## 📞 Support

If you encounter any issues:
1. Run the health check: `check-system.bat`
2. Check the troubleshooting section above
3. Restart the system: `stop-freelancer-market-place.bat` then `start-freelancer-market-place.bat`

---

**Happy Job Hunting! 🎯**
