import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config'; // Adjust this import based on your structure
import "../cssfile/Expenses.css"

const DailyExpense = () => {
  const [expenseData, setExpenseData] = useState({ amount: '', remark: '' });
  const [expenses, setExpenses] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    // Fetch current date from the phone
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setDate(formattedDate);

    // Fetch existing expenses from Firebase
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const expensesCollection = collection(db, 'expenses');
    const expenseSnapshot = await getDocs(expensesCollection);
    const expenseList = expenseSnapshot.docs.map(doc => doc.data());
    setExpenses(expenseList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    // Add the new expense to Firebase
    await addDoc(collection(db, 'expenses'), {
      date,
      amount: expenseData.amount,
      remark: expenseData.remark
    });

    // Clear the input fields after adding
    setExpenseData({ amount: '', remark: '' });

    // Fetch updated expenses
    fetchExpenses();
  };

  return (
    <div className="expense-tracker">
      <h1>Daily Expense Tracker</h1>
      <form onSubmit={handleAddExpense} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label>Date:</label>
            <input type="text" value={date} readOnly />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={expenseData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Remark:</label>
            <input
              type="text"
              name="remark"
              value={expenseData.remark}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-button">Add Expense</button>
      </form>

      <h2>Expense Records</h2>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.date}</td>
              <td>{expense.amount}</td>
              <td>{expense.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyExpense;
