// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = ({ logout }) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/add">Add Data</Link>
      <Link to="/view">View Data</Link>
      {isAuthenticated && (
        <button onClick={logout} className="navbar-button">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
