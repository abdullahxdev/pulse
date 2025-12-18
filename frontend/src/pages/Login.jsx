import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Globe, MessageCircle, Palette } from 'lucide-react';
import { login, register, debugToken } from '../services/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Clear any old tokens when login page loads
  useEffect(() => {
    console.log('Login page loaded - clearing old tokens...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setError('');

    try {
      let response;

      if (isLogin) {
        response = await login(formData.username, formData.password);
      } else {
        response = await register(formData.username, formData.email, formData.password);
      }

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Debug: Test token verification
        const debugResult = await debugToken();
        console.log('Token verification:', debugResult);

        if (onLogin) {
          onLogin(response.user);
        }

        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 100);

      } else {
        setError(response.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Exception:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-5">
      <div className="grid lg:grid-cols-[1.2fr_1fr] max-w-[1200px] w-full bg-dark-card rounded-[20px] overflow-hidden shadow-2xl border border-dark-border">

        {/* Left Side - Branding */}
        <div className="hidden lg:flex items-center justify-center p-[60px] bg-dark-card border-r border-dark-border">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3 text-neutral-50">
              Pulse
            </h1>
            <p className="text-lg text-neutral-400 mb-12">
              Connect, Share, and Inspire
            </p>

            <div className="flex flex-col gap-6 text-left max-w-[400px] mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <Globe size={24} className="text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-50 mb-1">
                    Global Community
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Connect with people worldwide
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={24} className="text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-50 mb-1">
                    Real-time Interaction
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Engage with posts instantly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <Palette size={24} className="text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-50 mb-1">
                    Express Yourself
                  </h3>
                  <p className="text-sm text-neutral-400">
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
            <h2 className="text-[32px] font-bold text-neutral-50 mb-2">
              {isLogin ? 'Welcome Back!' : 'Join Pulse'}
            </h2>
            <p className="text-sm text-neutral-400 mb-8">
              {isLogin
                ? 'Login to continue your journey'
                : 'Create an account to get started'}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Username field */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  autoComplete="username"
                  className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                />
              </div>

              {/* Email field - only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full py-3 px-4 pr-11 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-400 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-neutral-50 text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ username: '', email: '', password: '' });
                  }}
                  className="text-neutral-50 font-medium hover:text-neutral-300 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
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
