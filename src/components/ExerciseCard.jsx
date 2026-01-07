import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const ExerciseCard = ({ exercise }) => {
  return (
    <Link to={`/exercise/${exercise._id}`}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden border border-gray-100 group">
        {exercise.thumbnailUrl ? (
          <div className="relative overflow-hidden">
            <img
              src={exercise.thumbnailUrl}
              alt={exercise.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
            <Dumbbell className="text-indigo-400 group-hover:text-indigo-500 transition-colors" size={48} />
          </div>
        )}

        <div className="p-5">
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
            {exercise.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {exercise.primaryMuscle && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                {exercise.primaryMuscle}
              </span>
            )}
            {exercise.muscleGroups &&
              exercise.muscleGroups.slice(0, 2).map((muscle, index) => (
                <span
                  key={index}
                  className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium"
                >
                  {muscle}
                </span>
              ))}
          </div>

          <div className="flex items-center justify-between">
            {exercise.difficulty && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
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

            {(exercise.equipmentNeeded || exercise.equipment) && (
              <p className="text-xs text-gray-500 font-medium">
                {exercise.equipmentNeeded || exercise.equipment}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExerciseCard;