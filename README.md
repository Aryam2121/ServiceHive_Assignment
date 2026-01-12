# GigFlow - Freelance Marketplace Platform

A modern full-stack freelance marketplace where clients can post jobs (Gigs) and freelancers can submit bids to work on them. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Fluid Roles**: Users can act as both clients (posting gigs) and freelancers (bidding on gigs)
- **Gig Management**: Full CRUD operations for job postings
- **Search & Filter**: Real-time search functionality for finding gigs
- **Bidding System**: Freelancers can submit bids with custom proposals and pricing
- **Smart Hiring Logic**: Atomic hiring process with race condition prevention

### Bonus Features (Implemented)
- **MongoDB Transactions**: Ensures data integrity during the hiring process, preventing race conditions
- **Real-time Notifications**: Socket.io integration for instant notifications when freelancers are hired
- **Redux Toolkit**: Centralized state management for seamless user experience

## 🛠️ Tech Stack

### Frontend
- **React.js** (with Vite) - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Toastify** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time bidirectional communication
- **cookie-parser** - Cookie handling
- **express-validator** - Request validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Clone the Repository
```bash
git clone <repository-url>
cd ServiceHive_Assignment
```

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (use `.env.example` as reference):
```env
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🏗️ Project Structure

```
ServiceHive_Assignment/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── gigController.js      # Gig CRUD operations
│   │   └── bidController.js      # Bidding & hiring logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── error.js             # Error handling middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Gig.js               # Gig schema
│   │   └── Bid.js               # Bid schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── gigRoutes.js         # Gig endpoints
│   │   └── bidRoutes.js         # Bid endpoints
│   ├── .env.example             # Environment variables template
│   ├── server.js                # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation bar
    │   │   └── SocketClient.jsx # Socket.io client
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page
    │   │   ├── Login.jsx        # Login page
    │   │   ├── Register.jsx     # Registration page
    │   │   ├── Dashboard.jsx    # Gig browsing
    │   │   ├── CreateGig.jsx    # Gig creation form
    │   │   ├── GigDetails.jsx   # Gig details & bidding
    │   │   └── MyBids.jsx       # User's submitted bids
    │   ├── store/
    │   │   ├── store.js         # Redux store configuration
    │   │   └── slices/
    │   │       ├── authSlice.js # Auth state
    │   │       ├── gigSlice.js  # Gig state
    │   │       └── bidSlice.js  # Bid state
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Gigs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/gigs` | Get all open gigs (with search) | Public |
| GET | `/api/gigs/:id` | Get single gig | Public |
| POST | `/api/gigs` | Create new gig | Private |
| PUT | `/api/gigs/:id` | Update gig | Private (Owner) |
| DELETE | `/api/gigs/:id` | Delete gig | Private (Owner) |

### Bids
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bids` | Submit a bid | Private |
| GET | `/api/bids/:gigId` | Get all bids for a gig | Private (Owner) |
| GET | `/api/bids/my-bids` | Get user's submitted bids | Private |
| PATCH | `/api/bids/:bidId/hire` | Hire a freelancer | Private (Owner) |

## 🔐 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Gig Model
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned']),
  assignedTo: ObjectId (ref: User),
  timestamps: true
}
```

### Bid Model
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: String (enum: ['pending', 'hired', 'rejected']),
  timestamps: true
}
```

## 🎯 Key Implementation Details

### 1. Hiring Logic (Race Condition Prevention)
The hiring process uses **MongoDB Transactions** to ensure atomicity:
- Starts a database session and transaction
- Checks if the gig is still "open" (prevents double-hiring)
- Updates gig status to "assigned"
- Marks the selected bid as "hired"
- Automatically rejects all other pending bids
- Commits the transaction only if all operations succeed
- Rolls back if any error occurs

### 2. Real-time Notifications
- Socket.io server runs alongside Express
- Users join personal rooms based on their user ID
- When hired, freelancers receive instant notifications
- No page refresh needed to see updates

### 3. State Management
- Redux Toolkit for centralized state
- Separate slices for auth, gigs, and bids
- Async thunks for API calls
- Automatic loading and error states

### 4. Security Features
- JWT tokens stored in HttpOnly cookies
- Password hashing with bcryptjs
- Input validation using express-validator
- CORS configuration for secure cross-origin requests
- Protected routes requiring authentication

## 🚀 Usage Guide

### As a Client (Posting Gigs)

1. **Register/Login** to your account
2. Navigate to **"Post a Gig"**
3. Fill in the job details:
   - Title
   - Description
   - Budget
4. Submit the gig
5. View bids on your gig from the **Dashboard**
6. Click **"Hire"** on the best bid
7. The system automatically:
   - Marks the gig as "assigned"
   - Sets the selected bid as "hired"
   - Rejects all other bids
   - Sends real-time notification to the hired freelancer

### As a Freelancer (Bidding on Gigs)

1. **Register/Login** to your account
2. Browse available gigs from the **Dashboard**
3. Use the search bar to find specific gigs
4. Click **"View Details"** on any gig
5. Submit your bid with:
   - Your proposal/message
   - Your price
6. Track your bids in **"My Bids"** section
7. Receive real-time notification if hired

## 🧪 Testing the Application

### Test Scenario 1: Basic Flow
1. Create two user accounts (User A and User B)
2. As User A: Post a gig
3. As User B: Submit a bid on User A's gig
4. As User A: View bids and hire User B
5. As User B: See the real-time notification

### Test Scenario 2: Race Condition (Bonus Feature)
1. Create one client account and two freelancer accounts
2. Client posts a gig
3. Both freelancers submit bids
4. Open two browser windows as the client
5. Try to hire different freelancers simultaneously
6. Only one hire should succeed, preventing data corruption

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the `backend` directory

### Frontend Deployment (Vercel/Netlify)
1. Create a new project
2. Connect your GitHub repository
3. Set build directory to `frontend`
4. Build command: `npm run build`
5. Deploy

### Environment Variables for Production
```env
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

## 📝 License

This project is developed as part of a Full Stack Development Internship Assignment.

## 👨‍💻 Author

Developed for ServiceHive Full Stack Development Internship

## 📧 Submission

- **Email To**: ritik.yadav@servicehive.tech
- **CC**: hiring@servicehive.tech
- **Repository**: [GitHub Link]
- **Hosted Link**: [Live Demo]
- **Demo Video**: [2-minute Loom video]

---

## 🎥 Demo Video Checklist

The 2-minute demo video should cover:
1. User registration and login
2. Creating a new gig as a client
3. Submitting a bid as a freelancer
4. Viewing bids as the gig owner
5. Hiring a freelancer (showing the atomic transaction)
6. Real-time notification received by the hired freelancer
7. Verifying that other bids are automatically rejected

---

**Built with ❤️ using the MERN Stack**
