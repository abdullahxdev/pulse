import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, HelpCircle, LogOut } from 'lucide-react';
import { updateProfile } from '../services/api';

const Settings = ({ currentUser, onLogout, onUserUpdate }) => {
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

  // Load saved settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');

    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, []);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    try {
      const result = await updateProfile({
        username: accountData.username,
        email: accountData.email,
        profile_info: accountData.bio
      });

      if (result.success) {
        // Update localStorage with new user data
        const updatedUser = {
          ...currentUser,
          username: result.user.username,
          email: result.user.email,
          profile_info: result.user.profile_info
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Notify parent component to update currentUser state
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }

        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setSaveMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = (key) => {
    const updated = {...notificationSettings, [key]: !notificationSettings[key]};
    setNotificationSettings(updated);
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const sections = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3">
            <SettingsIcon size={28} className="text-neutral-400" />
            <div>
              <h1 className="text-[28px] font-bold text-neutral-50">Settings</h1>
              <p className="text-sm text-neutral-400">
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
                        ? 'bg-neutral-50 text-neutral-900'
                        : 'text-neutral-400 hover:bg-dark-border hover:text-neutral-50'
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
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">
                  Account Settings
                </h2>
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-50 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={accountData.username}
                      onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-50 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-50 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={accountData.bio}
                      onChange={(e) => setAccountData({...accountData, bio: e.target.value})}
                      rows={4}
                      className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-neutral-50 text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                    {saveMessage && (
                      <div className={`text-sm p-3 rounded-lg ${
                        saveMessage.type === 'success'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {saveMessage.text}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">
                  Notification Settings
                </h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Settings are saved automatically
                </p>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-50 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1">
                          Get notified when someone {key === 'email' ? 'sends emails' : key} your posts
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-neutral-50' : 'bg-dark-border'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${
                          value ? 'translate-x-7 bg-neutral-900' : 'translate-x-1 bg-neutral-400'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help & Support */}
            {activeSection === 'help' && (
              <div>
                <h2 className="text-xl font-semibold text-neutral-50 mb-4">
                  Help & Support
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('FAQ section coming soon!')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-neutral-50 mb-1">FAQ</h3>
                    <p className="text-xs text-neutral-400">Find answers to common questions</p>
                  </button>
                  <button
                    onClick={() => alert('Support system will be available with backend!')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-neutral-50 mb-1">Contact Support</h3>
                    <p className="text-xs text-neutral-400">Get help from our support team</p>
                  </button>
                  <button
                    onClick={() => alert('Problem reporting will work with backend!')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-neutral-50 mb-1">Report a Problem</h3>
                    <p className="text-xs text-neutral-400">Let us know about issues you're experiencing</p>
                  </button>
                  <button
                    onClick={() => alert('Pulse v1.0 - Built with React + Vite + Tailwind CSS')}
                    className="w-full p-4 bg-dark-bg rounded-lg text-left hover:bg-dark-border transition-colors"
                  >
                    <h3 className="text-sm font-medium text-neutral-50 mb-1">About Pulse</h3>
                    <p className="text-xs text-neutral-400">Learn more about our platform</p>
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
