import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { login, register } from '../services/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setError(''); // Clear error on input change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== FORM SUBMITTED ===');
    console.log('Is Login:', isLogin);
    console.log('Form Data:', formData);
    
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isLogin) {
        console.log('🔐 Calling login API...');
        response = await login(formData.username, formData.password);
      } else {
        console.log('📝 Calling register API...');
        response = await register(formData.username, formData.email, formData.password);
      }

      console.log('📦 API Response:', response);

      if (response.success) {
        console.log('✅ Authentication successful!');
        console.log('Token:', response.token);
        console.log('User:', response.user);
        
        // Save to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Verify saved
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        console.log('✅ Token saved:', savedToken ? 'YES' : 'NO');
        console.log('✅ User saved:', savedUser ? 'YES' : 'NO');
        
        // Update parent state
        if (onLogin) {
          console.log('🔄 Calling onLogin...');
          onLogin(response.user);
        }
        
        // Small delay to ensure state updates
        setTimeout(() => {
          console.log('🚀 Navigating to /home');
          navigate('/home', { replace: true });
        }, 100);
        
      } else {
        console.error('❌ Authentication failed:', response.message);
        setError(response.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('❌ Exception:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg to-dark-card p-5">
      <div className="grid lg:grid-cols-[1.2fr_1fr] max-w-[1200px] w-full bg-dark-card rounded-[20px] overflow-hidden shadow-2xl border border-dark-border">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex items-center justify-center p-[60px] bg-gradient-to-br from-dark-card to-dark-bg border-r border-dark-border">
          <div className="text-center">
            <div className="text-[80px] mb-5 animate-pulse-beat">💙</div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Pulse
            </h1>
            <p className="text-lg text-slate-400 mb-12">
              Connect, Share, and Inspire
            </p>
            
            <div className="flex flex-col gap-6 text-left max-w-[400px] mx-auto">
              <div className="flex items-start gap-4">
                <div className="text-[32px] flex-shrink-0">🌐</div>
                <div>
                  <h3 className="text-base font-semibold text-slate-50 mb-1">
                    Global Community
                  </h3>
                  <p className="text-sm text-slate-400">
                    Connect with people worldwide
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[32px] flex-shrink-0">💬</div>
                <div>
                  <h3 className="text-base font-semibold text-slate-50 mb-1">
                    Real-time Interaction
                  </h3>
                  <p className="text-sm text-slate-400">
                    Engage with posts instantly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[32px] flex-shrink-0">🎨</div>
                <div>
                  <h3 className="text-base font-semibold text-slate-50 mb-1">
                    Express Yourself
                  </h3>
                  <p className="text-sm text-slate-400">
                    Share your thoughts and creativity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-12 lg:p-[60px_50px]">
          <div className="w-full max-w-[400px]">
            <h2 className="text-[32px] font-bold text-slate-50 mb-2">
              {isLogin ? 'Welcome Back!' : 'Join Pulse'}
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              {isLogin 
                ? 'Login to continue your journey' 
                : 'Create an account to get started'}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Username field */}
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    autoComplete="username"
                    className="w-full py-3 pl-11 pr-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Email field - only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="w-full py-3 pl-11 pr-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full py-3 pl-11 pr-11 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isLogin ? 'Use your username and password' : 'Minimum 6 characters'}
                </p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ username: '', email: '', password: '' });
                  }}
                  className="text-primary font-semibold hover:text-blue-400 transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;