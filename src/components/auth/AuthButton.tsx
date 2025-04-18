import React, { useState, useEffect } from 'react';
import { FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { loadGoogleApi, isSignedIn, signIn, signOut, getUserProfile } from '../../lib/api/googleAuth';

interface AuthButtonProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onAuthChange }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Initialize Google API
  useEffect(() => {
    const initializeGoogleApi = async () => {
      try {
        await loadGoogleApi();
        const authStatus = isSignedIn();
        setAuthenticated(authStatus);
        if (authStatus) {
          setUserProfile(getUserProfile());
        }
        if (onAuthChange) {
          onAuthChange(authStatus);
        }
      } catch (error) {
        console.error('Error initializing Google API:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeGoogleApi();
  }, [onAuthChange]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn();
      setAuthenticated(true);
      setUserProfile(getUserProfile());
      if (onAuthChange) {
        onAuthChange(true);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setAuthenticated(false);
      setUserProfile(null);
      if (onAuthChange) {
        onAuthChange(false);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed" disabled>
        <span className="animate-pulse">Đang tải...</span>
      </button>
    );
  }

  if (authenticated && userProfile) {
    return (
      <div className="flex items-center">
        <div className="mr-3 hidden md:block">
          <div className="flex items-center">
            <img 
              src={userProfile.imageUrl} 
              alt={userProfile.name} 
              className="w-8 h-8 rounded-full mr-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
              }}
            />
            <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="mr-2" /> Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleSignIn}
      className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
    >
      <FiLogIn className="mr-2" /> Đăng nhập với Google
    </button>
  );
};

export default AuthButton;
