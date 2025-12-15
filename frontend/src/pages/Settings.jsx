import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Eye, Shield, HelpCircle, LogOut } from 'lucide-react';

const Settings = ({ currentUser, onLogout }) => {
  const [activeSection, setActiveSection] = useState('account');

  // Form states
  const [accountData, setAccountData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.profile_info || ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    email: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    allowMessages: true,
    showActivity: true
  });

  const [theme, setTheme] = useState('Dark');

  // Load saved settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedPrivacy = localStorage.getItem('privacySettings');
    const savedTheme = localStorage.getItem('theme');

    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
    if (savedPrivacy) {
      setPrivacySettings(JSON.parse(savedPrivacy));
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    
    // Update user in localStorage
    const updatedUser = {
      ...currentUser,
      username: accountData.username,
      email: accountData.email,
      profile_info: accountData.bio
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    alert('Account settings saved! Please refresh the page to see changes.');
  };

  const handleNotificationToggle = (key) => {
    const updated = {...notificationSettings, [key]: !notificationSettings[key]};
    setNotificationSettings(updated);
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
  };

  const handlePrivacyToggle = (key) => {
    const updated = {...privacySettings, [key]: !privacySettings[key]};
    setPrivacySettings(updated);
    localStorage.setItem('privacySettings', JSON.stringify(updated));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'Light') {
      alert('Light theme will be available when backend is ready! 🌞');
    } else if (newTheme === 'Auto') {
      alert('Auto theme will sync with your system preferences when backend is ready! 🌓');
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const sections = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy & Security', icon: Lock },
    { key: 'appearance', label: 'Appearance', icon: Eye },
    { key: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3">
            <SettingsIcon size={28} className="text-primary" />
            <div>
              <h1 className="text-[28px] font-bold text-slate-50">Settings</h1>
              <p className="text-sm text-slate-400">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[250px_1fr] gap-4">
          
          {/* Sidebar Menu */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <nav className="flex flex-col gap-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                      activeSection === section.key
                        ? 'bg-primary text-white'
                        : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                    }`}
                  >
                    <Icon size={20} />
                    {section.label}
                  </button>
                );
              })}

              <div className="my-2 h-px bg-dark-border"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all text-left"
              >
                <LogOut size={20} />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-50 mb-4">
                  Account Settings
                </h2>
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-50 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={accountData.username}
                      onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-50 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-50 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={accountData.bio}
                      onChange={(e) => setAccountData({...accountData, bio: e.target.value})}
                      rows={4}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Save Changes
                    </button>
                    <span className="text-xs text-slate-400 flex items-center">
                      💡 Changes are saved locally. Full profile update will work with backend.
                    </span>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-50 mb-4">
                  Notification Settings
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Settings are saved automatically ✅
                </p>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-slate-50 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Get notified when someone {key === 'email' ? 'sends emails' : key} your posts
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-primary' : 'bg-dark-border'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-50 mb-4">
                  Privacy & Security
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Settings are saved automatically ✅
                </p>
                <div className="space-y-4">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-slate-50 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {key === 'profilePublic' && 'Make your profile visible to everyone'}
                          {key === 'showEmail' && 'Display email on your profile'}
                          {key === 'allowMessages' && 'Allow others to send you messages'}
                          {key === 'showActivity' && 'Show your activity status'}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle(key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-primary' : 'bg-dark-border'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  ))}

                  <div className="pt-4 space-y-3">
                    <button 
                      onClick={() => alert('Password change will work with backend 🔐')}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm font-medium hover:bg-dark-border transition-colors text-left"
                    >
                      Change Password
                    </button>
                    <button 
                      onClick={() => alert('Two-factor authentication will work with backend 🔒')}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm font-medium hover:bg-dark-border transition-colors text-left"
                    >
                      Two-Factor Authentication
                    </button>
                    <button 
                      onClick={() => alert('Account deletion will work with backend ⚠️')}
                      className="w-full py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors text-left"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-50 mb-4">
                  Appearance
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <h3 className="text-sm font-medium text-slate-50 mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['Dark', 'Light', 'Auto'].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => handleThemeChange(themeOption)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === themeOption
                              ? 'border-primary bg-primary/10'
                              : 'border-dark-border hover:border-dark-hover'
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-50">{themeOption}</div>
                          {themeOption === 'Dark' && <div className="text-xs text-slate-400 mt-1">Current</div>}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      💡 Light and Auto themes will be available with backend integration
                    </p>
                  </div>

                  <div className="p-4 bg-dark-bg rounded-lg">
                    <h3 className="text-sm font-medium text-slate-50 mb-3">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      defaultValue="14"
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      💡 Font size control will work with backend
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support */}
            {activeSection === 'help' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-50 mb-4">
                  Help & Support
                </h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => alert('FAQ section coming soon!')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-slate-50 mb-1">FAQ</h3>
                    <p className="text-xs text-slate-400">Find answers to common questions</p>
                  </button>
                  <button 
                    onClick={() => alert('Support system will be available with backend!')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-slate-50 mb-1">Contact Support</h3>
                    <p className="text-xs text-slate-400">Get help from our support team</p>
                  </button>
                  <button 
                    onClick={() => alert('Problem reporting will work with backend!')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-slate-50 mb-1">Report a Problem</h3>
                    <p className="text-xs text-slate-400">Let us know about issues you're experiencing</p>
                  </button>
                  <button 
                    onClick={() => alert('Pulse v1.0 - Built with React + Vite + Tailwind CSS 💙')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-slate-50 mb-1">About Pulse</h3>
                    <p className="text-xs text-slate-400">Learn more about our platform</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;