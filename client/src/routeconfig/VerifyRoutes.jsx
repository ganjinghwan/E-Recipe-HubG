import React from "react";
import { Navigate } from "react-router-dom";

function VerifyRoutes({ isVerifyRequired, children }) {
    // Redirect users to the homepage if verification is not required or role info is created
    if (!isVerifyRequired) {
        return <Navigate to="/" replace={true} />;
    }

    // Render the restricted content for specific users
    return children;
}

export default VerifyRoutes;