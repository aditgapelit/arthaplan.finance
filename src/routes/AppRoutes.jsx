import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import ArthaTrack from '../pages/ArthaTrack';
import ArthaGoal from '../pages/ArthaGoal';
import ArthaReport from '../pages/ArthaReport';
import ArthaSecure from '../pages/ArthaSecure';
import Profil from '../pages/Profil'; // Tambahkan import ini
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Auth />} />
      
      {/* Route yang diproteksi */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute><ArthaTrack /></ProtectedRoute>} />
      <Route path="/goal" element={<ProtectedRoute><ArthaGoal /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ArthaReport /></ProtectedRoute>} />
      <Route path="/secure" element={<ProtectedRoute><ArthaSecure /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profil /></ProtectedRoute>} /> {/* Tambahkan ini */}
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};