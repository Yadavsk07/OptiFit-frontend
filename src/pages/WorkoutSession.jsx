import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workoutAPI, progressAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import { Check, X, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

const WorkoutSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await workoutAPI.getActivePlan();
      const plan = response.data.workoutPlan;
      setWorkoutPlan(plan);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (exerciseIndex) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseIndex)) {
        newSet.delete(exerciseIndex);
      } else {
        newSet.add(exerciseIndex);
      }
      return newSet;
    });
  };

  const updateExerciseLog = (exerciseIndex, field, value) => {
    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        [field]: value,
      },
    }));
  };

  const handleSaveWorkout = async () => {
    setSaving(true);
    try {
      const currentDayData = workoutPlan?.weeklySchedule?.[currentDayIndex];
      if (!currentDayData || !currentDayData.exercises) {
        alert('No exercises found for this day');
        return;
      }

      // Log each completed exercise
      const exercisesToLog = currentDayData.exercises
        .filter((_, index) => completedExercises.has(index))
        .map((ex, index) => {
          const log = exerciseLogs[index] || {};
          return {
            exerciseName: ex.exerciseName || ex.name || 'Exercise',
            sets: log.sets || ex.sets || undefined,
            reps: log.reps || ex.reps || undefined,
            weight: log.weight || undefined,
            notes: log.notes || ex.notes || ''
          };
        });

      // Log all exercises to ExerciseLog
      for (const ex of exercisesToLog) {
        try {
          await progressAPI.logExercise({
            ...ex,
            date: new Date()
          });
        } catch (err) {
          console.error('Error logging exercise:', err);
        }
      }

      // Also log as a workout session
      if (exercisesToLog.length > 0) {
        try {
          await progressAPI.logWorkout({
            exercises: exercisesToLog,
            date: new Date(),
            notes: `Workout session - ${currentDayData.day || `Day ${currentDayIndex + 1}`}`
          });
        } catch (err) {
          console.error('Error logging workout:', err);
        }
      }

      alert(`Workout saved! Logged ${exercisesToLog.length} exercises.`);
      navigate('/progress');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!workoutPlan) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
              <p className="text-gray-600 text-lg">Workout plan not found. Please generate a workout plan first.</p>
              <button
                onClick={() => navigate('/workout-plan')}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700"
              >
                Go to Workout Plan
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const weeklySchedule = workoutPlan.weeklySchedule || [];
  const currentDayData = weeklySchedule[currentDayIndex];

  if (!currentDayData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">No workout day selected</h2>
              <button
                onClick={() => navigate('/workout-plan')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700"
              >
                Back to Workout Plan
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isRestDay = !currentDayData.exercises || currentDayData.exercises.length === 0 || 
                   (currentDayData.exercises.length === 1 && 
                    (currentDayData.exercises[0].exerciseName === 'Rest Day' || 
                     currentDayData.exercises[0].name === 'Rest Day'));

  if (isRestDay) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Rest Day</h2>
              <p className="text-gray-600 mb-6 text-lg">
                {currentDayData.day || `Day ${currentDayIndex + 1}`} is a rest day. Take time to recover!
              </p>
              <div className="flex gap-4 justify-center">
                {currentDayIndex > 0 && (
                  <button
                    onClick={() => setCurrentDayIndex(currentDayIndex - 1)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Previous Day
                  </button>
                )}
                {currentDayIndex < weeklySchedule.length - 1 && (
                  <button
                    onClick={() => setCurrentDayIndex(currentDayIndex + 1)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                  >
                    Next Day
                    <ArrowRight size={20} />
                  </button>
                )}
                <button
                  onClick={() => navigate('/workout-plan')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700"
                >
                  Back to Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {workoutPlan.planName || 'Workout Session'}
                </h1>
                <p className="text-gray-600 text-lg">
                  {currentDayData.day || `Day ${currentDayIndex + 1}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {currentDayIndex > 0 && (
                  <button
                    onClick={() => setCurrentDayIndex(currentDayIndex - 1)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Previous
                  </button>
                )}
                {currentDayIndex < weeklySchedule.length - 1 && (
                  <button
                    onClick={() => setCurrentDayIndex(currentDayIndex + 1)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-200 flex items-center gap-2"
                  >
                    Next
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Exercises */}
            <div className="space-y-6 mb-8">
              {currentDayData.exercises.map((exercise, index) => {
                const isCompleted = completedExercises.has(index);
                const log = exerciseLogs[index] || {};
                const exerciseName = exercise.exerciseName || exercise.name || 'Exercise';

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {exerciseName}
                        </h3>
                        {exercise.notes && (
                          <p className="text-gray-600 text-sm mt-1">
                            💡 {exercise.notes}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          {exercise.restTime && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              Rest: {exercise.restTime}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleExercise(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <X className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sets
                        </label>
                        <input
                          type="number"
                          value={log.sets || exercise.sets || ''}
                          onChange={(e) =>
                            updateExerciseLog(index, 'sets', e.target.value)
                          }
                          placeholder={exercise.sets || '0'}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Reps
                        </label>
                        <input
                          type="number"
                          value={log.reps || exercise.reps || ''}
                          onChange={(e) =>
                            updateExerciseLog(index, 'reps', e.target.value)
                          }
                          placeholder={exercise.reps || '0'}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={log.weight || ''}
                          onChange={(e) =>
                            updateExerciseLog(index, 'weight', e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {log.notes !== undefined && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={log.notes || ''}
                          onChange={(e) =>
                            updateExerciseLog(index, 'notes', e.target.value)
                          }
                          placeholder="Optional notes..."
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/workout-plan')}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWorkout}
                disabled={saving || completedExercises.size === 0}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold transform transition-all hover:scale-105 shadow-lg"
              >
                {saving ? 'Saving...' : `Complete Workout (${completedExercises.size} exercises)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WorkoutSession;

