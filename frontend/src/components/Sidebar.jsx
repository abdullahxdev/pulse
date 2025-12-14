import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, MessageCircle, Search, Hash, Bookmark, Settings } from 'lucide-react';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: `/profile/${user?.user_id}`, icon: User, label: 'Profile' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/trending', icon: Hash, label: 'Trending' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="fixed left-0 top-[60px] bottom-0 w-[250px] bg-dark-card border-r border-dark-border overflow-y-auto z-[90] scrollbar-custom">
      <div className="p-6 flex flex-col gap-6">
        {/* User Profile Card */}
        <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-xl p-5 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 border-[3px] border-dark-border">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-50 mb-1">
              {user?.username}
            </h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="flex justify-around pt-4 border-t border-dark-border">
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-semibold text-primary">
                {user?.posts_count || 0}
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                Posts
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-semibold text-primary">
                {user?.followers_count || 0}
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                Followers
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-semibold text-primary">
                {user?.following_count || 0}
              </span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                Following
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-dark-border text-center">
          <p className="text-xs text-slate-500 mb-1">© 2025 Pulse</p>
          <p className="text-[11px] text-slate-600">Made with 💙</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;