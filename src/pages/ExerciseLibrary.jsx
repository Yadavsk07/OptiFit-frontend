import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exerciseAPI } from '../services/api';
import { Search, Filter } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import ChatBot from '../components/ChatBot';

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    muscleGroup: '',
    equipment: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm || undefined
      };
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await exerciseAPI.getAll(params);
      setExercises(response.data?.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchExercises();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Exercise Library
          </h1>
          <p className="text-gray-600 text-lg">Browse our comprehensive collection of exercises</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-r-xl hover:from-indigo-700 hover:to-purple-700 transform transition-all hover:scale-105 shadow-lg"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            <select
              name="muscleGroup"
              value={filters.muscleGroup}
              onChange={handleFilterChange}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">All Muscle Groups</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="core">Core</option>
            </select>

            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Exercise Grid */}
        {!loading && exercises.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise._id} exercise={exercise} />
            ))}
          </div>
        ) : !loading ? (
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
            <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-purple-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">No Exercises Found</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {searchTerm || filters.muscleGroup || filters.equipment || filters.difficulty
                ? 'Try adjusting your search or filters to find exercises.'
                : 'No exercises available. Please seed the exercise database.'}
            </p>
            {(searchTerm || filters.muscleGroup || filters.equipment || filters.difficulty) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ muscleGroup: '', equipment: '', difficulty: '' });
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : null}
      </div>

      <ChatBot />
    </div>
  );
};

export default ExerciseLibrary;