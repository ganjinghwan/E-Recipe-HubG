import React from "react"; // Ensure React is imported
import { Navigate } from "react-router-dom"; // Ensure Navigate is imported
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

function ProtectedRoute({ isAuthenticated, children }) {
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "You have been logged out.",
        description: "Redirect to homepage...",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }, [isAuthenticated]);

  // Redirect unauthenticated users to the home page
  if (!isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }

  // Render the protected content for authenticated users
  return children;
}

export default ProtectedRoute;
