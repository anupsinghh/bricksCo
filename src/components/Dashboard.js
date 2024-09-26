import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { downloadData } from '../utils/downloadData';
import './dashboard.css'; // Ensure styles are correctly imported

const Dashboard = () => {
  const [data, setData] = useState({
    totalBricks: 0,
    soldBricks: 0,
    remainingBricks: 0,
    revenue: 0,
  });

  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchData = () => {
      const dataQuery = query(collection(db, 'data'));

      const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
        let totalBricks = 0;
        let soldBricks = 0;
        let revenue = 0;

        snapshot.forEach((doc) => {
          const docData = doc.data();

          if (Array.isArray(docData.labourEntries)) {
            docData.labourEntries.forEach((entry) => {
              const amount = Number(entry.amount) || 0;
              totalBricks += amount;
            });
          }

          if (Array.isArray(docData.salesEntries)) {
            docData.salesEntries.forEach((entry) => {
              const quantity = Number(entry.quantity) || 0;
              const amount = Number(entry.amount) || 0;
              soldBricks += quantity;
              revenue += amount;
            });
          }
        });

        setData({
          totalBricks,
          soldBricks,
          revenue,
          remainingBricks: totalBricks - soldBricks,
        });
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat">
          <h2>Total Bricks</h2>
          <p>{data.totalBricks}</p>
        </div>
        <div className="stat">
          <h2>Sold Bricks</h2>
          <p>{data.soldBricks}</p>
        </div>
        <div className="stat">
          <h2>Remaining Bricks</h2>
          <p>{data.remainingBricks}</p>
        </div>
        <div className="stat">
          <h2>Revenue</h2>
          <p>₹{data.revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="sections-grid">
        {[
          { name: 'Sales Statement', icon: 'fas fa-file-invoice', path: '/sales-statement' },
          { name: 'Pathera', icon: 'fas fa-box', path: '/pathera' },
          { name: 'Bojhwa', icon: 'fas fa-truck', path: '/bojhwa' },
          { name: 'Nikasi', icon: 'fas fa-check-circle', path: '/nikasi' },
          { name: 'Earthin Stock', icon: 'fas fa-globe', path: '/earthin-stock' },
          { name: 'Daily Expenses', icon: 'fas fa-coins', path: '/daily-expenses' },
          { name: 'Labour', icon: 'fas fa-users', path: '/labour' },
          { name: 'Munshi', icon: 'fas fa-user-tie', path: '/munshi' },
          { name: 'Other Section', icon: 'fas fa-cog', path: '/other-section' },
        ].map((section) => (
          <div
            className="section"
            key={section.name}
            onClick={() => navigateTo(section.path)}
          >
            <i className={section.icon}></i>
            <p>{section.name}</p>
          </div>
          
        ))}
      </div>

      <div className="button-container">
        <button className="download-button" onClick={downloadData}>
          Download Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
