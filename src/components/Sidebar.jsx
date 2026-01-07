import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/workout-plan', icon: Dumbbell, label: 'Workout Plan' },
    { path: '/diet-plan', icon: UtensilsCrossed, label: 'Diet Plan' },
    { path: '/exercise-library', icon: BookOpen, label: 'Exercise Library' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/education', icon: BookOpen, label: 'Education' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-16">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <Link
            to="/chat"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

