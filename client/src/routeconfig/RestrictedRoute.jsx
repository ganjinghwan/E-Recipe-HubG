import React from 'react';
import { Navigate } from 'react-router-dom';

function RestrictedRoute({ isAuthenticated, isRoleInfoCreated, children }) {
    // Redirect users to the homepage if not authenticated or role info is created
    if (!isAuthenticated || isRoleInfoCreated) {
        return <Navigate to="/" replace={true} />;
    }

    // Render the restricted content for specific users
    return children;
}

export default RestrictedRoute;
