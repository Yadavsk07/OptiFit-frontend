import { useEffect, useState } from 'react';
import { progressAPI } from '../services/api';
import { TrendingUp, Calendar, Award, Flame, Trophy, Target, Zap, Clock, Activity, BarChart3, Star } from 'lucide-react';
import ProgressChart from '../components/ProgressChart';
import ChatBot from '../components/ChatBot';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [newMetric, setNewMetric] = useState({
    weight: '',
    notes: ''
  });

  // Exercise logging and PRs
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ 
    exerciseName: '', 
    weight: '', 
    reps: '', 
    sets: '', 
    date: new Date().toISOString().split('T')[0], // Default to today
    notes: '' 
  });
  const [prs, setPrs] = useState([]);
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0, daysCount: 0, streakStartDate: null, streakEndDate: null });
  const [todaysLogs, setTodaysLogs] = useState([]);
  const [logsByDate, setLogsByDate] = useState([]);
  const [showPRNotification, setShowPRNotification] = useState(false);
  const [newPR, setNewPR] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedExerciseHistory, setSelectedExerciseHistory] = useState(null);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [statsRes, metricsRes, logsRes, summaryRes] = await Promise.all([
        progressAPI.getStats(),
        progressAPI.getMetrics(),
        progressAPI.getWorkoutLogs(),
        progressAPI.getSummary()
      ]);

      setStats(statsRes.data);
      setMetrics(metricsRes.data.metrics);
      setWorkoutLogs(logsRes.data.logs);
      setPrs(summaryRes.data.prs || []);
      setTodaysLogs(summaryRes.data.todaysLogs || []);
      setStreaks(summaryRes.data.streaks || { currentStreak: 0, longestStreak: 0, daysCount: 0 });
      setLogsByDate(summaryRes.data.logsByDate || []);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetric = async (e) => {
    e.preventDefault();
    try {
      await progressAPI.addMetric({
        weight: parseFloat(newMetric.weight),
        notes: newMetric.notes,
        date: new Date()
      });
      setShowAddMetric(false);
      setNewMetric({ weight: '', notes: '' });
      fetchProgressData();
    } catch (error) {
      console.error('Error adding metric:', error);
      alert('Failed to add progress metric');
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!newExercise.exerciseName.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    if (!newExercise.weight && !newExercise.reps) {
      alert('Please provide either a weight or number of reps to log this exercise.');
      return;
    }

    try {
      const payload = {
        exerciseName: newExercise.exerciseName.trim(),
        weight: newExercise.weight ? Number(newExercise.weight) : undefined,
        reps: newExercise.reps ? Number(newExercise.reps) : undefined,
        sets: newExercise.sets ? Number(newExercise.sets) : undefined,
        date: newExercise.date || new Date().toISOString().split('T')[0],
        notes: newExercise.notes || undefined
      };
      const res = await progressAPI.logExercise(payload);
      
      // Show PR notification if new PR achieved
      if (res.data.isNewPR && res.data.pr) {
        setNewPR(res.data.pr);
        setShowPRNotification(true);
        setTimeout(() => setShowPRNotification(false), 5000);
      }
      
      setShowAddExercise(false);
      setNewExercise({ 
        exerciseName: '', 
        weight: '', 
        reps: '', 
        sets: '', 
        date: new Date().toISOString().split('T')[0], 
        notes: '' 
      });
      fetchProgressData();
    } catch (err) {
      console.error('Error logging exercise', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to log exercise';
      alert(msg);
    }
  };

  const fetchExerciseHistory = async (exerciseName) => {
    try {
      const res = await progressAPI.getExerciseHistory(exerciseName);
      setExerciseHistory(res.data.logs || []);
      setSelectedExerciseHistory(exerciseName);
    } catch (err) {
      console.error('Error fetching exercise history:', err);
    }
  };

  const getDateLogs = (date) => {
    return workoutLogs.find(log => {
      const logDate = new Date(log.workoutDate).toISOString().split('T')[0];
      return logDate === date;
    });
  };

  const isWorkoutDay = (date) => {
    return logsByDate.some(log => log.date === date);
  };

  // Generate calendar days for last 30 days
  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: date.getDate(),
        isToday: i === 0,
        isWorkoutDay: isWorkoutDay(dateStr),
        isSelected: dateStr === selectedDate
      });
    }
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* PR Notification */}
      {showPRNotification && newPR && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 transform scale-105">
            <div className="flex items-center gap-4">
              <Trophy size={48} className="text-yellow-200" />
              <div>
                <h3 className="text-2xl font-bold mb-1">🎉 NEW PERSONAL RECORD! 🎉</h3>
                <p className="text-lg">{newPR.exerciseName}</p>
                <p className="text-3xl font-bold">{newPR.pr} kg 1RM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Progress
            </h1>
            <p className="text-gray-600">Track your fitness journey and celebrate your wins!</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddMetric(!showAddMetric)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {showAddMetric ? 'Cancel' : '+ Add Weight'}
            </button>
            <button
              onClick={() => setShowAddExercise(!showAddExercise)}
              className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {showAddExercise ? 'Cancel' : '+ Log Exercise'}
            </button>
          </div>
        </div>

        {/* Add Metric Form */}
        {showAddMetric && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Weight Progress</h2>
            <form onSubmit={handleAddMetric}>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMetric.weight}
                    onChange={(e) => setNewMetric({ ...newMetric, weight: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={newMetric.notes}
                    onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="How are you feeling?"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Progress
              </button>
            </form>
          </div>
        )}

        {/* Add Exercise Log */}
        {showAddExercise && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Log Exercise</h2>
            <form onSubmit={handleAddExercise}>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Exercise Name</label>
                  <input
                    type="text"
                    value={newExercise.exerciseName}
                    onChange={(e) => setNewExercise({ ...newExercise, exerciseName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Bench press"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Reps</label>
                  <input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Sets</label>
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={newExercise.date}
                    onChange={(e) => setNewExercise({ ...newExercise, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Select the date you performed this exercise</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                  <input
                    type="text"
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl">
                  Save Exercise
                </button>
                <button type="button" onClick={() => setShowAddExercise(false)} className="text-gray-600 underline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Workouts</p>
                <p className="text-4xl font-bold">{stats?.totalWorkouts || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <Award size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">This Month</p>
                <p className="text-4xl font-bold">{stats?.recentWorkouts || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <Calendar size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-xl text-white transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Total PRs</p>
                <p className="text-4xl font-bold">{stats?.totalPRs || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <Trophy size={40} className="text-white" />
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

        {/* Streak & PR Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Enhanced Streak Card */}
          <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Flame size={32} className="text-yellow-200" />
              <h3 className="text-2xl font-bold">Current Streak</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-6xl font-bold mb-2">{streaks.currentStreak}</div>
              {streaks.currentStreak > 0 ? (
                <div className="text-xl text-orange-100">days in a row! 🔥</div>
              ) : (
                <div className="text-lg text-orange-100">
                  {streaks.daysCount > 0 ? (
                    <>
                      Streak broken<br />
                      <span className="text-sm">Log a workout today to start a new streak!</span>
                    </>
                  ) : (
                    <>
                      No streak yet<br />
                      <span className="text-sm">Start logging exercises to build your streak!</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <div className="text-sm text-orange-100 mb-1">Longest Streak</div>
                <div className="text-2xl font-bold">{streaks.longestStreak} days</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <div className="text-sm text-orange-100 mb-1">Total Days</div>
                <div className="text-2xl font-bold">{streaks.daysCount} days</div>
              </div>
            </div>
            {streaks.currentStreak > 0 && (
              <div className="mt-4 text-center text-sm text-orange-100">
                Keep it up! 🔥 You're on fire!
              </div>
            )}
            {streaks.currentStreak === 0 && streaks.daysCount > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAddExercise(true)}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Log Exercise Now
                </button>
              </div>
            )}
          </div>

          {/* Top PRs Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={28} className="text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-800">🏆 Top Personal Records</h3>
            </div>
            {prs.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {prs.slice(0, 8).map((p, index) => (
                  <div 
                    key={p.exerciseName} 
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => fetchExerciseHistory(p.exerciseName)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{p.exerciseName}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(p.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600">{p.pr} kg</div>
                      <div className="text-xs text-gray-500">1RM</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No PRs yet. Start logging exercises to track your progress!</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Calendar className="text-purple-600" size={28} />
            Workout Calendar (Last 30 Days)
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {getCalendarDays().map((day, index) => (
              <div
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                  day.isToday 
                    ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300' 
                    : day.isWorkoutDay
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : day.isSelected
                    ? 'bg-purple-200 text-purple-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={day.date}
              >
                <div className="text-sm">{day.day}</div>
                {day.isWorkoutDay && (
                  <div className="text-xs mt-1">💪</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Workout Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Selected Date Workout */}
        {getDateLogs(selectedDate) && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Workout on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <div className="space-y-3">
              {getDateLogs(selectedDate).exercises.map((ex, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{ex.exerciseName}</div>
                      <div className="text-sm text-gray-600">
                        {ex.sets && `${ex.sets} sets`} {ex.reps && `• ${ex.reps} reps`} {ex.weight && `• ${ex.weight} kg`}
                      </div>
                    </div>
                    {ex.oneRepMax && (
                      <div className="text-sm font-semibold text-purple-600">
                        {ex.oneRepMax} 1RM
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise History Modal */}
        {selectedExerciseHistory && exerciseHistory.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">History: {selectedExerciseHistory}</h2>
                <button
                  onClick={() => {
                    setSelectedExerciseHistory(null);
                    setExerciseHistory([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {exerciseHistory.map((log, idx) => (
                    <div key={log._id} className="border-l-4 border-indigo-500 pl-4 py-3 bg-indigo-50 rounded-r-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {new Date(log.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {log.sets && `${log.sets} sets`} {log.reps && `• ${log.reps} reps`} {log.weight && `• ${log.weight} kg`}
                          </div>
                        </div>
                        {log.oneRepMax && (
                          <div className="text-lg font-bold text-indigo-600">
                            {log.oneRepMax} 1RM
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Logs */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="text-yellow-500" size={24} />
            Today's Exercise Logs
          </h3>
          {todaysLogs.length > 0 ? (
            <div className="space-y-3">
              {todaysLogs.map(l => (
                <div key={l._id} className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div>
                    <div className="font-semibold text-gray-800">{l.exerciseName}</div>
                    <div className="text-sm text-gray-600">
                      {l.sets ? `${l.sets} sets • ` : ''}{l.reps ? `${l.reps} reps` : ''}{l.weight ? ` • ${l.weight} kg` : ''}
                    </div>
                    {l.notes && (
                      <div className="text-xs text-gray-500 mt-1 italic">{l.notes}</div>
                    )}
                  </div>
                  <div className="text-right">
                    {l.oneRepMax && (
                      <div className="text-lg font-bold text-purple-600">{l.oneRepMax} 1RM</div>
                    )}
                    <div className="text-xs text-gray-500">
                      {new Date(l.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No logs for today — add one!</p>
              <button 
                onClick={() => setShowAddExercise(true)} 
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700"
              >
                + Log Exercise
              </button>
            </div>
          )}
        </div>

        {/* Weight Progress Chart */}
        {metrics.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-purple-600" size={28} />
              Weight Progress
            </h2>
            <ProgressChart data={metrics} />
          </div>
        )}

        {/* Recent Workouts */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Activity className="text-purple-600" size={28} />
            Recent Workouts
          </h2>
          {workoutLogs.length > 0 ? (
            <div className="space-y-4">
              {workoutLogs.slice(0, 10).map((log) => (
                <div
                  key={log._id}
                  className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 rounded-r-xl hover:bg-purple-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {new Date(log.workoutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {log.exerciseCount || log.exercises?.length || 0} exercises • ~{log.duration || (log.exercises?.length || 0) * 5} minutes
                      </p>
                      {log.exercises && log.exercises.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {log.exercises.slice(0, 5).map((ex, idx) => (
                            <span key={idx} className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                              {ex.exerciseName}
                            </span>
                          ))}
                          {log.exercises.length > 5 && (
                            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                              +{log.exercises.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {log.completed && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                        <Star size={12} />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                No workout logs yet. Start logging your workouts!
              </p>
              <button
                onClick={() => setShowAddExercise(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700"
              >
                Log Your First Exercise
              </button>
            </div>
          )}
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Progress;
