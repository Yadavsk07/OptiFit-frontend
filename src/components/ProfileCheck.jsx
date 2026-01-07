import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

/**
 * Component that checks if user has completed their profile.
 * Redirects to onboarding if profile is incomplete.
 */
const ProfileCheck = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const response = await userAPI.getProfile();
        const profileData = response.data;

        // Check if profile is complete (has essential fields)
        const isComplete = profileData && (
          profileData.age || 
          profileData.height || 
          profileData.weight || 
          profileData.fitnessLevel || 
          profileData.fitnessGoal
        );

        setHasProfile(isComplete);
        setShouldRedirect(!isComplete);
      } catch (error) {
        // If profile doesn't exist or error, redirect to onboarding
        setHasProfile(false);
        setShouldRedirect(true);
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading) {
      checkProfile();
    }
  }, [user, authLoading]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProfileCheck;

