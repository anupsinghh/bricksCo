// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddData from './components/AddData';
import ViewData from './components/ViewData';
import DownloadButton from './components/DownloadButton';
import LoginPage from './components/LoginPage';
import useAuth from './hooks/useAuth';
import './styles.css';

const AppContent = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <>
      <Navbar logout={logout} />
      <Routes>
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/add" element={isAuthenticated ? <AddData /> : <Navigate to="/login" />} />
        <Route path="/view" element={isAuthenticated ? <ViewData /> : <Navigate to="/login" />} />
      </Routes>
      {/* {isAuthenticated && <DownloadButton />} */}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
