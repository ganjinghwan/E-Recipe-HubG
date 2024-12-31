import {Box} from '@chakra-ui/react'
import { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import Recipes from './pages/Recipes';
import About from './pages/About';
import Navbar from './components/Navbar';
import Visitors from './pages/VitRecipes';
import Favourite from './pages/Favourite';

import ModeratorPg from './pages/ModeratorPg';
import UserListModal from "./components/moderator-modal/user_list";
// import ReportListModal from "./components/moderator-modal/report_list";
// import RecipeListModal from "./components/moderator-modal/recipe_list";
// import WarningListModal from "./components/moderator-modal/warning_list";

import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoadingSpinner from './components/LoadingSpinner';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './routeconfig/ProtectedRoute';
import RestrictedRoute from './routeconfig/RestrictedRoute';
import UpdateVerificationPage from './pages/UpdateVerificationPage';
import EventOrganizerInfoFillPage from './pages/EventOrganizerInfoFillPage';
import ModeratorInfoFillPage from './pages/ModeratorInfoFillPage';
import CookInfoFillPage from './pages/CookInfoFillPage';

import { useAuthStore } from './store/authStore';
import VerifyRoutes from './routeconfig/VerifyRoutes';

function App() {
  const {isCheckingAuth, checkAuth, isAuthenticated, user, isVerifiedRequired, isRoleInfoCreated}=useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);
  console.log("isVerifiedRequired", isVerifiedRequired);
  console.log("isRoleInfoCreated", isRoleInfoCreated);

  // Define which routes will not show Navbar
  const noNavbarRoutes = ["/verify-email", "/forgot-password", "/reset-password/:token", "/new-event-organizer", "/new-moderator", "/new-cook", "/verify-update"];
  const showNavbarRoutes = !noNavbarRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(/:\w+/, '\\w+')}$`);
    return regex.test(location.pathname);
  });

  return (
    <Box minH="100vh">
      {showNavbarRoutes && <Navbar />} {/* Render Navbar only in certain pages */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" 
          element={
            <HomePage />
          } 
        />

        <Route 
          path="/verify-email" 
          element={
            <VerifyRoutes isVerifyRequired={isVerifiedRequired}>
              <EmailVerificationPage />
            </VerifyRoutes>
          } 
        />

        <Route 
          path="/forgot-password" 
          element={
            <ForgotPasswordPage />
          } 
        />

        <Route 
          path="/reset-password/:token" 
          element={
            <ResetPasswordPage />
          } 
        />

        <Route 
          path="/verify-update" 
          element={
            <VerifyRoutes isVerifyRequired={isVerifiedRequired}>
              <UpdateVerificationPage />
            </VerifyRoutes>   
          } 
        />

        <Route 
          path="/new-event-organizer" 
          element={
            <RestrictedRoute isAuthenticated={isAuthenticated} isRoleInfoCreated={isRoleInfoCreated}>
              <EventOrganizerInfoFillPage />
            </RestrictedRoute>
          } 
        />

        <Route 
          path="/new-moderator" 
          element={
            <RestrictedRoute isAuthenticated={isAuthenticated} isRoleInfoCreated={isRoleInfoCreated}>
              <ModeratorInfoFillPage />
            </RestrictedRoute>
          } 
        />

        <Route 
          path="/new-cook" 
          element={
            <RestrictedRoute isAuthenticated={isAuthenticated} isRoleInfoCreated={isRoleInfoCreated}>
              <CookInfoFillPage />
            </RestrictedRoute>
            } 
        />

        {/* Moderator Component Routes */}
        <Route path="/user-list" element={<UserListModal />} />
        {/* <Route path="/report-list" element={<ReportListModal />} />
        <Route path="/recipe-list" element={<RecipeListModal />} />
        <Route path="/warning-list" element={<WarningListModal />} />
       */}

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
