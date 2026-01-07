import { Calendar, Clock, Target } from 'lucide-react';

const WorkoutCard = ({ workout, onClick }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {workout.planName || 'Workout Plan'}
        </h3>
        {workout.isActive && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        {workout.startDate && (
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {formatDate(workout.startDate)} -{' '}
              {workout.endDate ? formatDate(workout.endDate) : 'Ongoing'}
            </span>
          </div>
        )}

        {workout.weeklySchedule && (
          <div className="flex items-center text-gray-600">
            <Target className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {workout.weeklySchedule.length} days per week
            </span>
          </div>
        )}

        {workout.weeklySchedule && workout.weeklySchedule.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">This week's schedule:</p>
            <div className="flex flex-wrap gap-2">
              {workout.weeklySchedule.slice(0, 3).map((day, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {day.day}
                </span>
              ))}
              {workout.weeklySchedule.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{workout.weeklySchedule.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;

