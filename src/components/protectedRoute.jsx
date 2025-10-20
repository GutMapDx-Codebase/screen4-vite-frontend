import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('Token');

    console.log("Token in ProtectedRoute:", token);

    if (!token || (token !== 'clientdgf45sdgf@89756dfgdhg&%df')) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;