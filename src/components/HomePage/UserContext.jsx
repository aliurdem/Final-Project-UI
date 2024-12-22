import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Başlangıçta localStorage'dan veri yükleniyor
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedEmail = localStorage.getItem('email') || '';
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    setIsLoggedIn(loggedIn);
    setEmail(storedEmail);
    setRoles(storedRoles);
  }, []);

  useEffect(() => {
    // State değiştiğinde localStorage güncelleniyor
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('email', email || '');
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [isLoggedIn, email, roles]);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    setIsLoggedIn(false);
    setEmail('');
    setRoles([]);
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, email, setEmail, roles, setRoles, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
