import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, MessageCircle, LogOut } from 'lucide-react';

const Navbar = ({ user, notificationCount = 0, messageCount = 0, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] bg-dark-card border-b border-dark-border z-[100]">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 gap-6">
        {/* Logo */}
        <Link to="/home" className="text-neutral-50 font-semibold text-xl tracking-tight hover:text-neutral-300 transition-colors">
          Pulse
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[500px] relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-all"
          />
        </form>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2.5 rounded-lg text-neutral-400 hover:bg-dark-hover hover:text-neutral-50 transition-all"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {notificationCount}
              </span>
            )}
          </Link>

          {/* Messages */}
          <Link
            to="/messages"
            className="relative p-2.5 rounded-lg text-neutral-400 hover:bg-dark-hover hover:text-neutral-50 transition-all"
          >
            <MessageCircle size={20} />
            {messageCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {messageCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to={`/profile/${user?.user_id}`}
            className="p-2 rounded-lg hover:bg-dark-hover transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-medium text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-lg text-neutral-400 hover:bg-dark-hover hover:text-neutral-50 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
