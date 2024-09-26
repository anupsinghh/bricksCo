import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import '../cssfile/SalesStatement.css'; // Import the custom CSS for styling

const SalesStatement = () => {
  const [formData, setFormData] = useState({
    date: '',
    noOfBricks: '',
    rate: '',
    travelling: '',
    amount: '',
    receivedAmount: '',
    receivedAmountDate: '',
    driverName: '',
    vehicleNo: '',
    deliveryAddress: '',
    partyName: '',
    partyMobileNumber: '',
    saleInstruction: '',
    travellingPay: '',
    travellingPayDate: '',
    remarks: '',
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPartyData, setSelectedPartyData] = useState(null);

  // Fetch sales data for the selected date
  const fetchSalesData = async (date) => {
    setLoading(true);
    const dateDocRef = doc(db, 'sales-statements', date);
    const docSnapshot = await getDoc(dateDocRef);
    
    if (docSnapshot.exists()) {
      setSalesData(docSnapshot.data().entries);
    } else {
      setSalesData([]);
    }
    setLoading(false);
  };

  // Handle date selection to fetch data
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchSalesData(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      date,
      noOfBricks,
      rate,
      travelling,
      amount,
      receivedAmount,
      receivedAmountDate,
      driverName,
      vehicleNo,
      deliveryAddress,
      partyName,
      partyMobileNumber,
      saleInstruction,
      travellingPay,
      travellingPayDate,
      remarks,
    } = formData;

    // Validate form data
    if (noOfBricks <= 0 || rate <= 0 || travelling < 0 || amount <= 0 || receivedAmount < 0 || travellingPay < 0) {
      alert('Please ensure that all numeric fields are positive numbers.');
      return;
    }

    try {
      setLoading(true);
      const dateDocRef = doc(db, 'sales-statements', date);
      const docSnapshot = await getDoc(dateDocRef);

      const newEntry = {
        noOfBricks: parseInt(noOfBricks),
        rate: parseFloat(rate),
        travelling: parseFloat(travelling),
        amount: parseFloat(amount),
        receivedAmount: parseFloat(receivedAmount),
        receivedAmountDate: Timestamp.fromDate(new Date(receivedAmountDate)),
        driverName,
        vehicleNo,
        deliveryAddress,
        partyName,
        partyMobileNumber,
        saleInstruction,
        travellingPay: parseFloat(travellingPay),
        travellingPayDate: Timestamp.fromDate(new Date(travellingPayDate)),
        remarks,
        createdAt: Timestamp.now(),
      };

      if (docSnapshot.exists()) {
        await setDoc(dateDocRef, { entries: arrayUnion(newEntry) }, { merge: true });
      } else {
        await setDoc(dateDocRef, { entries: [newEntry] });
      }

      alert('Sales statement added successfully');

      // Reset the form after submission
      setFormData({
        date: '',
        noOfBricks: '',
        rate: '',
        travelling: '',
        amount: '',
        receivedAmount: '',
        receivedAmountDate: '',
        driverName: '',
        vehicleNo: '',
        deliveryAddress: '',
        partyName: '',
        partyMobileNumber: '',
        saleInstruction: '',
        travellingPay: '',
        travellingPayDate: '',
        remarks: '',
      });
    } catch (error) {
      alert('Error adding sales statement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePartyClick = (entry) => {
    setSelectedPartyData(entry);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPartyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatedEntry = selectedPartyData;

    try {
      setLoading(true);
      const dateDocRef = doc(db, 'sales-statements', selectedDate);
      const docSnapshot = await getDoc(dateDocRef);

      if (docSnapshot.exists()) {
        const entries = docSnapshot.data().entries.map((entry) =>
          entry.partyMobileNumber === updatedEntry.partyMobileNumber ? updatedEntry : entry
        );

        await setDoc(dateDocRef, { entries }, { merge: true });
        alert('Sales statement updated successfully');
      }
    } catch (error) {
      alert('Error updating sales statement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sales-statement">
      <h1>Sales Statement</h1>
      
      {/* Date picker to fetch sales data */}
      <div className="date-picker">
        <label>Select Date:</label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      {/* Label for viewing data */}
      <h2>View Data for {selectedDate}</h2>
      
      {/* Table for displaying sales data */}
      <div className="sales-table">
        {loading ? (
          <p>Loading...</p>
        ) : salesData.length > 0 ? (
          <ul>
            {salesData.map((entry, index) => (
              <li key={index}>
                <button onClick={() => handlePartyClick(entry)}>
                  {entry.partyName}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sales data available for the selected date.</p>
        )}
      </div>

      {/* Display selected party data */}
      {selectedPartyData && (
        <div className="party-details">
          <h2>Party Details</h2>
          <form onSubmit={handleUpdateSubmit} className="party-info">
            <div className="two-column">
              <div>
                <label>Party Name:</label>
                <input type="text" name="partyName" value={selectedPartyData.partyName} onChange={handleEditChange} required />
              </div>
              <div>
                <label>No. of Bricks:</label>
                <input type="number" name="noOfBricks" value={selectedPartyData.noOfBricks} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Rate:</label>
                <input type="number" name="rate" value={selectedPartyData.rate} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Travelling:</label>
                <input type="number" name="travelling" value={selectedPartyData.travelling} onChange={handleEditChange} required />
              </div>
            </div>
            <div className="two-column">
              <div>
                <label>Amount:</label>
                <input type="number" name="amount" value={selectedPartyData.amount} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Received Amount:</label>
                <input type="number" name="receivedAmount" value={selectedPartyData.receivedAmount} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Received Amount Date:</label>
                <input type="date" name="receivedAmountDate" value={selectedPartyData.receivedAmountDate.toDate().toISOString().substring(0, 10)} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Driver Name:</label>
                <input type="text" name="driverName" value={selectedPartyData.driverName} onChange={handleEditChange} required />
              </div>
            </div>
            <div className="two-column">
              <div>
                <label>Vehicle No.:</label>
                <input type="text" name="vehicleNo" value={selectedPartyData.vehicleNo} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Delivery Address:</label>
                <input type="text" name="deliveryAddress" value={selectedPartyData.deliveryAddress} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Party Mobile No:</label>
                <input type="text" name="partyMobileNumber" value={selectedPartyData.partyMobileNumber} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Sale Instruction:</label>
                <input type="text" name="saleInstruction" value={selectedPartyData.saleInstruction} onChange={handleEditChange} required />
              </div>
            </div>
            <div className="two-column">
              <div>
                <label>Travelling Pay:</label>
                <input type="number" name="travellingPay" value={selectedPartyData.travellingPay} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Travelling Pay Date:</label>
                <input type="date" name="travellingPayDate" value={selectedPartyData.travellingPayDate.toDate().toISOString().substring(0, 10)} onChange={handleEditChange} required />
              </div>
              <div>
                <label>Remarks:</label>
                <textarea name="remarks" value={selectedPartyData.remarks} onChange={handleEditChange}></textarea>
              </div>
            </div>
            <button type="submit">Update Details</button>
          </form>
        </div>
      )}

      {/* Form for adding a new sales statement */}
      <form onSubmit={handleSubmit} className="add-sale-form">
        <h2>Add New Sales Statement</h2>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        
        <div className="two-column">
          <div>
            <label>No. of Bricks:</label>
            <input type="number" name="noOfBricks" value={formData.noOfBricks} onChange={handleChange} required />
          </div>
          <div>
            <label>Rate:</label>
            <input type="number" name="rate" value={formData.rate} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Travelling:</label>
            <input type="number" name="travelling" value={formData.travelling} onChange={handleChange} required />
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Received Amount:</label>
            <input type="number" name="receivedAmount" value={formData.receivedAmount} onChange={handleChange} required />
          </div>
          <div>
            <label>Received Amount Date:</label>
            <input type="date" name="receivedAmountDate" value={formData.receivedAmountDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Driver Name:</label>
            <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} required />
          </div>
          <div>
            <label>Vehicle No.:</label>
            <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Delivery Address:</label>
            <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required />
          </div>
          <div>
            <label>Party Name:</label>
            <input type="text" name="partyName" value={formData.partyName} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Party Mobile No:</label>
            <input type="text" name="partyMobileNumber" value={formData.partyMobileNumber} onChange={handleChange} required />
          </div>
          <div>
            <label>Sale Instruction:</label>
            <input type="text" name="saleInstruction" value={formData.saleInstruction} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Travelling Pay:</label>
            <input type="number" name="travellingPay" value={formData.travellingPay} onChange={handleChange} required />
          </div>
          <div>
            <label>Travelling Pay Date:</label>
            <input type="date" name="travellingPayDate" value={formData.travellingPayDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-column">
          <div>
            <label>Remarks:</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
          </div>
        </div>

        <button type="submit">Add Sales Statement</button>
      </form>
    </div>
  );
};

export default SalesStatement;
