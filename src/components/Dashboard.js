import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config'; // Adjust the path to your Firebase config file
import { downloadData } from '../utils/downloadData'; // Import downloadData function
import '../styles.css'; // Import styles

const Dashboard = () => {
  const [data, setData] = useState({
    totalBricks: 0,
    soldBricks: 0,
    remainingBricks: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchData = () => {
      // Query the 'data' collection
      const dataQuery = query(collection(db, 'data'));

      // Handle data collection
      const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
        let totalBricks = 0;
        let soldBricks = 0;
        let revenue = 0;

        snapshot.forEach((doc) => {
          const docData = doc.data();
          console.log('Doc Data:', docData);

          // Process labourEntries (if needed)
          if (Array.isArray(docData.labourEntries)) {
            docData.labourEntries.forEach(entry => {
              const amount = Number(entry.amount) || 0;
              totalBricks += amount;
            });
          } else {
            console.warn('No labourEntries found in document:', doc.id);
          }

          // Process salesEntries
          if (Array.isArray(docData.salesEntries)) {
            docData.salesEntries.forEach(entry => {
              const quantity = Number(entry.quantity) || 0;
              const amount = Number(entry.amount) || 0;
              soldBricks += quantity;
              revenue += amount;
            });
          } else {
            console.warn('No salesEntries found in document:', doc.id);
          }
        });

        setData(prevData => ({
          ...prevData,
          totalBricks,
          soldBricks,
          revenue,
          remainingBricks: totalBricks - soldBricks,
        }));
      });

      // Cleanup on unmount
      return () => {
        unsubscribe();
      };
    };

    fetchData();
  }, []);

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
      <div className="button-container">
        <button className="download-button" onClick={downloadData}>
          Download Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
