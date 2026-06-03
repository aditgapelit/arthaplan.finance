import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ArthaTrack from '../pages/ArthaTrack';
import ArthaGoal from '../pages/ArthaGoal';
import ArthaReport from '../pages/ArthaReport';
import ArthaSecure from '../pages/ArthaSecure';
import Profil from '../pages/Profil';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute><ArthaTrack /></ProtectedRoute>} />
      <Route path="/goal" element={<ProtectedRoute><ArthaGoal /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ArthaReport /></ProtectedRoute>} />
      <Route path="/secure" element={<ProtectedRoute><ArthaSecure /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
