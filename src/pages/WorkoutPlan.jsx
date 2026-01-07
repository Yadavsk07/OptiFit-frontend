import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../services/api';
import { Dumbbell, RefreshCw, Calendar } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const WorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [showFull, setShowFull] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const tryParse = (text) => {
    if (!text) return null;
    try { return typeof text === 'string' ? JSON.parse(text) : text; } catch (e) {
      const match = String(text).match(/\{[\s\S]*\}/);
      if (match) {
        try { return JSON.parse(match[0]); } catch (err) { return null; }
      }
      return null;
    }
  };

  // Normalize the plan object so UI uses a consistent structure even if the backend stores nested keys or 'raw' text
  const plan = useMemo(() => {
    if (!workoutPlan) return null;

    let p = workoutPlan;
    // If server returned { plan: {...} }
    if (workoutPlan.plan && typeof workoutPlan.plan === 'object') p = workoutPlan.plan;
    // If server nested under workoutPlan.workoutPlan
    if (workoutPlan.workoutPlan && typeof workoutPlan.workoutPlan === 'object') p = workoutPlan.workoutPlan;

    // If p is still a string (raw json text), try to parse
    if (typeof p === 'string') {
      const parsed = tryParse(p);
      if (parsed) p = parsed;
    }

    // If p lacks weeklySchedule, try to extract from p.raw or any string summary
    if ((!p.weeklySchedule || !Array.isArray(p.weeklySchedule)) && p.raw) {
      const parsedRaw = tryParse(p.raw);
      if (parsedRaw && parsedRaw.weeklySchedule) {
        p = { ...p, ...parsedRaw };
      }
    }

    // Try to pull schedule from several common fields
    const schedule = p.weeklySchedule || p.weekly_split?.weeklySchedule || p.weeklySplit?.weeklySchedule || tryParse(p.raw)?.weeklySchedule || null;

    // Helper to remove any HTML tags and suspicious token patterns (like className=...) from AI text
    const sanitize = (txt) => {
      if (!txt && txt !== 0) return '';
      let s = String(txt);
      // remove HTML tags
      s = s.replace(/<[^>]*>/g, '');
      // remove common attribute tokens that might be included in raw AI output
      s = s.replace(/className\s*=\s*"[^"]*"/g, '');
      s = s.replace(/class\s*=\s*"[^"]*"/g, '');
      return s.trim();
    };

    // attach sanitized raw/summary for safe display later
    const sanitizedRaw = sanitize(p.raw || p.summary || p.textPlan || '');
    const sanitizedSummary = sanitize(p.summary || p.raw || p.textPlan || '');

    return { ...p, weeklySchedule: schedule, sanitizedRaw, sanitizedSummary };
  }, [workoutPlan]);

  const summaryRef = useRef(null);
  const viewSummary = () => {
    setShowFull(true);
    setTimeout(() => {
      if (summaryRef && summaryRef.current) summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  useEffect(() => {
    fetchWorkoutPlan();

    const handler = (e) => {
      if (e.detail?.type === 'workout') {
        // plan was updated via chat, refresh
        fetchWorkoutPlan();
      }
    };

    window.addEventListener('planUpdated', handler);
    return () => window.removeEventListener('planUpdated', handler);
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await workoutAPI.getActivePlan();
      setWorkoutPlan(response.data.workoutPlan);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const generateNewPlan = async () => {
    setGenerating(true);
    try {
      const response = await workoutAPI.generatePlan();
      // If server returned a plan use it, otherwise fetch latest plan from server as a fallback
      if (response?.data?.workoutPlan) {
        setWorkoutPlan(response.data.workoutPlan);
      } else {
        console.warn('generateNewPlan: server did not return workoutPlan; fetching latest plan.');
        await fetchWorkoutPlan();
      }

      const planResp = response?.data?.workoutPlan;
      if (planResp?.fallback) {
        alert('New workout plan generated (auto-estimated fallback).');
      } else if (planResp?.extractedFromText) {
        alert('New workout plan generated (auto-extracted from AI text).');
      } else {
        alert('New workout plan generated successfully!');
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      if (error.response?.data?.message === 'Profile not found') {
        if (window.confirm('No profile found. Would you like to complete your profile now?')) {
          navigate('/onboarding');
        }
      } else {
        alert('Failed to generate workout plan. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading workout plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Workout Plan
            </h1>
            <p className="text-gray-600">Your personalized fitness routine</p>
          </div>
          <button
            onClick={generateNewPlan}
            disabled={generating}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
            <span>{generating ? 'Generating...' : 'Generate New Plan'}</span>
          </button>
        </div>

        {workoutPlan ? (
          <div>
            {/* Plan Info */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 md:p-8 rounded-2xl shadow-xl text-white mb-8">
              <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-bold">{plan?.planName || workoutPlan?.planName || 'Your Workout Plan'}</h2>
              {plan?.fallback && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md font-semibold">Auto-estimated</span>
              )}
              {plan?.extractedFromText && (
                <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-md font-semibold">Auto-extracted</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <Calendar className="mr-2" size={20} />
                <span>
                  Start: {(plan?.startDate || workoutPlan?.startDate) ? new Date(plan?.startDate || workoutPlan?.startDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <Dumbbell className="mr-2" size={20} />
                <span>{plan?.weeklySchedule ? plan.weeklySchedule.length : 'N/A'} Days/Week</span>
              </div>
            </div>
            </div>

            {/* Weekly Schedule */}
            <div className="grid md:grid-cols-2 gap-6">
              {plan?.weeklySchedule && plan.weeklySchedule.length > 0 ? (
                plan.weeklySchedule.map((daySchedule, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-blue-600 flex items-center">
                        <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        {daySchedule.day || daySchedule.name || `Day ${index+1}`}
                      </h3>

                      {/* Quick link to summary when day refers to summary */}
                      {(daySchedule.exercises && daySchedule.exercises.length && /unstructured|check summary|refer to plan summary|see plan summary|see summary/i.test(daySchedule.exercises[0].exerciseName || daySchedule.exercises[0].notes || '')) && (
                        <button onClick={viewSummary} className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">View Summary</button>
                      )}
                    </div>

                    {daySchedule.exercises && daySchedule.exercises.length > 0 ? (
                      <div className="space-y-4">
                        {daySchedule.exercises.map((exercise, exIndex) => (
                          <div
                            key={exIndex}
                            className="border-l-4 border-indigo-500 pl-4 py-3 bg-indigo-50 rounded-r-lg"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-bold text-lg text-gray-800 mb-1">
                                  {exercise.exerciseName || exercise.name}
                                </h4>
                                <div className="text-sm text-gray-600">{exercise.muscleGroup || exercise.target || ''}</div>
                              </div>

                              <div className="text-right text-sm text-gray-600">
                                {exercise.equipment && <div className="mb-1">🧰 {exercise.equipment}</div>}
                                {exercise.intensity && <div className="mb-1">⚡ {exercise.intensity}</div>}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                              <div className="bg-white px-3 py-1 rounded-lg">
                                <span className="text-gray-600">Sets:</span>
                                <span className="font-semibold text-gray-800 ml-1">{exercise.sets || exercise.set || '-'}</span>
                              </div>
                              <div className="bg-white px-3 py-1 rounded-lg">
                                <span className="text-gray-600">Reps:</span>
                                <span className="font-semibold text-gray-800 ml-1">{exercise.reps || exercise.rep || '-'}</span>
                              </div>
                              <div className="bg-white px-3 py-1 rounded-lg">
                                <span className="text-gray-600">Rest:</span>
                                <span className="font-semibold text-gray-800 ml-1">{exercise.restTime || exercise.rest || '-'}</span>
                              </div>
                            </div>

                            {exercise.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic bg-white px-3 py-2 rounded-lg">
                                💡 {exercise.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 font-semibold">Rest Day</p>
                        <p className="text-sm text-gray-400 mt-1">Recovery is important!</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl shadow-xl text-left col-span-2">
                  {workoutPlan.raw ? (
                    (() => {
                      const parsed = tryParse(workoutPlan.raw);
                      if (parsed) {
                        // If parsed has a weeklySchedule, render it neatly
                        if (parsed.weeklySchedule && parsed.weeklySchedule.length > 0) {
                          return (
                            <div>
                              <h3 className="text-xl font-semibold mb-4">Parsed Schedule</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                {parsed.weeklySchedule.map((day, idx) => (
                                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="font-bold text-gray-700 mb-2">{day.day || `Day ${idx+1}`}</div>
                                    {day.exercises && day.exercises.length ? (
                                      <ul className="text-sm text-gray-700 space-y-2">
                                        {day.exercises.map((ex, i) => (
                                          <li key={i} className="flex justify-between items-start">
                                            <div>
                                              <div className="font-semibold">{ex.exerciseName || ex.name}</div>
                                              <div className="text-xs text-gray-500">{ex.sets ? `${ex.sets} sets` : ''} {ex.reps ? `• ${ex.reps}` : ''}</div>
                                            </div>
                                            <div className="text-xs text-gray-500">{ex.restTime || ''}</div>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <div className="text-sm text-gray-500">No exercises listed.</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // Parsed JSON but no weeklySchedule: show structured summary where possible
                        const pretty = (obj) => JSON.stringify(obj, null, 2);
                        return (
                          <div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Plan Summary</h3>

                            {parsed.planName && (
                              <div className="mb-2">
                                <div className="text-lg font-semibold text-gray-800">{parsed.planName}</div>
                                {parsed.meta && (
                                  <div className="text-sm text-gray-500">{parsed.meta.sessionDuration ? `${parsed.meta.sessionDuration} min sessions • ` : ''}{parsed.meta.totalWeeks ? `${parsed.meta.totalWeeks} weeks` : ''}</div>
                                )}
                              </div>
                            )}

                            {parsed.weeklySplit?.recommended && (
                              <div className="mb-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-md">{parsed.weeklySplit.recommended}</div>
                            )}

                            {parsed.progressionPlan && (
                              <div className="mb-3">
                                <div className="font-medium text-gray-800">Progression</div>
                                <div className="text-sm text-gray-700">{typeof parsed.progressionPlan === 'string' ? parsed.progressionPlan : pretty(parsed.progressionPlan)}</div>
                              </div>
                            )}

                            <div ref={summaryRef} id="plan-summary" className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{showFull ? (plan?.sanitizedSummary || (parsed.summary || pretty(parsed))) : (plan?.sanitizedSummary ? `${(plan.sanitizedSummary).slice(0, 1000)}${plan.sanitizedSummary.length > 1000 ? '...' : ''}` : `${pretty(parsed).slice(0, 1000)}${pretty(parsed).length > 1000 ? '...' : ''}`)}</div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setShowFull(s => !s)}
                                className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-semibold hover:bg-blue-100"
                              >
                                {showFull ? 'Hide Summary' : 'Show Summary'}
                              </button>

                              <button
                                onClick={() => setShowRaw(r => !r)}
                                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                              >
                                {showRaw ? 'Hide Raw' : 'View Raw Output'}
                              </button>

                              <button
                                onClick={generateNewPlan}
                                className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700"
                              >
                                Regenerate
                              </button>
                            </div>

                            {showRaw && (
                              <pre className="mt-4 max-h-80 overflow-auto text-sm bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{plan?.sanitizedRaw || pretty(parsed)}</pre>
                            )}
                          </div>
                        );
                      }

                      // Not parseable JSON, show snippet with toggles
                      return (
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Plan Summary</h3>
                          <p className="text-gray-700 mb-4">This plan is not in a structured format. Click "Show Summary" to view the AI's text output or "View Raw Output" to inspect the raw model response.</p>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setShowFull(s => !s)}
                              className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-semibold hover:bg-blue-100"
                            >
                              {showFull ? 'Hide Summary' : 'Show Summary'}
                            </button>

                            <button
                              onClick={() => setShowRaw(r => !r)}
                              className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                            >
                              {showRaw ? 'Hide Raw' : 'View Raw Output'}
                            </button>

                            <button
                              onClick={generateNewPlan}
                              className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700"
                            >
                              Regenerate
                            </button>
                          </div>

                          {showFull && (
                            <div className="mt-6 text-left">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md max-h-72 overflow-auto">{plan?.sanitizedSummary || plan?.sanitizedRaw || String(workoutPlan.raw || '')}</pre>
                            </div>
                          )}

                          {showRaw && (
                            <pre className="mt-4 max-h-80 overflow-auto text-sm bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{plan?.sanitizedRaw || String(workoutPlan.raw || '')}</pre>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-gray-500">Detailed schedule not available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Dumbbell className="text-blue-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">No Workout Plan Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Generate your personalized workout plan based on your profile and goals.
            </p>
            <button
              onClick={generateNewPlan}
              disabled={generating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              {generating ? (
                <span className="flex items-center">
                  <RefreshCw className="animate-spin mr-2" size={20} />
                  Generating...
                </span>
              ) : (
                'Generate Workout Plan'
              )}
            </button>
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
};

export default WorkoutPlan;