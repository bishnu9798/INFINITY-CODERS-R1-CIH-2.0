# 🚀 Complete Setup Guide

This guide will help you set up the Freelancer Marketplace application on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **NPM** (v8 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up free](https://cloud.mongodb.com/)

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/bishnu9798/INFINITY-CODERS-R1-CIH-2.0.git
cd INFINITY-CODERS-R1-CIH-2.0
```

### Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for a free account
   - Create a new cluster (free tier is sufficient)

2. **Get Connection String**:
   - In your Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

3. **Create Database User**:
   - Go to "Database Access" in Atlas
   - Click "Add New Database User"
   - Create username and password
   - Give "Read and write to any database" permissions

4. **Configure Network Access**:
   - Go to "Network Access" in Atlas
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development

### Step 3: Configure Environment Variables

1. **Copy Environment Template**:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Edit Environment File**:
   Open `backend/.env` and replace the placeholders:
   ```env
   # Replace with your MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/freelancer-marketplace?retryWrites=true&w=majority&appName=FreelancerApp
   DB_NAME=freelancer-marketplace
   
   # Generate a secure JWT secret (or use the default for development)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   PORT=3002
   NODE_ENV=development
   ```

   **Example**:
   ```env
   MONGODB_URI=mongodb+srv://john:mypassword123@cluster0.abc123.mongodb.net/freelancer-marketplace?retryWrites=true&w=majority&appName=FreelancerApp
   DB_NAME=freelancer-marketplace
   JWT_SECRET=my-super-secret-jwt-key-for-development
   PORT=3002
   NODE_ENV=development
   ```

### Step 4: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### Step 5: Start the Application

#### Option 1: Manual Start (Recommended for first time)

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```
You should see:
```
✅ Server running on port 3002
✅ Connected to MongoDB Atlas
✅ Real-time services initialized
```

**Terminal 2 - Frontend**:
```bash
# From project root
npm run dev
```
You should see:
```
Local:   http://localhost:5173/
Network: use --host to expose
```

#### Option 2: Start Both Simultaneously

```bash
# From project root
npm run start:full
```

### Step 6: Verify Setup

1. **Check Backend Health**:
   - Open: http://localhost:3002/api/health
   - Should show: `{"status":"OK","database":"Connected"}`

2. **Check Frontend**:
   - Open: http://localhost:5173/
   - Should show the landing page

3. **Test Database Connection**:
   - Open: http://localhost:3002/api/stats
   - Should show database statistics

## 🧪 Test the Application

### Create Test Accounts

1. **Register as Freelancer**:
   - Go to http://localhost:5173/
   - Click "Register"
   - Select "Recruiter" (this is the freelancer/service provider)
   - Fill in details:
     - Name: John Freelancer
     - Email: john@example.com
     - Password: password123
     - Company: John's Web Services

2. **Register as Client**:
   - Click "Register" again
   - Select "Job Seeker" (this is the client)
   - Fill in details:
     - Name: Jane Client
     - Email: jane@example.com
     - Password: password123

### Test Core Functionality

1. **Post a Service** (as Freelancer):
   - Login as john@example.com
   - Go to "Post New Service" tab
   - Fill in service details:
     - Title: Web Development Service
     - Company: John's Web Services
     - Location: Remote
     - Experience: 3-5 years
     - Skills: JavaScript, React, Node.js
     - Mobile: +1-555-123-4567
     - Email: john@example.com
     - Description: Professional web development services
   - Click "Post Service"

2. **Apply for Service** (as Client):
   - Login as jane@example.com
   - Browse available services
   - Click "Apply Now" on John's service
   - Fill application form:
     - Name: Jane Client
     - Email: jane@example.com
     - Phone: +1-555-987-6543
     - Skills: Project Management
     - Message: I need a website for my business
   - Click "Submit Application"

3. **View Applications** (as Freelancer):
   - Login as john@example.com
   - Go to "Applications" tab
   - You should see Jane's application

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot connect to MongoDB"**:
   - Check your internet connection
   - Verify MongoDB Atlas connection string in `.env`
   - Ensure your IP is whitelisted in Atlas Network Access
   - Check username/password are correct

2. **"Port already in use"**:
   - Kill existing processes: `npx kill-port 3002` and `npx kill-port 5173`
   - Or change ports in `.env` and `vite.config.js`

3. **"Module not found" errors**:
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Frontend not loading**:
   - Clear browser cache (Ctrl+F5)
   - Check browser console for errors (F12)
   - Ensure backend is running first

### Debug Steps

1. **Check Backend Logs**:
   - Look at the terminal running the backend
   - Should show successful MongoDB connection

2. **Check Frontend Console**:
   - Open browser developer tools (F12)
   - Look for any JavaScript errors

3. **Test API Endpoints**:
   - http://localhost:3002/api/health (should return OK)
   - http://localhost:3002/api/stats (should show database info)

## 🎉 Success!

If everything is working correctly, you should have:
- ✅ Frontend running on http://localhost:5173/
- ✅ Backend running on http://localhost:3002/
- ✅ MongoDB Atlas connected
- ✅ User registration working
- ✅ Service posting working
- ✅ Application submission working

## 📞 Need Help?

If you encounter issues:
1. Check this troubleshooting guide
2. Ensure all prerequisites are installed
3. Verify your MongoDB Atlas setup
4. Check that all environment variables are correct

**Happy coding! 🚀**
