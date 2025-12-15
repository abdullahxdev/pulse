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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500">Loading Pulse...</div>
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
            />
            <div className="flex min-h-screen pt-[60px]">
              <Sidebar user={currentUser} />
              <main className="flex-1 ml-[250px] p-6 max-w-[1400px] transition-all lg:ml-[250px] md:ml-0">
                <Routes>
                  <Route path="/home" element={<Home currentUser={currentUser} />} />
                  <Route path="/profile/:userId" element={<Profile currentUser={currentUser} />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/messages" element={<Messages currentUser={currentUser} />} />
                  <Route path="/explore" element={<Explore currentUser={currentUser} />} />
                  <Route path="/trending" element={<Trending currentUser={currentUser} />} />
                  <Route path="/saved" element={<Saved currentUser={currentUser} />} />
                  <Route path="/settings" element={<Settings currentUser={currentUser} />} />
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