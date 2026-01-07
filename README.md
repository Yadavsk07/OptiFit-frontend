OptiFit

A comprehensive full-stack fitness application that uses AI to generate personalized workout and diet plans, track progress, and provide fitness guidance through an intelligent chatbot.

🚀 Features

1. User Authentication
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ User profile management

2. Personalized Workout Plans
- ✅ AI-generated workout plans based on:
  - Fitness goals (weight loss, muscle gain, endurance, maintenance)
  - Fitness level (beginner, intermediate, advanced)
  - Available equipment (gym, home, bodyweight)
  - Workout days per week
  - Session duration
  - Injuries/limitations
- ✅ Weekly schedule with day-by-day exercises
- ✅ Exercise details (sets, reps, rest time, notes)

3. Personalized Diet Plans
- ✅ AI-generated diet plans based on:
  - Body metrics (weight, height, age, gender)
  - Fitness goals
  - Dietary preferences (vegetarian, non-vegetarian, vegan)
- ✅ Daily calorie and macro targets
- ✅ Meal plans with detailed nutrition information

4. Exercise Library
- ✅ Comprehensive exercise database
- ✅ Search and filter exercises by:
  - Muscle groups
  - Equipment
  - Difficulty level
- ✅ Detailed exercise information:
  - Instructions
  - Common mistakes
  - Tips
  - Alternatives
  - Video demonstrations (YouTube links)

5. AI Chatbot
- ✅ Answers fitness, workout, and diet queries
- ✅ Can modify workout and diet plans on request
- ✅ Context-aware responses
- ✅ General fitness guidance

6. Progress Tracker
- ✅ **Personal Records (PRs)**: Track your best performance for each exercise
- ✅ **Streaks**: Monitor consecutive workout days
  - Current streak
  - Longest streak
  - Total workout days
- ✅ **Exercise Logging**: Log exercises performed each day with:
  - Exercise name
  - Weight (kg)
  - Reps
  - Sets
  - Date
  - Notes
- ✅ **1RM Calculation**: Automatic one-rep max estimation using Epley formula
- ✅ **Weight Tracking**: Track body weight over time
- ✅ **Progress Charts**: Visualize weight progress
- ✅ **Workout History**: View past workout sessions

🛠️ Tech Stack

Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **OpenAI API** (GPT-4o-mini) for AI features
- **JWT** for authentication
- **bcryptjs** for password hashing

Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls
- **Lucide React** for icons

📁 Project Structure

OptiFit/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── diet.controller.js
│   │   ├── exercise.controller.js
│   │   ├── profile.controller.js
│   │   ├── progress.controller.js
│   │   └── workout.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT authentication
│   ├── models/
│   │   ├── DietPlan.js
│   │   ├── Exercise.js
│   │   ├── ExerciseLog.js
│   │   ├── Progress.js
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   └── WorkoutPlan.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── chat.routes.js
│   │   ├── diet.routes.js
│   │   ├── exercise.routes.js
│   │   ├── profile.routes.js
│   │   ├── progress.routes.js
│   │   └── workout.routes.js
│   ├── services/
│   │   └── ai.service.js      # OpenAI integration
│   ├── seed/
│   │   ├── exercises.json
│   │   ├── migrateWorkoutPlans.js
│   │   └── seedExercises.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatBot.jsx
    │   │   ├── ExerciseCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProgressChart.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── WorkoutCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── DietPlan.jsx
    │   │   ├── Education.jsx
    │   │   ├── ExerciseDetail.jsx
    │   │   ├── ExerciseLibrary.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Onboarding.jsx
    │   │   ├── Progress.jsx
    │   │   ├── Signup.jsx
    │   │   ├── WorkoutPlan.jsx
    │   │   └── WorkoutSession.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json


🚀 Getting Started

Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "OptiFit"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/optifit
   JWT_SECRET=your-secret-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   ```

5. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

📝 API Endpoints

# Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

# Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Save/update user profile

# Workout Plans
- `GET /api/workout` - Get active workout plan
- `POST /api/workout/generate` - Generate new workout plan

# Diet Plans
- `GET /api/diet` - Get active diet plan
- `POST /api/diet/generate` - Generate new diet plan

# Exercises
- `GET /api/exercises` - Get all exercises (with filters)
- `GET /api/exercises/:id` - Get exercise details

# Progress
- `POST /api/progress` - Add progress metric (weight)
- `GET /api/progress` - Get all progress metrics
- `GET /api/progress/metrics` - Get progress metrics
- `GET /api/progress/stats` - Get progress statistics
- `POST /api/progress/log` - Log an exercise
- `GET /api/progress/summary` - Get progress summary (PRs, streaks, logs)
- `GET /api/progress/workout-logs` - Get workout logs
- `POST /api/progress/workout-log` - Log a workout session
- `GET /api/progress/leaderboard` - Get exercise leaderboard

# Chat
- `POST /api/chat` - Send message to AI chatbot

🎯 Key Features Explained

# Personal Records (PRs)
- Automatically calculated from exercise logs
- Uses 1RM (one-rep max) estimation formula
- Tracks best performance per exercise
- Updates when you log a new personal best

# Streaks
- **Current Streak**: Consecutive days with at least one exercise logged, up to today
- **Longest Streak**: Best consecutive workout streak ever achieved
- **Total Days**: Total number of unique days with logged exercises

# Exercise Logging
- Log individual exercises with weight, reps, sets
- Automatic 1RM calculation
- Date tracking
- Notes support
- Can log exercises from workout sessions or manually

# AI Integration
- Uses OpenAI GPT-4o-mini for:
  - Workout plan generation
  - Diet plan generation
  - Chatbot responses
- Structured JSON output for plans
- Natural language for chatbot

🔒 Security
- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Protected frontend routes
- Input validation

📊 Database Models

# User
- Email, password, fullName, profilePicture

# UserProfile
- Age, height, weight, gender
- Fitness level, fitness goal
- Workout preferences
- Equipment availability
- Dietary preferences
- Injuries/limitations

# WorkoutPlan
- User ID
- Plan structure (weekly schedule)
- Created date

# DietPlan
- User ID
- Plan structure (meals, macros, calories)
- Created date

# Exercise
- Name, instructions, muscle groups
- Equipment, difficulty
- YouTube URL, alternatives

# ExerciseLog
- User ID, exercise name
- Weight, reps, sets
- Date, 1RM estimate
- Notes

# Progress
- User ID, weight
- Date, notes

🎨 UI/UX Features
- Modern gradient designs
- Responsive layout
- Smooth animations
- Loading states
- Error handling
- Success notifications

🚧 Future Enhancements
- Social features (share workouts, compete with friends)
- Mobile app (React Native)
- Advanced analytics
- Integration with fitness wearables
- Meal planning with recipes
- Video exercise demonstrations
- Workout reminders
- Progress photos

📄 License
This project is for educational purposes.

