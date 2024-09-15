import React, { useState } from 'react';
import { doc, getDoc, updateDoc, setDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase-config';
import '../styles.css';

// Helper function to format the date
const formatDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${year}-${month}-${day}`;
};

const AddData = () => {
  const [date, setDate] = useState('');
  const [labourEntries, setLabourEntries] = useState([{ labour: '', amount: '' }]);
  const [expenseEntries, setExpenseEntries] = useState([{ amount: '', remark: '' }]);
  const [salesEntries, setSalesEntries] = useState([{ quantity: '', rate: '', amount: '', name: '' }]);

  const addLabourEntry = () => {
    setLabourEntries([...labourEntries, { labour: '', amount: '' }]);
  };

  const addExpenseEntry = () => {
    setExpenseEntries([...expenseEntries, { amount: '', remark: '' }]);
  };

  const addSalesEntry = () => {
    setSalesEntries([...salesEntries, { quantity: '', rate: '', amount: '', name: '' }]);
  };

  const handleLabourChange = (index, e) => {
    const newEntries = [...labourEntries];
    newEntries[index][e.target.name] = e.target.value;
    setLabourEntries(newEntries);
  };

  const handleExpenseChange = (index, e) => {
    const newEntries = [...expenseEntries];
    newEntries[index][e.target.name] = e.target.value;
    setExpenseEntries(newEntries);
  };

  const handleSalesChange = (index, e) => {
    const newEntries = [...salesEntries];
    newEntries[index][e.target.name] = e.target.value;
    setSalesEntries(newEntries);
  };

  const handleSubmit = async () => {
    if (!date) {
      alert('Please select a date.');
      return;
    }

    const formattedDate = formatDate(date);
    const dateDocRef = doc(db, 'data', formattedDate);

    try {
      const docSnap = await getDoc(dateDocRef);

      if (docSnap.exists()) {
        // Document exists, append new entries
        await updateDoc(dateDocRef, {
          labourEntries: arrayUnion(...labourEntries.map(entry => ({
            labour: entry.labour,
            amount: Number(entry.amount),
          }))),
          expenseEntries: arrayUnion(...expenseEntries.map(entry => ({
            amount: Number(entry.amount),
            remark: entry.remark,
          }))),
          salesEntries: arrayUnion(...salesEntries.map(entry => ({
            quantity: Number(entry.quantity),
            rate: Number(entry.rate),
            amount: Number(entry.amount),
            name: entry.name,
          }))),
        });
      } else {
        // Document does not exist, create it with new entries
        await setDoc(dateDocRef, {
          date: Timestamp.fromDate(new Date(date)),
          labourEntries: labourEntries.map(entry => ({
            labour: entry.labour,
            amount: Number(entry.amount),
          })),
          expenseEntries: expenseEntries.map(entry => ({
            amount: Number(entry.amount),
            remark: entry.remark,
          })),
          salesEntries: salesEntries.map(entry => ({
            quantity: Number(entry.quantity),
            rate: Number(entry.rate),
            amount: Number(entry.amount),
            name: entry.name,
          })),
        });
      }

      alert('Data added successfully!');
      // Clear form fields after submission
      setDate('');
      setLabourEntries([{ labour: '', amount: '' }]);
      setExpenseEntries([{ amount: '', remark: '' }]);
      setSalesEntries([{ quantity: '', rate: '', amount: '', name: '' }]);
    } catch (error) {
      console.error('Error adding data:', error);
      alert(`An error occurred while adding data: ${error.message}`);
    }
  };

  return (
    <div className="add-data">
      <h1>Add Data</h1>
      <p>Select a date to start entering data.</p>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className="entries-section">
        <h2>Bricks Manufactured</h2>
        {labourEntries.map((entry, index) => (
          <div key={index} className="entry">
            <input
              type="text"
              name="labour"
              placeholder="Labour Name"
              value={entry.labour}
              onChange={(e) => handleLabourChange(index, e)}
            />
            <input
              type="number"
              name="amount"
              placeholder="Bricks Quantity"
              value={entry.amount}
              onChange={(e) => handleLabourChange(index, e)}
            />
          </div>
        ))}
        <button className="add-button" onClick={addLabourEntry}>Add More Bricks Entries</button>
      </div>
      <div className="entries-section">
        <h2>Expense Entries</h2>
        {expenseEntries.map((entry, index) => (
          <div key={index} className="entry">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={entry.amount}
              onChange={(e) => handleExpenseChange(index, e)}
            />
            <input
              type="text"
              name="remark"
              placeholder="Remark"
              value={entry.remark}
              onChange={(e) => handleExpenseChange(index, e)}
            />
          </div>
        ))}
        <button className="add-button" onClick={addExpenseEntry}>Add More Expense Entries</button>
      </div>
      <div className="entries-section">
        <h2>Sales Entries</h2>
        {salesEntries.map((entry, index) => (
          <div key={index} className="entry">
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={entry.quantity}
              onChange={(e) => handleSalesChange(index, e)}
            />
            <input
              type="number"
              name="rate"
              placeholder="Rate"
              value={entry.rate}
              onChange={(e) => handleSalesChange(index, e)}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={entry.amount}
              onChange={(e) => handleSalesChange(index, e)}
            />
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={entry.name}
              onChange={(e) => handleSalesChange(index, e)}
            />
          </div>
        ))}
        <button className="add-button" onClick={addSalesEntry}>Add More Sales Entries</button>
      </div>
      <button className="submit-button" onClick={handleSubmit}>Submit Data</button>
    </div>
  );
};

export default AddData;
