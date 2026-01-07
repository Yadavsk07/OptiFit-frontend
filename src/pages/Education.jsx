import { Book, Target, Heart, Zap } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const Education = () => {
  const articles = [
    {
      id: 1,
      title: 'Understanding Muscle Groups',
      icon: <Zap className="text-yellow-600" size={32} />,
      content: `The human body has over 600 muscles, but bodybuilders typically focus on major muscle groups:
      
      - Chest (Pectorals): Push movements
      - Back (Latissimus Dorsi, Traps): Pull movements
      - Legs (Quadriceps, Hamstrings, Calves): Lower body power
      - Shoulders (Deltoids): Overhead and lateral movements
      - Arms (Biceps, Triceps): Arm flexion and extension
      - Core (Abdominals, Obliques): Stability and balance`
    },
    {
      id: 2,
      title: 'Progressive Overload',
      icon: <Target className="text-blue-600" size={32} />,
      content: `Progressive overload is the gradual increase of stress placed on the body during exercise. This is the fundamental principle of strength training and muscle growth.

      Ways to apply progressive overload:
      - Increase weight lifted
      - Increase number of reps
      - Increase number of sets
      - Decrease rest time between sets
      - Increase training frequency
      - Improve exercise form and range of motion`
    },
    {
      id: 3,
      title: 'Nutrition Basics for Fitness',
      icon: <Heart className="text-red-600" size={32} />,
      content: `Proper nutrition is 70% of your fitness success:

      Macronutrients:
      - Protein: 1.6-2.2g per kg body weight (muscle building)
      - Carbohydrates: Energy for workouts
      - Fats: Hormone production and vitamin absorption

      Meal Timing:
      - Pre-workout: Carbs + moderate protein (1-2 hours before)
      - Post-workout: Protein + carbs (within 2 hours)
      - Throughout day: Balanced meals every 3-4 hours`
    },
    {
      id: 4,
      title: 'Common Gym Myths Debunked',
      icon: <Book className="text-green-600" size={32} />,
      content: `Let's bust some common fitness myths:

      Myth 1: "Lifting weights makes women bulky"
      Truth: Women have significantly less testosterone than men, making it very difficult to build large muscles without specific training and diet.

      Myth 2: "You can spot reduce fat"
      Truth: Fat loss occurs throughout the body, not in specific areas. Targeted exercises strengthen muscles but don't burn fat in that specific area.

      Myth 3: "More cardio = more weight loss"
      Truth: Weight training is equally important as it builds muscle, which increases metabolism and burns more calories at rest.

      Myth 4: "No pain, no gain"
      Truth: Muscle soreness is not required for muscle growth. Proper form and progressive overload matter more.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Fitness Education
          </h1>
          <p className="text-gray-600 text-lg">Learn the fundamentals of fitness and nutrition</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-xl mr-4">
                  {article.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{article.title}</h2>
              </div>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                {article.content}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 md:p-8 rounded-2xl shadow-xl text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-orange-100 mb-6 text-lg">
            Use our AI chatbot to ask specific questions about exercises, nutrition,
            muscle anatomy, or any fitness-related topic!
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transform transition-all hover:scale-105 shadow-lg hover:shadow-xl">
            Ask the AI Assistant
          </button>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Education;