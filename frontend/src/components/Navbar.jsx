import React, { useRef, useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ChevronDown, LogOut, Settings, Menu, X } from "lucide-react";

const Navbar = ({ user = {}, onLogOut }) => {
  const menuref = useRef(null);
  const [menuopen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleLogout = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    onLogOut();
  };

  return (
    <header className='sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-purple-500 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16'>

        {/* Logo */}
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
          <div className='flex items-center justify-center bg-white rounded-full shadow-lg transition-transform transform hover:scale-110 relative'>
            <Layers className='w-10 h-10 text-blue-500 animate-bounce' />
            <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full shadow-lg animate-ping' />
          </div>
          <span className='text-2xl font-bold text-white'>Task Manager</span>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-4'>
          <button
            onClick={() => navigate('/profile')}
            className='text-white hover:text-blue-200 transition-colors'
          >
            <Settings className='h-6 w-6 hover:scale-110 transition-transform' />
          </button>

          {/* User Dropdown */}
          <div ref={menuref} className="relative">
            <button
              className='flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-gray-200 transition'
              onClick={handleMenuToggle}
            >
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white' />
              </div>
              <div className='hidden md:block text-gray-800 font-semibold'>
                <p className='text-sm'>{user.name}</p>
                <p className='text-xs text-gray-500'>{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform ${menuopen ? 'rotate-180' : ''}`} />
            </button>

            {menuopen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20'>
                <ul className='py-2'>
                  <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                    <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className='flex items-center gap-2'>
                      <Settings className='w-4 h-4' />
                      Profile Settings
                    </button>
                  </li>
                  <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                    <button onClick={handleLogout} className='flex items-center gap-2'>
                      <LogOut className='w-4 h-4' />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(prev => !prev)} className="text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt="User" className="h-10 w-10 rounded-full" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <hr />
          <button
            onClick={() => { setMobileOpen(false); navigate('/profile'); }}
            className="w-full text-left flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Settings className="w-5 h-5" />
            Profile Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
