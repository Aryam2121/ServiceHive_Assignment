# GigFlow - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open a terminal in the project root and run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in a new terminal)
cd frontend
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is installed and running on your machine
- Default connection: `mongodb://localhost:27017/gigflow`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `backend/.env` file with your connection string

### Step 3: Configure Environment

The `backend/.env` file is already configured for local development. If needed, update:

```env
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=gigflow_secret_key_2026_full_stack_assignment_very_secure
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Step 5: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. Create a new account
3. Start posting gigs or bidding on existing ones!

## 🎯 Test Scenarios

### Scenario 1: Client Flow
1. Register as User A
2. Login and click "Post a Gig"
3. Fill in: Title, Description, Budget
4. Submit and view your gig on the dashboard

### Scenario 2: Freelancer Flow
1. Register as User B (use a different browser or incognito)
2. Browse gigs from the dashboard
3. Click on User A's gig
4. Submit a bid with your proposal and price
5. Check "My Bids" to see your submission

### Scenario 3: Hiring Flow
1. Login as User A
2. Click on your posted gig
3. View all received bids
4. Click "Hire" on User B's bid
5. Watch User B receive a real-time notification!

### Scenario 4: Race Condition Test (Bonus)
1. Create 3 accounts: 1 client, 2 freelancers
2. Client posts a gig
3. Both freelancers submit bids
4. Open two browser tabs as the client
5. Try to hire different freelancers at the same time
6. Verify only one hire succeeds

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB Compass
- Verify connection string in `.env` file
- For Atlas: Check IP whitelist and credentials

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (5173): Vite will automatically suggest another port

### Socket.io Not Working
- Ensure backend server is running
- Check console for connection errors
- Verify FRONTEND_URL in backend `.env`

### CORS Errors
- Make sure FRONTEND_URL matches your actual frontend URL
- Restart backend server after changing `.env`

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
```
Creates optimized production build in `frontend/dist`

### Backend
```bash
cd backend
npm start
```
Runs backend in production mode

## 🌐 Environment Variables for Production

Update your `.env` file for production:

```env
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-a-strong-random-secret>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-deployed-frontend-url>
```

## 📊 API Testing with Postman/Thunder Client

Import these example requests:

**Register User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Gig:**
```
POST http://localhost:5000/api/gigs
Content-Type: application/json
Cookie: token=<your-jwt-token>

{
  "title": "Build a React App",
  "description": "Need a developer to build a React application",
  "budget": 500
}
```

**Submit Bid:**
```
POST http://localhost:5000/api/bids
Content-Type: application/json
Cookie: token=<your-jwt-token>

{
  "gigId": "<gig-id>",
  "message": "I can complete this project!",
  "price": 450
}
```

## 🎥 Demo Video Script

1. **Introduction (10s)**: "Welcome to GigFlow, a modern freelance marketplace"
2. **Registration (15s)**: Show user signup process
3. **Post Gig (20s)**: Create a new gig with details
4. **Submit Bid (20s)**: Switch user, find and bid on the gig
5. **Hire Process (30s)**: View bids, click hire, show transaction
6. **Real-time Notification (15s)**: Show socket notification received
7. **Verification (10s)**: Show other bids rejected automatically

Total: ~2 minutes

## 📧 Submission Checklist

- [ ] GitHub repository created with all code
- [ ] README.md is complete and informative
- [ ] .env.example included (no sensitive data)
- [ ] Code is well-commented
- [ ] Application runs without errors
- [ ] All core features work
- [ ] Bonus features implemented
- [ ] 2-minute demo video recorded
- [ ] Email sent to ritik.yadav@servicehive.tech
- [ ] CC: hiring@servicehive.tech

## 🎉 You're All Set!

If you have any questions or issues, check the main README.md file for detailed documentation.

Happy coding! 🚀
