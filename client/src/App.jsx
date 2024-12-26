import {Box} from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Recipes from './pages/Recipes';
import About from './pages/About';
import Navbar from './components/Navbar';
import Visitors from './pages/VitRecipes';
import Favourite from './pages/Favourite';
import ModeratorPg from './pages/ModeratorPg';

import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoadingSpinner from './components/LoadingSpinner';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './routeconfig/ProtectedRoute';
import { useEffect } from 'react';
import UpdateVerificationPage from './pages/UpdateVerificationPage';

function App() {

  const {isCheckingAuth, checkAuth, isAuthenticated, user}=useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);

  return (
    <Box minH="100vh">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-update" element={<UpdateVerificationPage />} />

        {/* Protected Routes */}
        <Route
          path="/recipes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitors"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Visitors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favourite"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Favourite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderatorpg"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ModeratorPg />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}
 

export default App;
