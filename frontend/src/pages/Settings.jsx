import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Eye, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = ({ currentUser }) => {
  const navigate = useNavigate();
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

  const handleSaveAccount = (e) => {
    e.preventDefault();
    alert('Account settings saved! (Mock function)');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Save Changes
                    </button>
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
                        onClick={() => setNotificationSettings({...notificationSettings, [key]: !value})}
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
                        onClick={() => setPrivacySettings({...privacySettings, [key]: !value})}
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
                    <button className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm font-medium hover:bg-dark-border transition-colors text-left">
                      Change Password
                    </button>
                    <button className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm font-medium hover:bg-dark-border transition-colors text-left">
                      Two-Factor Authentication
                    </button>
                    <button className="w-full py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors text-left">
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
                      {['Dark', 'Light', 'Auto'].map((theme) => (
                        <button
                          key={theme}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === 'Dark'
                              ? 'border-primary bg-primary/10'
                              : 'border-dark-border hover:border-dark-hover'
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-50">{theme}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-dark-bg rounded-lg">
                    <h3 className="text-sm font-medium text-slate-50 mb-3">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      defaultValue="14"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
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
                  <button className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors">
                    <h3 className="text-sm font-medium text-slate-50 mb-1">FAQ</h3>
                    <p className="text-xs text-slate-400">Find answers to common questions</p>
                  </button>
                  <button className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors">
                    <h3 className="text-sm font-medium text-slate-50 mb-1">Contact Support</h3>
                    <p className="text-xs text-slate-400">Get help from our support team</p>
                  </button>
                  <button className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors">
                    <h3 className="text-sm font-medium text-slate-50 mb-1">Report a Problem</h3>
                    <p className="text-xs text-slate-400">Let us know about issues you're experiencing</p>
                  </button>
                  <button className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors">
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