import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exerciseAPI } from '../services/api';
import { ArrowLeft, Dumbbell, AlertCircle, Lightbulb } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    try {
      const response = await exerciseAPI.getById(id);
      // Handle both response.data.exercise and response.data
      const exerciseData = response.data.exercise || response.data;
      if (exerciseData) {
        // Map backend fields to frontend expectations
        const mappedExercise = {
          ...exerciseData,
          muscleGroups: exerciseData.primaryMuscle 
            ? [exerciseData.primaryMuscle, ...(exerciseData.secondaryMuscles || [])]
            : [],
          equipmentNeeded: exerciseData.equipment,
          commonMistakes: exerciseData.mistakes || [],
          tips: exerciseData.instructions?.slice(0, 3) || [],
          videoUrl: exerciseData.youtubeUrl,
          description: exerciseData.instructions?.join(' ') || ''
        };
        setExercise(mappedExercise);
      }
    } catch (error) {
      console.error('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 font-semibold">Exercise not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          to="/exercises"
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-semibold group transition-all"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Exercise Library
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Video Section */}
          {exercise.videoUrl ? (
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={exercise.videoUrl}
                title={exercise.name}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <Dumbbell className="text-gray-400" size={64} />
            </div>
          )}

          <div className="p-8 md:p-10">
            {/* Header */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {exercise.name}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {exercise.muscleGroups &&
                exercise.muscleGroups.map((muscle, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {muscle}
                  </span>
                ))}
              {exercise.difficulty && (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    exercise.difficulty === 'easy'
                      ? 'bg-green-100 text-green-700'
                      : exercise.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {exercise.difficulty}
                </span>
              )}
              {exercise.equipmentNeeded && (
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {exercise.equipmentNeeded}
                </span>
              )}
            </div>

            {/* Description */}
            {exercise.description && (
              <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {exercise.description}
                </p>
              </div>
            )}

            {/* Instructions */}
            {exercise.instructions && exercise.instructions.length > 0 && (
              <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">How to Perform</h2>
                <ol className="list-decimal list-inside space-y-3">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700 text-lg leading-relaxed">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Common Mistakes */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div className="mb-8 bg-red-50 p-6 md:p-8 rounded-2xl border-l-4 border-red-500">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-xl mr-3">
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-red-900">
                    Common Mistakes to Avoid
                  </h2>
                </div>
                <ul className="list-disc list-inside space-y-3">
                  {exercise.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-gray-700 text-lg">
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {exercise.tips && exercise.tips.length > 0 && (
              <div className="mb-8 bg-green-50 p-6 md:p-8 rounded-2xl border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-xl mr-3">
                    <Lightbulb className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-green-900">Pro Tips</h2>
                </div>
                <ul className="list-disc list-inside space-y-3">
                  {exercise.tips.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-lg">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alternatives */}
            {exercise.alternatives && exercise.alternatives.length > 0 && (
              <div className="bg-indigo-50 p-6 md:p-8 rounded-2xl border-l-4 border-indigo-500">
                <h2 className="text-2xl font-bold mb-4 text-indigo-900">
                  Alternative Exercises
                </h2>
                <ul className="list-disc list-inside space-y-3">
                  {exercise.alternatives.map((alt, index) => (
                    <li key={index} className="text-gray-700 text-lg">
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default ExerciseDetail;