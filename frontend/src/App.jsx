import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import Login from './components/Login';
import { Outlet, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Dashboard from './pages/Dashboard';
import Pending from './pages/Pending';
import CompletePage from './pages/CompletePage';
import Profile from './components/Profile';

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      name: data.name,
      email: data.email,
    };
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogOut={handleLogOut}>
        <Outlet />
      </Layout>
    );
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="h-screen flex items-center justify-center">
            <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="h-screen flex items-center justify-center">
            <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
          </div>
        }
      />
      <Route
        element={currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Dashboard />} />
        <Route path='/pending' element={<Pending />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route path="/profile" element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogOut={handleLogOut} />} />
      </Route>
      <Route
        path="*"
        element={
         <Navigate to={currentUser ? '/' : '/login'} replace />
        }
      />
    </Routes>
  );
}

export default App;
