import React, { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, Mail, LockIcon } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const INITIAL_FORM = { email: '', password: '' };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const url = 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success("Welcome back!");
            navigate('/');
          } else {
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rememberMe) {
      toast.error("Please check the 'Remember Me' option to proceed.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData);
      if (!data.token) throw new Error(data.message || "Login failed");
      localStorage.setItem('token', data.token);
      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successful!");
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 animate-gradient-x bg-[length:400%_400%]">
      <ToastContainer position='top-center' autoClose={3000} hideProgressBar />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 backdrop-blur-sm bg-opacity-90"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <LogIn className="w-10 h-10 text-white" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Please login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder=" "
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 shadow-sm transition duration-200"
            />
            {!formData.email && (
              <label htmlFor="email" className="absolute left-10 top-3.5 text-gray-400 text-sm pointer-events-none">
                Email
              </label>
            )}
          </div>

          {/* Password */}
          <div className="relative group">
            <LockIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder=" "
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 shadow-sm transition duration-200"
            />
            {!formData.password && (
              <label htmlFor="password" className="absolute left-10 top-3.5 text-gray-400 text-sm pointer-events-none">
                Password
              </label>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me & Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </div>
        </form>

        <p className="mt-5 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button onClick={onSwitchMode} className="text-blue-600 hover:underline">
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
