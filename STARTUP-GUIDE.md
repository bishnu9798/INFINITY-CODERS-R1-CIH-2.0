# 🚀 Job Portal - Startup Guide

## ⚡ Quick Start (Every Time You Want to Use the App)

### Method 1: One-Click Start (Easiest)
1. **Double-click**: `start-job-portal.bat`
2. **Wait**: 10-15 seconds for both servers to start
3. **Browser opens automatically** to http://localhost:5173/

### Method 2: Manual Start
1. **Open Terminal 1**: 
   ```bash
   cd backend
   node server.js
   ```
2. **Open Terminal 2**:
   ```bash
   npm run dev
   ```
3. **Open browser**: http://localhost:5173/

## 🛑 How to Stop

### Method 1: One-Click Stop
- **Double-click**: `stop-job-portal.bat`

### Method 2: Manual Stop
- **Close both terminal windows** or press `Ctrl+C` in each

## 🔍 Check if Everything is Working

### Method 1: Health Check Script
- **Double-click**: `check-system.bat`

### Method 2: Manual Check
1. **Backend**: http://localhost:3002/api/health
2. **Frontend**: http://localhost:5173/

## 🔑 Login Credentials

### Recruiter Account
- **Email**: manishmodi0408@gmail.com
- **Password**: 987654

### Job Seeker Account  
- **Email**: manish1@gmail.com
- **Password**: 123456

## ❌ Common Issues & Solutions

### Issue 1: "Network Error" when logging in
**Solution**:
1. Run `check-system.bat`
2. If backend is down, restart with `start-job-portal.bat`

### Issue 2: "Port already in use"
**Solution**:
1. Run `stop-job-portal.bat`
2. Wait 5 seconds
3. Run `start-job-portal.bat`

### Issue 3: Browser shows "This site can't be reached"
**Solution**:
1. Check if frontend is running on port 5173
2. Try refreshing the page (Ctrl+F5)
3. Restart with `start-job-portal.bat`

### Issue 4: Login works but no jobs showing
**Solution**:
1. Check internet connection (MongoDB Atlas needs internet)
2. Wait a few seconds for database to connect
3. Refresh the page

## 🎯 What Should Work

After starting successfully, you should be able to:

✅ **Login** with either account  
✅ **Register** new users  
✅ **Post jobs** (as recruiter)  
✅ **Browse jobs** (as job seeker)  
✅ **Apply for jobs** (with resume upload)  
✅ **View applications** (both sides)  

## 📱 URLs to Remember

- **Main App**: http://localhost:5173/
- **Backend Health**: http://localhost:3002/api/health

## 🔄 Restart Process (If Issues Occur)

1. **Stop**: `stop-job-portal.bat`
2. **Wait**: 5 seconds
3. **Start**: `start-job-portal.bat`
4. **Wait**: 15 seconds for full startup
5. **Test**: Try logging in

## 💡 Pro Tips

1. **Keep terminals open** while using the app
2. **Don't close browser tabs** - just refresh if needed
3. **Wait for startup** - both servers need time to initialize
4. **Check health first** if something doesn't work
5. **Restart if in doubt** - it's quick and fixes most issues

---

## 🎉 Success Indicators

You know everything is working when:
- ✅ Two terminal windows are open and running
- ✅ http://localhost:5173/ loads the job portal
- ✅ You can login without "network error"
- ✅ Jobs are visible on the dashboard

**Happy job hunting! 🎯**
