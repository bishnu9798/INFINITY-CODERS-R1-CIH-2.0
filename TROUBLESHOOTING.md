# 🔧 Troubleshooting Guide - Infinity Workspace

## 🚨 Common Issue: "Network error - cannot connect to server"

### ✅ **Quick Fix (Works 90% of the time):**

1. **Wait 15 seconds** after starting the application
2. **Refresh your browser** (Ctrl+F5)
3. **Check if frontend is on a different port** - look at the frontend terminal window

### 🔍 **Step-by-Step Diagnosis:**

#### **Step 1: Check if servers are running**
```bash
# Double-click this file:
check-infinity-workspace.bat
```

#### **Step 2: Restart everything**
```bash
# Double-click these files in order:
1. stop-infinity-workspace.bat
2. Wait 5 seconds
3. start-infinity-workspace.bat
4. Wait 15 seconds
5. Refresh browser
```

#### **Step 3: Manual verification**
1. **Backend Health**: Open http://localhost:3002/api/health
   - Should show: `{"status":"OK","database":"Connected"}`
   - If not working: Backend is not running

2. **Frontend Check**: Look at frontend terminal window
   - Should show: `Local: http://localhost:5173/` (or 5174, 5175)
   - Use the port shown in the terminal

### 🎯 **Specific Solutions:**

#### **Issue: "Port already in use"**
**Solution:**
```bash
stop-infinity-workspace.bat
# Wait 10 seconds
start-infinity-workspace.bat
```

#### **Issue: "Cannot connect to MongoDB"**
**Symptoms**: Backend shows MongoDB connection errors
**Solution**: 
- Check internet connection
- Wait 30 seconds and try again
- MongoDB Atlas might be temporarily unavailable

#### **Issue: "Frontend shows blank page"**
**Solution**:
1. Check browser console (F12) for errors
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try different browser
4. Check if frontend is running on different port

#### **Issue: "Backend not responding"**
**Symptoms**: http://localhost:3002/api/health doesn't work
**Solution**:
1. Check backend terminal for errors
2. Restart backend: `cd backend && npm start`
3. Check if port 3002 is blocked by firewall

### 🔧 **Advanced Troubleshooting:**

#### **Check Ports Manually:**
```bash
# Check what's using port 3002
netstat -ano | findstr :3002

# Check what's using port 5173
netstat -ano | findstr :5173
```

#### **Kill Specific Processes:**
```bash
# Kill all Node.js processes
taskkill /f /im node.exe

# Kill specific port
npx kill-port 3002
npx kill-port 5173
```

#### **Test Backend Manually:**
```bash
cd backend
node server.js
# Should show "Ready to receive requests!"
```

#### **Test Frontend Manually:**
```bash
npm run dev
# Should show "Local: http://localhost:5173/"
```

### 📊 **Expected Startup Sequence:**

1. **Backend starts** (8 seconds)
   - MongoDB connection
   - Routes loaded
   - "Ready to receive requests!"

2. **Frontend starts** (8 seconds)
   - Vite server starts
   - Shows local URL

3. **Browser opens** (3 seconds)
   - Should show Infinity Workspace landing page

**Total time: ~20 seconds**

### 🆘 **Still Not Working?**

#### **Nuclear Option (Reset Everything):**
```bash
1. stop-infinity-workspace.bat
2. Restart your computer
3. start-infinity-workspace.bat
4. Wait 30 seconds
```

#### **Check System Requirements:**
- **Node.js**: v16 or higher (`node --version`)
- **NPM**: v8 or higher (`npm --version`)
- **Internet**: Required for MongoDB Atlas
- **Ports**: 3002 and 5173 must be available

#### **Verify Installation:**
```bash
# Check if dependencies are installed
cd backend
npm list

# Reinstall if needed
npm install
```

### 💡 **Pro Tips:**

1. **Always wait 15 seconds** after starting before testing
2. **Check both terminal windows** for error messages
3. **Frontend port can change** - always check the terminal
4. **Backend must start first** - it takes longer due to MongoDB
5. **Refresh browser** if you see old cached content

### 🎯 **Success Indicators:**

**Backend Ready:**
```
✅ MongoDB connected successfully
✅ Routes loaded successfully
✅ Real-time services initialized
⚡ Ready to receive requests!
```

**Frontend Ready:**
```
VITE v5.x.x ready in XXXms
➜ Local: http://localhost:5173/
```

**Application Working:**
- Landing page loads with "INFINITY WORKSPACE" branding
- Can register new accounts
- Can post services (as recruiter)
- Can apply for services (as client)

### 📞 **Last Resort:**

If nothing works:
1. Check if your antivirus is blocking Node.js
2. Try running as administrator
3. Check Windows Firewall settings
4. Verify internet connection to MongoDB Atlas
5. Try a different computer to confirm it's not system-specific

**Remember: This is a shared development environment - if others can access it, the issue is likely local to your setup.**
