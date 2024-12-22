import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isLoggedIn, roles } = useContext(UserContext);
  
    // Roller yüklenirken bir yükleme göstergesi
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    if (requiredRole && roles.length === 0) {
      // Rollerin henüz yüklenmediği durum
      return <div>Yükleniyor...</div>;
    }
  
    if (requiredRole && !roles.includes(requiredRole)) {
      // Kullanıcının gerekli role sahip olmadığı durum
      return <Navigate to="/denied" replace />;
    }
  
    return children;
  };
  ;

export default ProtectedRoute;
