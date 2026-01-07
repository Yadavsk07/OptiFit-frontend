import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dietAPI } from '../services/api';
import { Apple, RefreshCw, Utensils } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const DietPlan = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDietPlan();

    const handler = (e) => {
      if (e.detail?.type === 'diet') {
        // plan updated via chat
        fetchDietPlan();
      }
    };

    window.addEventListener('planUpdated', handler);
    return () => window.removeEventListener('planUpdated', handler);
  }, []);

  const fetchDietPlan = async () => {
    try {
      const response = await dietAPI.getActivePlan();
      setDietPlan(response.data.dietPlan);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const generateNewPlan = async () => {
    setGenerating(true);
    try {
      const response = await dietAPI.generatePlan();
      setDietPlan(response.data.dietPlan);
      alert('New diet plan generated successfully!');
    } catch (error) {
      console.error('Error generating diet plan:', error);
      if (error.response?.data?.message === 'Profile not found') {
        if (window.confirm('No profile found. Would you like to complete your profile now?')) {
          navigate('/onboarding');
        }
      } else {
        alert('Failed to generate diet plan. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading diet plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Your Diet Plan
            </h1>
            <p className="text-gray-600">Your personalized nutrition guide</p>
          </div>
          <button
            onClick={generateNewPlan}
            disabled={generating}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            <RefreshCw size={20} className={generating ? 'animate-spin' : ''} />
            <span>{generating ? 'Generating...' : 'Generate New Plan'}</span>
          </button>
        </div>

        {dietPlan ? (
          <div>
            {/* Macros Overview */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Daily Nutrition Goals</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white transform transition-all hover:scale-105 shadow-lg">
                  <p className="text-blue-100 text-sm font-medium mb-2">Calories</p>
                  <p className="text-3xl font-bold">
                    {dietPlan.dailyCalories ?? dietPlan.macros?.calories ?? 'N/A'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white transform transition-all hover:scale-105 shadow-lg">
                  <p className="text-green-100 text-sm font-medium mb-2">Protein</p>
                  <p className="text-3xl font-bold">
                    {(dietPlan.protein ?? dietPlan.macros?.protein) ? `${dietPlan.protein ?? dietPlan.macros?.protein}g` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-6 rounded-xl text-white transform transition-all hover:scale-105 shadow-lg">
                  <p className="text-yellow-100 text-sm font-medium mb-2">Carbs</p>
                  <p className="text-3xl font-bold">
                    {(dietPlan.carbs ?? dietPlan.macros?.carbs) ? `${dietPlan.carbs ?? dietPlan.macros?.carbs}g` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white transform transition-all hover:scale-105 shadow-lg">
                  <p className="text-orange-100 text-sm font-medium mb-2">Fats</p>
                  <p className="text-3xl font-bold">
                    {(dietPlan.fats ?? dietPlan.macros?.fats) ? `${dietPlan.fats ?? dietPlan.macros?.fats}g` : 'N/A'}
                  </p>
                </div>
              </div>

              {dietPlan.hydration && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border-l-4 border-cyan-500">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">💧 Hydration:</strong> <span className="text-gray-700">{dietPlan.hydration}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Meal Plan */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {dietPlan.meals && dietPlan.meals.length > 0 ? (
                dietPlan.meals.map((meal, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center mb-6">
                      <div className="bg-green-100 p-3 rounded-xl mr-3">
                        <Utensils className="text-green-600" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold capitalize text-gray-800">
                        {meal.mealType}
                      </h3>
                    </div>

                    {meal.foods && meal.foods.length > 0 && (
                      <div className="space-y-3">
                        {meal.foods.map((food, foodIndex) => (
                          <div
                            key={foodIndex}
                            className="flex justify-between items-center bg-green-50 p-4 rounded-xl border-l-4 border-green-500"
                          >
                            <div>
                              <p className="font-bold text-gray-800">{food.name}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {food.quantity}
                              </p>
                            </div>
                            {food.calories && (
                              <div className="text-right">
                                <p className="font-bold text-green-600 text-lg">
                                  {food.calories} cal
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center col-span-2">
                  {dietPlan.summary ? (
                    <pre className="text-left whitespace-pre-wrap">{dietPlan.summary}</pre>
                  ) : (
                    <p className="text-gray-500">No meal details available</p>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Nutrition Tips
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Eat meals at consistent times each day</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Drink water throughout the day, especially before meals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Include a variety of colorful vegetables</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Prepare meals in advance when possible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Listen to your body's hunger and fullness cues</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Apple className="text-green-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">No Diet Plan Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Generate your personalized diet plan based on your profile and goals.
            </p>
            <button
              onClick={generateNewPlan}
              disabled={generating}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              {generating ? (
                <span className="flex items-center">
                  <RefreshCw className="animate-spin mr-2" size={20} />
                  Generating...
                </span>
              ) : (
                'Generate Diet Plan'
              )}
            </button>
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
};

export default DietPlan;