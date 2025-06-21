# 🚀 Job Portal Application

A full-stack job portal application built with React, Node.js, Express, and MongoDB.

## 🌟 Features

- **User Authentication**: Login/Register for Job Seekers and Recruiters
- **Job Management**: Post, edit, delete, and browse jobs
- **Application System**: Apply for jobs with resume upload
- **Real-time Updates**: Live data synchronization with MongoDB Atlas
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **File Upload**: Multer for resume handling

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)
```bash
# Double-click this file to start everything:
start-job-portal.bat
```

### Option 2: Manual Start
```bash
# Start Backend (Terminal 1)
cd backend
node server.js

# Start Frontend (Terminal 2)
npm run dev
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
start-job-portal.bat    # Windows batch file
# OR
npm run start:full      # NPM script
```

### Stop System
```bash
stop-job-portal.bat     # Windows batch file
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
   - Run `stop-job-portal.bat` first
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
   stop-job-portal.bat
   start-job-portal.bat
   ```

## 📁 Project Structure

```
job-portal/
├── backend/                 # Backend server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── database/           # Database connection
│   ├── uploads/            # Resume uploads
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── services/          # API services
│   └── App.jsx           # Main app component
├── start-job-portal.bat   # Start script
├── stop-job-portal.bat    # Stop script
├── check-system.bat       # Health check
└── README.md             # This file
```

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
3. Restart the system: `stop-job-portal.bat` then `start-job-portal.bat`

---

**Happy Job Hunting! 🎯**
