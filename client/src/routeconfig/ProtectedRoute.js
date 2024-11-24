import { Navigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

function ProtectedRoute({ isAuthenticated, children }) {
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      // Show a toast message
      toast({
        title: "Unauthorized",
        description: "Please sign in to access this page.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }, [isAuthenticated, toast]);

  // Redirect unauthenticated users to the home page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component for authenticated users
  return children;
}

export default ProtectedRoute;
