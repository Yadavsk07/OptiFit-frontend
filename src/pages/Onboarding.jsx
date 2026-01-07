import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    fitnessLevel: 'beginner',
    fitnessGoal: 'muscle_gain',
    injuries: '',
    workoutDaysPerWeek: 3,
    sessionDuration: 60,
    availableEquipment: 'gym',
    dietaryPreference: 'non-vegetarian'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [editing, setEditing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await userAPI.getProfile();
        if (res && res.data) {
          // Backend returns the profile object (or null)
          if (res.data.age || res.data.height || res.data.weight || res.data.fitnessLevel) {
            setFormData(prev => ({ ...prev, ...res.data }));
            setIsExisting(true);
            setEditing(false);
          }
        }
      } catch (err) {
        // ignore - no profile yet or not authorized
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const wasExisting = isExisting;
    try {
      const res = await userAPI.saveProfile(formData);
      setIsExisting(true);
      setEditing(false);
      setSuccess('Profile saved successfully');
      
      // Redirect to dashboard after profile completion (for new users)
      if (!wasExisting) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {!isExisting ? 'Complete Your Profile' : (editing ? 'Edit Your Profile' : 'Your Profile')}
          </h2>
          <p className="text-gray-600">Let's personalize your fitness journey</p>

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-7.414 7.414a1 1 0 01-1.414 0L3.293 9.207a1 1 0 011.414-1.414L8 10.086l6.293-6.293a1 1 0 011.414 0z" />
              </svg>
              {success}
            </div>
          )}
        </div>

        {/* Profile summary or Progress Bar + Steps */}
        {isExisting && !editing ? (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                { (formData.fitnessGoal && formData.fitnessGoal[0].toUpperCase()) || 'U' }
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">Your Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Personalized for <strong>{String(formData.fitnessGoal || 'general').replace('_', ' ')}</strong></p>

                <div className="mt-3 flex gap-3">
                  <div className="px-3 py-2 bg-white rounded-lg shadow-sm text-sm">
                    <div className="font-semibold text-gray-800">{formData.age || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Age</div>
                  </div>
                  <div className="px-3 py-2 bg-white rounded-lg shadow-sm text-sm">
                    <div className="font-semibold text-gray-800">{formData.weight ? `${formData.weight} kg` : 'N/A'}</div>
                    <div className="text-xs text-gray-400">Weight</div>
                  </div>
                  <div className="px-3 py-2 bg-white rounded-lg shadow-sm text-sm">
                    <div className="font-semibold text-gray-800">{formData.height ? `${formData.height} cm` : 'N/A'}</div>
                    <div className="text-xs text-gray-400">Height</div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => { setEditing(true); setStep(1); }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-gray-700">
              <div><strong>Fitness Level:</strong> {formData.fitnessLevel || 'N/A'}</div>
              <div><strong>Goal:</strong> {formData.fitnessGoal || 'N/A'}</div>
              <div><strong>Workout Days:</strong> {formData.workoutDaysPerWeek || 'N/A'}</div>
              <div><strong>Session Duration:</strong> {formData.sessionDuration ? `${formData.sessionDuration} min` : 'N/A'}</div>
              <div><strong>Equipment:</strong> {formData.availableEquipment || 'N/A'}</div>
              <div><strong>Diet:</strong> {formData.dietaryPreference || 'N/A'}</div>
              <div className="col-span-2"><strong>Notes:</strong> {formData.injuries || 'None'}</div>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Step {step} of 3</span>
                <span className="text-sm font-semibold text-gray-700">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
          </div>
        )}

        {/* Step 2: Fitness Info */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
              Fitness Goals
            </h3>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Fitness Level
              </label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Fitness Goal
              </label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintain">Maintain</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Workout Days Per Week
              </label>
              <input
                type="number"
                name="workoutDaysPerWeek"
                min="1"
                max="7"
                value={formData.workoutDaysPerWeek}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Session Duration (minutes)
              </label>
              <input
                type="number"
                name="sessionDuration"
                value={formData.sessionDuration}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
              Preferences
            </h3>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Available Equipment
              </label>
              <select
                name="availableEquipment"
                value={formData.availableEquipment}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="gym">Full Gym</option>
                <option value="home">Home Equipment</option>
                <option value="bodyweight">Bodyweight Only</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Dietary Preference
              </label>
              <select
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Injuries or Limitations (Optional)
              </label>
              <textarea
                name="injuries"
                value={formData.injuries}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                rows="3"
                placeholder="Any injuries or physical limitations..."
              />
            </div>
          </div>
        )}
          </>
        )}

    {/* Navigation Buttons */}
    {editing && (
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              isExisting ? 'Save Changes' : 'Complete ✓'
            )}
          </button>
        )}
      </div>
    )}
  </div>
</div>
);
};
export default Onboarding;