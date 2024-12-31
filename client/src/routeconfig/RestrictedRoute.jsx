import React from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

function RestrictedRoute({ isAuthenticated, isRoleInfoCreated, children }) {
    const toast = useToast();

    useEffect(() => {
        if (!isAuthenticated || isRoleInfoCreated) {
            toast({
                title: "Restricted to access this page.",
                description: "Enter this page is for restricted purposes only.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    }, [isAuthenticated, isRoleInfoCreated, toast]);

    // Redirect users to the homepage if not authenticated or role info is created
    if (!isAuthenticated || isRoleInfoCreated) {
        return <Navigate to="/" replace={true} />;
    }

    // Render the restricted content for specific users
    return children;
}

export default RestrictedRoute;
