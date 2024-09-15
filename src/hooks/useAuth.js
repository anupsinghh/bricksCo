// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage to see if the user is already authenticated
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = (email, password) => {
    if (email === 'anujsingh@gmail.com' && password === '877922') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
