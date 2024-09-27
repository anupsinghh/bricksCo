import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../cssfile/Bojhwa.css'; // Adjusted CSS file for Bojhwa

const BojhwaManagement = () => {
  const [bojhwas, setBojhwas] = useState([]);
  const [newBojhwa, setNewBojhwa] = useState({ name: '', rate: '' });
  const [transactions, setTransactions] = useState({ date: '', quantity: '', amountPaid: '' });
  const [selectedBojhwa, setSelectedBojhwa] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [existingTransactions, setExistingTransactions] = useState([]);
  const [individualBalances, setIndividualBalances] = useState({});

  useEffect(() => {
    fetchBojhwas();
  }, []);

  const fetchBojhwas = async () => {
    const bojhwasCollection = collection(db, 'bojhwas'); // Changed collection to 'bojhwas'
    const bojhwasSnapshot = await getDocs(bojhwasCollection);
    const bojhwasList = bojhwasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sortedBojhwas = bojhwasList.sort((a, b) => a.name.localeCompare(b.name));
    setBojhwas(sortedBojhwas);
    calculateIndividualBalances(sortedBojhwas);
  };

  const calculateIndividualBalances = (bojhwasList) => {
    const balances = {};
    bojhwasList.forEach((bojhwa) => {
      let totalBalance = 0;
      if (bojhwa.transactions) {
        bojhwa.transactions.forEach(({ quantity, amountPaid }) => {
          const balance = (quantity * bojhwa.rate) - amountPaid;
          totalBalance += balance;
        });
      }
      balances[bojhwa.id] = totalBalance;
    });
    setIndividualBalances(balances);
  };

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc(prev => ({ ...prev, [name]: value }));
  };

  const addBojhwa = async (e) => {
    e.preventDefault();
    const { name, rate } = newBojhwa;
    await addDoc(collection(db, 'bojhwas'), { name, rate, transactions: [] });
    setNewBojhwa({ name: '', rate: '' });
    fetchBojhwas();
  };

  const handleBojhwaClick = (bojhwa) => {
    setSelectedBojhwa(bojhwa);
    setExistingTransactions(bojhwa.transactions || []);
    setTotalBalance(calculateTotalBalance(bojhwa.transactions || [], bojhwa.rate));
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (selectedBojhwa) {
      const { quantity, amountPaid } = transactions;
      const newTransaction = {
        date: transactions.date,
        quantity: parseInt(quantity),
        amountPaid: parseInt(amountPaid),
      };

      const updatedTransactions = [...selectedBojhwa.transactions, newTransaction];
      const bojhwaRef = doc(db, 'bojhwas', selectedBojhwa.id);
      await updateDoc(bojhwaRef, { transactions: updatedTransactions });

      setExistingTransactions(updatedTransactions);
      setTotalBalance(calculateTotalBalance(updatedTransactions, selectedBojhwa.rate));
      setTransactions({ date: '', quantity: '', amountPaid: '' });
      fetchBojhwas();
    }
  };

  const calculateTotalBalance = (transactions, rate) => {
    return transactions.reduce((total, { quantity, amountPaid }) => {
      return total + ((quantity * rate) - amountPaid);
    }, 0);
  };

  return (
    <div className="bojhwa-management">
      <h1>Bojhwa Management</h1>

      <form onSubmit={addBojhwa}>
        <input 
          type="text" 
          name="name" 
          placeholder="Bojhwa Name" 
          value={newBojhwa.name} 
          onChange={(e) => handleInputChange(e, setNewBojhwa)} 
          required 
        />
        <input 
          type="number" 
          name="rate" 
          placeholder="Rate" 
          value={newBojhwa.rate} 
          onChange={(e) => handleInputChange(e, setNewBojhwa)} 
          required 
        />
        <button type="submit" className="add-button">Add Bojhwa</button>
      </form>

      <h2>Existing Bojhwas</h2>
      <div className="bojhwa-buttons">
        {bojhwas.length > 0 ? (
          bojhwas.map((bojhwa) => (
            <div key={bojhwa.id} className="bojhwa-button-container">
              <button className="bojhwa-button" onClick={() => handleBojhwaClick(bojhwa)}>
                {bojhwa.name}
              </button>
              <span className="bojhwa-balance">
                Balance: {individualBalances[bojhwa.id]?.toFixed(2) || 0}
              </span>
            </div>
          ))
        ) : (
          <p>No Bojhwas available.</p>
        )}
      </div>

      {selectedBojhwa && (
        <div className="transaction-window">
          <h3>Transactions for {selectedBojhwa.name}</h3>
          <h4>Total Balance: {totalBalance.toFixed(2)}</h4>

          <form onSubmit={handleTransactionSubmit}>
            <label>
              Date:
              <input 
                type="date" 
                name="date" 
                value={transactions.date} 
                onChange={(e) => handleInputChange(e, setTransactions)} 
                required 
              />
            </label>
            <label>
              Quantity:
              <input 
                type="number" 
                name="quantity" 
                value={transactions.quantity} 
                onChange={(e) => handleInputChange(e, setTransactions)} 
                required 
              />
            </label>
            <label>
              Amount Paid:
              <input 
                type="number" 
                name="amountPaid" 
                value={transactions.amountPaid} 
                onChange={(e) => handleInputChange(e, setTransactions)} 
                required 
              />
            </label>
            <div className="button-group">
              <button type="submit" className="submit-button">Submit </button>
              <button type="button" className="close-button" onClick={() => setSelectedBojhwa(null)}>Close</button>
            </div>
          </form>

          <h4>Existing Transactions</h4>
          {existingTransactions.length > 0 ? (
            <ul>
              {existingTransactions.map((transaction, index) => (
                <li key={index}>
                  Date: {transaction.date}, Quantity: {transaction.quantity}, Amount Paid: {transaction.amountPaid}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found for this Bojhwa.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BojhwaManagement;
