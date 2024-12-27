import {Box} from '@chakra-ui/react'
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import UpdateVerificationPage from './pages/UpdateVerificationPage';
import EventOrganizerInfoFillPage from './pages/EventOrganizerInfoFillPage';
import ModeratorInfoFillPage from './pages/ModeratorInfoFillPage';
import CookInfoFillPage from './pages/CookInfoFillPage';

import { useAuthStore } from './store/authStore';

function App() {

  const {isCheckingAuth, checkAuth, isAuthenticated, user}=useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);

  // Define which routes will not show Navbar
  const noNavbarRoutes = ["/verify-email", "/forgot-password", "/new-event-organizer", "/new-moderator", "/new-cook"];
  const showNavbarRoutes = !noNavbarRoutes.some((route) => 
    location.pathname.includes(route)
  );

  return (
    <Box minH="100vh">
      {showNavbarRoutes && <Navbar />} {/* Render Navbar only in certain pages */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-update" element={<UpdateVerificationPage />} />
        <Route path="/new-event-organizer" element={<EventOrganizerInfoFillPage />} />
        <Route path="/new-moderator" element={<ModeratorInfoFillPage />} />
        <Route path="/new-cook" element={<CookInfoFillPage />} />

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
