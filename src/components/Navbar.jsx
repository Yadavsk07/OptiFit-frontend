import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-transform hover:scale-105"
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
              <Dumbbell size={28} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">OptiFit</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-1">
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/workout-plan" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/workout-plan') 
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Workout
                </Link>
                <Link 
                  to="/diet-plan" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/diet-plan') 
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Diet
                </Link>
                <Link 
                  to="/exercises" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/exercises') 
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Exercises
                </Link>
                <Link 
                  to="/progress" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/progress') 
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Progress
                </Link>
                <Link
                  to="/onboarding"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/onboarding')
                      ? 'bg-white bg-opacity-20 font-semibold shadow-lg'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 ml-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white border-opacity-20">
            <Link 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all ${
                isActive('/dashboard') 
                  ? 'bg-white bg-opacity-20 font-semibold' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/workout-plan" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all ${
                isActive('/workout-plan') 
                  ? 'bg-white bg-opacity-20 font-semibold' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Workout
            </Link>
            <Link 
              to="/diet-plan" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all ${
                isActive('/diet-plan') 
                  ? 'bg-white bg-opacity-20 font-semibold' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Diet
            </Link>
            <Link 
              to="/exercises" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all ${
                isActive('/exercises') 
                  ? 'bg-white bg-opacity-20 font-semibold' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Exercises
            </Link>
            <Link 
              to="/progress" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all ${
                isActive('/progress') 
                  ? 'bg-white bg-opacity-20 font-semibold' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Progress
            </Link>
            <Link
              to="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all ${
                isActive('/onboarding')
                  ? 'bg-white bg-opacity-20 font-semibold'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-left"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;