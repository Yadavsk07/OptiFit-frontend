import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/profile'),
};

export const userAPI = {
  saveProfile: (data) => api.post('/profile', data),
  getProfile: () => api.get('/profile'),
};

export const workoutAPI = {
  generatePlan: () => api.post('/workout/generate'),
  // Backend exposes GET /api/workout for the latest plan
  getActivePlan: () => api.get('/workout'),
  getAllPlans: () => api.get('/workout/all'),
};

export const dietAPI = {
  generatePlan: () => api.post('/diet/generate'),
  // Backend exposes GET /api/diet for the latest plan
  getActivePlan: () => api.get('/diet'),
};

export const exerciseAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  create: (data) => api.post('/exercises', data),
};

export const progressAPI = {
  logWorkout: (data) => api.post('/progress/workout-log', data),
  getWorkoutLogs: (params) => api.get('/progress/workout-logs', { params }),
  addMetric: (data) => api.post('/progress/metric', data),
  getMetrics: () => api.get('/progress/metrics'),
  getStats: () => api.get('/progress/stats'),

  // New exercise log + progress summary endpoints
  logExercise: (data) => api.post('/progress/log', data),
  getSummary: () => api.get('/progress/summary'),
  getLeaderboard: (exercise, limit = 10) => api.get('/progress/leaderboard', { params: { exercise, limit } }),
  getExerciseHistory: (exerciseName) => api.get('/progress/exercise-history', { params: { exerciseName } }),
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
};

export default api;