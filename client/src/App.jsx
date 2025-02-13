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
import EventRecipePage from './pages/EventsRecipe';

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
import EventsPage from './pages/EventsPage';

import { useAuthStore } from './store/authStore';
import VerifyRoutes from './routeconfig/VerifyRoutes';
import EventDetailsPage from './pages/EventDetailsPage';

function App() {
  const {isCheckingAuth, checkAuth, isAuthenticated, user, isVerifiedRequired, isRoleInfoCreated}=useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  // console.log("isAuthenticated", isAuthenticated);
  // console.log("user", user);
  // console.log("isVerifiedRequired", isVerifiedRequired);
  // console.log("isRoleInfoCreated", isRoleInfoCreated);

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

        {/* Authentication Routes */}
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

       

        {/* Protected Routes */}
        <Route 
          path = "/eventrecipes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EventRecipePage />
            </ProtectedRoute>
          }
        />
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
            <About />
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

        {/* Event Organizer Specific Routes*/}
        <Route
          path='/events'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EventsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/events/:eventSpecificEndUrl'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EventDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect any invalid url back to homepage*/}
        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />
      </Routes>
    </Box>
  );
}
 

export default App;
