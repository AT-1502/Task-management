import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { FIELDS } from '../assets/dummy';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000';
const INITIAL_FORM = { username: '', email: '', password: '' };

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await axios.post(`${API_URL}/api/user/register`, formData);
      if (data.success) {
        setMessage({ text: 'Account created successfully! Please log in.', type: 'success' });
        setFormData(INITIAL_FORM);
        console.log('User registered:', data.user);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 animate-gradient-x bg-[length:400%_400%]">
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
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h1>
        <p className="text-center text-gray-500 mb-6">Join and start managing your tasks today!</p>

        {message.text && (
          <div
            className={`p-3 mb-4 text-sm rounded-lg text-center ${message.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
              }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {FIELDS.map(({ username, type, placeholder, icon: Icon }) => (
            <div key={username} className="relative group">
              <Icon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                id={username}
                type={type}
                name={username}
                value={formData[username]}
                onChange={(e) => setFormData({ ...formData, [username]: e.target.value })}
                required
                placeholder=" "
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 shadow-sm transition duration-200"
              />
              {!formData[username] && (
                <label
                  htmlFor={username}
                  className="absolute left-10 top-3.5 text-gray-400 text-sm pointer-events-none"
                >
                  {placeholder}
                </label>
              )}
            </div>
          ))}


          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button onClick={onSwitchMode} className="text-blue-600 hover:underline">
            Log In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
