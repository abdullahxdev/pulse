import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';

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
              <main className="flex-1 ml-[250px] p-6 max-w-[1200px] transition-all lg:ml-[250px] md:ml-0">
                <Routes>
                  <Route path="/home" element={<Home currentUser={currentUser} />} />
                  <Route path="/profile/:userId" element={<Profile currentUser={currentUser} />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/messages" element={<Messages currentUser={currentUser} />} />
                  <Route path="/explore" element={<PlaceholderPage title="Explore" />} />
                  <Route path="/trending" element={<PlaceholderPage title="Trending" />} />
                  <Route path="/saved" element={<PlaceholderPage title="Saved Posts" />} />
                  <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
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

const PlaceholderPage = ({ title }) => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
        <h2 className="text-2xl font-semibold text-slate-50 mb-3">{title}</h2>
        <p className="text-slate-400 mb-2">This page is coming soon!</p>
        <p className="text-sm text-slate-500">
          This is a placeholder for the {title.toLowerCase()} feature. 
          It will be implemented in future updates.
        </p>
      </div>
    </div>
  );
};

export default App;