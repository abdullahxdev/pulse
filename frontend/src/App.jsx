import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Explore from './pages/Explore';
import Trending from './pages/Trending';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import { getCurrentUser } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      console.log('🔍 Checking auth...');
      console.log('Token:', token ? 'exists' : 'missing');

      if (token && userData) {
        // Fetch fresh user data with stats from the server
        const freshUserData = await getCurrentUser();
        if (freshUserData) {
          console.log('✅ User authenticated with stats:', freshUserData);
          setCurrentUser(freshUserData);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(freshUserData));
        } else {
          // Fallback to localStorage data if API fails
          const user = JSON.parse(userData);
          console.log('⚠️ Using cached user data:', user);
          setCurrentUser(user);
        }
      } else {
        console.log('❌ No authentication found');
      }
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (user) => {
    console.log('✅ Login successful:', user);
    // Set user immediately for quick UI response
    setCurrentUser(user);

    // Fetch fresh data with stats in background
    try {
      const freshUserData = await getCurrentUser();
      if (freshUserData) {
        console.log('✅ Updated user with stats:', freshUserData);
        setCurrentUser(freshUserData);
        localStorage.setItem('user', JSON.stringify(freshUserData));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Function to refresh user stats (can be called after follow/unfollow actions)
  const refreshUserStats = async () => {
    try {
      const freshUserData = await getCurrentUser();
      if (freshUserData) {
        setCurrentUser(freshUserData);
        localStorage.setItem('user', JSON.stringify(freshUserData));
      }
    } catch (error) {
      console.error('Error refreshing user stats:', error);
    }
  };

  const handleLogout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    console.log('✏️ User updated:', updatedUser);
    setCurrentUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-neutral-50 mb-2">Pulse</div>
          <div className="text-sm text-neutral-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        {currentUser ? (
          <>
            <Navbar 
              user={currentUser} 
              notificationCount={2} 
              messageCount={1}
              onLogout={handleLogout}
            />
            <div className="flex min-h-screen pt-[60px]">
              <Sidebar user={currentUser} />
              <main className="flex-1 ml-[250px] p-6 max-w-[1400px] transition-all lg:ml-[250px] md:ml-0">
                <Routes>
                  <Route path="/home" element={<Home currentUser={currentUser} onRefreshStats={refreshUserStats} />} />
                  <Route path="/profile/:userId" element={<Profile currentUser={currentUser} onRefreshStats={refreshUserStats} />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/messages" element={<Messages currentUser={currentUser} />} />
                  <Route path="/explore" element={<Explore currentUser={currentUser} onRefreshStats={refreshUserStats} />} />
                  <Route path="/trending" element={<Trending currentUser={currentUser} />} />
                  <Route path="/saved" element={<Saved currentUser={currentUser} />} />
                  <Route path="/settings" element={<Settings currentUser={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;