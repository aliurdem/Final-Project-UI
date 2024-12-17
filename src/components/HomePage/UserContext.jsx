// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedEmail = localStorage.getItem('email') || '';
    setIsLoggedIn(loggedIn);
    setEmail(storedEmail);
  }, []);

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFavList');


    // Update state
    setIsLoggedIn(false);
    setEmail('');
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, email, setEmail, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
