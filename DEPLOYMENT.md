# GigFlow - Deployment Guide

This guide will help you deploy GigFlow to production hosting services.

## 🌐 Deployment Options

### Recommended Stack
- **Backend**: Render.com (Free tier available)
- **Frontend**: Vercel (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

---

## 📦 Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] All dependencies listed in package.json
- [ ] Environment variables documented
- [ ] Build scripts working locally
- [ ] Database migrations tested
- [ ] CORS configured for production URL
- [ ] Socket.io configured for production

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project (e.g., "GigFlow")

### Step 2: Create a Cluster
1. Click "Build a Cluster"
2. Choose "Shared" (Free tier)
3. Select a cloud provider and region close to your users
4. Click "Create Cluster" (takes 5-10 minutes)

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set permissions to "Read and write to any database"

### Step 4: Whitelist IP Addresses
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, use specific IPs
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with "gigflow"

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
```

---

## 🚀 Backend Deployment (Render.com)

### Step 1: Prepare Backend
1. Make sure `backend/package.json` has start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Create `backend/.gitignore` if not exists:
```
node_modules/
.env
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up (can use GitHub account)
3. Verify your email

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: gigflow-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 4: Add Environment Variables
Click "Advanced" and add:
```
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-strong-random-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url-will-add-later>
```

To generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://gigflow-backend.onrender.com`)

### Step 6: Test Backend
Visit: `https://your-backend-url.onrender.com`
Should see: `{"message": "Welcome to GigFlow API"}`

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Update `frontend/src/components/SocketClient.jsx`:
```javascript
// Change localhost to your backend URL
socket = io('https://your-backend-url.onrender.com', {
  withCredentials: true
});
```

2. Update axios base URL in store slices:
```javascript
// Add to each slice file
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

3. Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Test Build Locally
```bash
cd frontend
npm run build
```
Should create `dist/` folder without errors.

### Step 3: Create Vercel Account
1. Go to https://vercel.com
2. Sign up (use GitHub account)
3. Verify your email

### Step 4: Deploy to Vercel
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
4. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Copy your frontend URL (e.g., `https://gigflow.vercel.app`)

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
3. Redeploy backend

---

## 🔧 Post-Deployment Configuration

### Update Socket.io CORS
In `backend/server.js`, update Socket.io configuration:
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"]
  }
});
```

### Update CORS Middleware
In `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Set Cookie Settings
In `backend/middleware/auth.js`:
```javascript
const options = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
};
```

---

## ✅ Testing Deployment

### 1. Test Authentication
- Register a new user
- Login
- Check if token is stored properly
- Logout and verify token is removed

### 2. Test Gig CRUD
- Create a new gig
- Search for gigs
- View gig details
- Update gig (as owner)
- Delete gig (as owner)

### 3. Test Bidding
- Submit a bid as different user
- View bids as gig owner
- Check bid validation

### 4. Test Hiring
- Hire a freelancer
- Verify gig status changes
- Verify other bids are rejected
- Check real-time notification

### 5. Test Real-time Notifications
- Open two different browsers/devices
- Hire freelancer in one
- Verify notification in other

---

## 🐛 Common Deployment Issues

### Issue 1: CORS Errors
**Symptom**: "Access-Control-Allow-Origin" error in console

**Solution**:
- Verify FRONTEND_URL in backend env variables
- Check CORS configuration includes `credentials: true`
- Ensure frontend makes requests with `withCredentials: true`

### Issue 2: Socket.io Not Connecting
**Symptom**: Real-time notifications not working

**Solution**:
- Update socket connection URL to production backend
- Verify Socket.io CORS configuration
- Check for mixed content (HTTP/HTTPS) issues
- Enable WebSocket in hosting provider settings

### Issue 3: Cookies Not Being Set
**Symptom**: Authentication works but user gets logged out

**Solution**:
- Set `secure: true` in cookie options for HTTPS
- Set `sameSite: 'none'` for cross-origin cookies
- Verify browser allows third-party cookies

### Issue 4: Build Fails
**Symptom**: Deployment fails during build

**Solution**:
- Run `npm run build` locally to see errors
- Check all imports are correct
- Verify all dependencies are in package.json
- Check Node version compatibility

### Issue 5: Environment Variables Not Working
**Symptom**: App can't connect to database

**Solution**:
- Double-check variable names (case-sensitive)
- Verify no spaces in values
- Redeploy after changing env variables
- Check logs for specific error messages

---

## 📊 Monitoring & Logs

### Render.com
1. Go to your service dashboard
2. Click "Logs" to view real-time logs
3. Monitor for errors and performance

### Vercel
1. Go to your project dashboard
2. Click "Deployments" → Select deployment
3. View build logs and runtime logs

### MongoDB Atlas
1. Go to "Metrics" tab
2. Monitor:
   - Connections
   - Operations per second
   - Data size
3. Set up alerts for issues

---

## 🔒 Security Best Practices

### Production Environment Variables
```env
# Generate strong random strings
JWT_SECRET=<64-character-random-string>

# Use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://...

# Set to production
NODE_ENV=production

# Use HTTPS URLs
FRONTEND_URL=https://your-app.vercel.app
```

### Additional Security Measures
1. Enable rate limiting (express-rate-limit)
2. Add helmet.js for security headers
3. Implement request sanitization
4. Set up MongoDB IP whitelist (production IPs only)
5. Use strong JWT secrets
6. Regular dependency updates
7. Monitor for security vulnerabilities

---

## 📈 Performance Optimization

### Backend
1. Enable gzip compression
2. Add caching headers
3. Optimize database queries
4. Use connection pooling
5. Implement pagination

### Frontend
1. Enable code splitting
2. Lazy load routes
3. Optimize images
4. Implement service workers (PWA)
5. Use CDN for static assets

---

## 🎉 Deployment Complete!

Your GigFlow application should now be live and accessible!

### Share Your Links
- Backend API: `https://your-backend.onrender.com`
- Frontend App: `https://your-app.vercel.app`

### Next Steps
1. Test all features thoroughly
2. Monitor logs for errors
3. Gather user feedback
4. Plan feature enhancements
5. Set up CI/CD pipeline

---

## 📧 Submission

When submitting your assignment, include:
- GitHub repository link
- Live frontend URL
- Live backend URL
- 2-minute demo video

**Email To**: ritik.yadav@servicehive.tech  
**CC**: hiring@servicehive.tech

---

## 🆘 Need Help?

Common resources:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

**Good luck with your deployment! 🚀**
