import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronLeft, Save, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:3000';

const Profile = ({ user, setCurrentUser }) => {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('You need to log in first.');
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const { username, email } = data.user;
          setProfile({ username, email });
        } else {
          toast.error(data.message || 'Failed to fetch profile');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching profile');
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { username: profile.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Profile updated successfully');
        setCurrentUser({ username: profile.username, email: profile.email });
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }

    if (passwords.new || passwords.confirm || passwords.current) {
      if (passwords.new !== passwords.confirm) {
        toast.error('New password and confirmation do not match');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.put(`${API_URL}/api/user/password`, {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          toast.success('Password changed successfully');
          setPasswords({ current: '', new: '', confirm: '' });
        } else {
          toast.error(data.message || 'Failed to change password');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to change password');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 to-indigo-100">
      <ToastContainer autoClose={2000} position="top-center" />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-indigo-800 mb-6"
        >
          <ChevronLeft className="mr-2 w-5 h-5" />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 grid gap-8 md:grid-cols-2"
        >
          {/* Header */}
          <div className="md:col-span-2 text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl shadow">
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-sm text-gray-500">Update your username or change your password.</p>
          </div>

          {/* Username */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
            </div>
          </motion.div>

          {/* Password Change */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <label className="block text-gray-700 font-medium">Change Password</label>
            {['current', 'new', 'confirm'].map((field) => (
              <input
                key={field}
                type="password"
                name={field}
                value={passwords[field]}
                onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                placeholder={
                  field === 'current'
                    ? 'Current Password'
                    : field === 'new'
                    ? 'New Password'
                    : 'Confirm New Password'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            ))}
          </motion.div>

          {/* Save Button */}
          <motion.div
            className="md:col-span-2 flex justify-center mt-4"
            whileHover={{ scale: 1.05 }}
          >
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg font-medium transition"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
