import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isLoggedIn, roles } = useContext(UserContext);
  
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    if (requiredRole && roles.length === 0) {
      return <div>Yükleniyor...</div>;
    }
  
    if (requiredRole && !roles.includes(requiredRole)) {
      return <Navigate to="/denied" replace />;
    }
  
    return children;
  };
  ;

export default ProtectedRoute;
