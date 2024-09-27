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
import SalesStatement from './components/Pages/SalesStatement'; 
import Pathera from './components/Pages/Pathera';
import RackManagement from './components/Pages/RackManagement';
import DailyExpense from './components/Pages/Expenses';
import Nikasi from './components/Pages/Nikasi';
import Bojhwa from './components/Pages/Bojhwa';
import LabourPage from './components/Pages/Labour';
import Expenses from './components/Pages/Expenses'
import MunshiPage from './components/Pages/Munshi';


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
        <Route path="/sales-statement" element={isAuthenticated ? <SalesStatement /> : <Navigate to="/login" />} />
        <Route path="/pathera" element={isAuthenticated ? <Pathera /> : <Navigate to="/login" />} />
        <Route path="/earthin-stock" element={isAuthenticated ? <RackManagement /> : <Navigate to="/login" />} />
        <Route path="/nikasi" element={isAuthenticated ? <Nikasi/> : <Navigate to="/login" />} />
        <Route path="/bojhwa" element={isAuthenticated ? <Bojhwa/> : <Navigate to="/login" />} />
        <Route path="/labour" element={isAuthenticated ? <LabourPage/> : <Navigate to="/login" />} />
        <Route path="/daily-expenses" element={isAuthenticated ? <Expenses/> : <Navigate to="/login" />} />
        <Route path="/munshi" element={isAuthenticated ? <MunshiPage/> : <Navigate to="/login" />} />







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
