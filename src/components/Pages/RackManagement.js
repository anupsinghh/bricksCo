import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config'; // Firebase config import
import '../cssfile/RackManagement.css';

const RackManagement = () => {
  const [racks, setRacks] = useState([]);
  const [newRack, setNewRack] = useState({ rackNumber: '', brickQuality: '', date: '', stockIn: '', sales: '' });
  const [showDetails, setShowDetails] = useState(false); // Control for showing rack details

  const brickQualities = ['1 No. Brick', '2 No. Brick', '3 No. Brick', 'Tukda Brick'];

  useEffect(() => {
    // Fetch data from Firebase when component mounts
    const fetchRacks = async () => {
      const querySnapshot = await getDocs(collection(db, 'racks'));
      const fetchedRacks = [];
      querySnapshot.forEach((doc) => {
        fetchedRacks.push({ ...doc.data(), id: doc.id });
      });
      setRacks(fetchedRacks);
    };

    fetchRacks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRack((prev) => ({ ...prev, [name]: value }));
  };

  const addRack = async (e) => {
    e.preventDefault();
    const balance = newRack.stockIn - newRack.sales;

    // If sales entered but no stockIn, subtract from the existing balance for that brick quality
    if (!newRack.stockIn && newRack.sales) {
      const updatedRacks = racks.map((rack) => {
        if (rack.brickQuality === newRack.brickQuality) {
          return { ...rack, balance: rack.balance - newRack.sales };
        }
        return rack;
      });
      setRacks(updatedRacks);
      return;
    }

    const newRackData = { ...newRack, balance: balance || 0 };

    try {
      // Add the new rack to Firebase
      const docRef = await addDoc(collection(db, 'racks'), newRackData);
      setRacks((prevRacks) => [...prevRacks, { ...newRackData, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    setNewRack({ rackNumber: '', brickQuality: '', date: '', stockIn: '', sales: '' });
  };

  const calculateBalance = (stockIn, sales) => {
    return stockIn - sales;
  };

  // Group data by brick quality for the chart
  const groupByBrickQuality = () => {
    const data = brickQualities.map((quality) => {
      const racksByQuality = racks.filter((rack) => rack.brickQuality === quality);
      const totalStockIn = racksByQuality.reduce((acc, curr) => acc + Number(curr.stockIn), 0);
      const totalSales = racksByQuality.reduce((acc, curr) => acc + Number(curr.sales), 0);
      return {
        brickQuality: quality,
        stockIn: totalStockIn,
        sales: totalSales,
        balance: totalStockIn - totalSales,
      };
    });
    return data;
  };

  const chartData = groupByBrickQuality();

  const sortedRacks = racks.slice().sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by latest date

  return (
    <div className="rack-management">
      <h1>Rack Management</h1>

      {/* Graph shown at the top */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <h2>Brick Quality Stock & Sales Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"  // Setting the chart layout to vertical
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis dataKey="brickQuality" type="category" />
              <XAxis type="number" />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockIn" fill="#8884d8">
                <LabelList dataKey="stockIn" position="right" />
              </Bar>
              <Bar dataKey="sales" fill="#82ca9d">
                <LabelList dataKey="sales" position="right" />
              </Bar>
              <Bar dataKey="balance" fill="#ffc658">
                <LabelList dataKey="balance" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Form to add new rack */}
      <form onSubmit={addRack}>
        <div className="input-group">
          <label>Rack Number:</label>
          <input
            type="text"
            name="rackNumber"
            value={newRack.rackNumber}
            onChange={handleInputChange}
            placeholder="Enter Rack Number"
            required
          />
        </div>

        <div className="input-group">
          <label>Brick Quality:</label>
          <select name="brickQuality" value={newRack.brickQuality} onChange={handleInputChange} required>
            <option value="">Select Brick Quality</option>
            {brickQualities.map((quality, index) => (
              <option key={index} value={quality}>
                {quality}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Date:</label>
          <input type="date" name="date" value={newRack.date} onChange={handleInputChange} required />
        </div>

        <div className="input-group">
          <label>Stock In:</label>
          <input type="number" name="stockIn" value={newRack.stockIn} onChange={handleInputChange} />
        </div>

        <div className="input-group">
          <label>Sales:</label>
          <input type="number" name="sales" value={newRack.sales} onChange={handleInputChange} required />
        </div>

        <button type="submit" className="add-button">Add Rack</button>
      </form>

      {/* Show/Hide rack details */}
      <button onClick={() => setShowDetails(!showDetails)} className="details-button">
        {showDetails ? 'Hide Rack Details' : 'Show Rack Details'}
      </button>

      {/* Rack details table */}
      {showDetails && sortedRacks.length > 0 && (
        <div className="rack-table">
          <h2>Rack Details</h2>
          <table>
            <thead>
              <tr>
                <th>Rack Number</th>
                <th>Brick Quality</th>
                <th>Date</th>
                <th>Stock In</th>
                <th>Sales</th>
                <th>Total Balance</th>
              </tr>
            </thead>
            <tbody>
              {sortedRacks.map((rack) => (
                <tr key={rack.id}>
                  <td>{rack.rackNumber}</td>
                  <td>{rack.brickQuality}</td>
                  <td>{rack.date}</td>
                  <td>{rack.stockIn}</td>
                  <td>{rack.sales}</td>
                  <td>{calculateBalance(rack.stockIn, rack.sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RackManagement;
