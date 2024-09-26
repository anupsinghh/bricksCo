import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../cssfile/Pathera.css';

const PatheraManagement = () => {
  const [patheras, setPatheras] = useState([]);
  const [newPathera, setNewPathera] = useState({ name: '', rate: '' });
  const [transactions, setTransactions] = useState({ date: '', quantity: '', amountPaid: '' });
  const [selectedPathera, setSelectedPathera] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [existingTransactions, setExistingTransactions] = useState([]);
  const [individualBalances, setIndividualBalances] = useState({});

  useEffect(() => {
    fetchPatheras();
  }, []);

  const fetchPatheras = async () => {
    const patherasCollection = collection(db, 'patheras');
    const patherasSnapshot = await getDocs(patherasCollection);
    const patherasList = patherasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sortedPatheras = patherasList.sort((a, b) => a.name.localeCompare(b.name));
    setPatheras(sortedPatheras);
    calculateIndividualBalances(sortedPatheras);
  };

  const calculateIndividualBalances = (patherasList) => {
    const balances = {};
    patherasList.forEach((pathera) => {
      let totalBalance = 0;
      if (pathera.transactions) {
        pathera.transactions.forEach(({ quantity, amountPaid }) => {
          const balance = (quantity * pathera.rate) - amountPaid;
          totalBalance += balance;
        });
      }
      balances[pathera.id] = totalBalance;
    });
    setIndividualBalances(balances);
  };

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc(prev => ({ ...prev, [name]: value }));
  };

  const addPathera = async (e) => {
    e.preventDefault();
    const { name, rate } = newPathera;
    await addDoc(collection(db, 'patheras'), { name, rate, transactions: [] });
    setNewPathera({ name: '', rate: '' });
    fetchPatheras();
  };

  const handlePatheraClick = (pathera) => {
    setSelectedPathera(pathera);
    setExistingTransactions(pathera.transactions || []);
    setTotalBalance(calculateTotalBalance(pathera.transactions || [], pathera.rate));
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (selectedPathera) {
      const { quantity, amountPaid } = transactions;
      const newTransaction = {
        date: transactions.date,
        quantity: parseInt(quantity),
        amountPaid: parseInt(amountPaid),
      };

      const updatedTransactions = [...selectedPathera.transactions, newTransaction];
      const patheraRef = doc(db, 'patheras', selectedPathera.id);
      await updateDoc(patheraRef, { transactions: updatedTransactions });

      setExistingTransactions(updatedTransactions);
      setTotalBalance(calculateTotalBalance(updatedTransactions, selectedPathera.rate));
      setTransactions({ date: '', quantity: '', amountPaid: '' });
      fetchPatheras();
    }
  };

  const calculateTotalBalance = (transactions, rate) => {
    return transactions.reduce((total, { quantity, amountPaid }) => {
      return total + ((quantity * rate) - amountPaid);
    }, 0);
  };

  return (
    <div className="pathera-management">
      <h1>Pathera Management</h1>

      <form onSubmit={addPathera}>
        <input 
          type="text" 
          name="name" 
          placeholder="Pathera Name" 
          value={newPathera.name} 
          onChange={(e) => handleInputChange(e, setNewPathera)} 
          required 
        />
        <input 
          type="number" 
          name="rate" 
          placeholder="Rate" 
          value={newPathera.rate} 
          onChange={(e) => handleInputChange(e, setNewPathera)} 
          required 
        />
        <button type="submit" className="add-button">Add Pathera</button>
      </form>

      <h2>Existing Patheras</h2>
      <div className="pathera-buttons">
        {patheras.length > 0 ? (
          patheras.map((pathera) => (
            <div key={pathera.id} className="pathera-button-container">
              <button className="pathera-button" onClick={() => handlePatheraClick(pathera)}>
                {pathera.name}
              </button>
              <span className="pathera-balance">
                Balance: {individualBalances[pathera.id]?.toFixed(2) || 0}
              </span>
            </div>
          ))
        ) : (
          <p>No patheras available.</p>
        )}
      </div>

      {selectedPathera && (
        <div className="transaction-window">
          <h3>Transactions for {selectedPathera.name}</h3>
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
              <button type="button" className="close-button" onClick={() => setSelectedPathera(null)}>Close</button>
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
            <p>No transactions found for this Pathera.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatheraManagement;
