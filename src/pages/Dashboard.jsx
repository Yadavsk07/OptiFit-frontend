import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { workoutAPI, dietAPI, progressAPI } from '../services/api';
import { Dumbbell, Apple, TrendingUp, Calendar } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const Dashboard = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workoutRes, dietRes, statsRes] = await Promise.all([
        workoutAPI.getActivePlan().catch(() => null),
        dietAPI.getActivePlan().catch(() => null),
        progressAPI.getStats().catch(() => ({ data: {} }))
      ]);

      setWorkoutPlan(workoutRes?.data?.workoutPlan);
      setDietPlan(dietRes?.data?.dietPlan);
      setStats(statsRes?.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's your fitness overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Workouts</p>
                <p className="text-4xl font-bold">{stats?.totalWorkouts || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <Dumbbell size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Last 30 Days</p>
                <p className="text-4xl font-bold">{stats?.recentWorkouts || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <Calendar size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Current Weight</p>
                <p className="text-4xl font-bold">
                  {stats?.currentWeight ? `${stats.currentWeight} kg` : 'N/A'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <TrendingUp size={40} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Workout Plan Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Dumbbell className="text-blue-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Workout Plan</h2>
            </div>

            {workoutPlan ? (
              <div>
                <p className="text-gray-700 mb-6 text-lg font-medium">{workoutPlan.planName}</p>
                <Link
                  to="/workout-plan"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View Full Plan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  You don't have an active workout plan yet.
                </p>
                <Link
                  to="/workout-plan"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Generate Workout Plan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Diet Plan Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <Apple className="text-green-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Diet Plan</h2>
            </div>

            {dietPlan ? (
              <div>
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Daily Calories:</span> {dietPlan.dailyCalories ?? dietPlan.macros?.calories}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Protein: {dietPlan.protein ?? dietPlan.macros?.protein}g | Carbs: {dietPlan.carbs ?? dietPlan.macros?.carbs}g | Fats: {dietPlan.fats ?? dietPlan.macros?.fats}g
                  </p>
                </div>
                <Link
                  to="/diet-plan"
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View Full Plan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  You don't have an active diet plan yet.
                </p>
                <Link
                  to="/diet-plan"
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Generate Diet Plan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/exercises"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center border border-gray-100 group"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
              <Dumbbell className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Exercise Library</h3>
            <p className="text-gray-600">Browse 150+ exercises with videos</p>
          </Link>

          <Link
            to="/progress"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center border border-gray-100 group"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Track Progress</h3>
            <p className="text-gray-600">Monitor your fitness journey</p>
          </Link>

          <Link
            to="/education"
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center border border-gray-100 group"
          >
            <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Learn</h3>
            <p className="text-gray-600">Educational fitness content</p>
          </Link>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Dashboard;