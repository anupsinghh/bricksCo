// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Navbar.css'; // Importing CSS for styling

const Navbar = ({ logout }) => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling mobile menu

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MyWebsite {/* You can replace this with your website's name or logo */}
        </Link>
        <div className="right-links">
          {/* Hamburger menu icon */}
          <button className="menu-icon" onClick={toggleMenu}>
            &#9776; {/* Menu icon (3 horizontal bars) */}
          </button>
          {/* Nav links - visible on larger screens, toggled on small screens */}
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-item" onClick={toggleMenu}>
              Dashboard
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="navbar-button"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
