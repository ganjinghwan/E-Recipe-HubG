import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function VerifyRoutes({ isVerifyRequired, children }) {
    const toast = useToast();

    useEffect(() => {
        if (!isVerifyRequired) {
            toast({
                title: "Verification is not required for your conditions.",
                description: "This page is for restricted purposes only.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            })
        }
    }, [isVerifyRequired, toast]);

    // Redirect users to the homepage if verification is not required or role info is created
    if (!isVerifyRequired) {
        return <Navigate to="/" replace={true} />;
    }

    // Render the restricted content for specific users
    return children;
}

export default VerifyRoutes;