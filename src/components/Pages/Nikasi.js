import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../cssfile/Nikasi.css'; // Adjusted CSS file for Nikasi

const NikasiManagement = () => {
  const [nikasis, setNikasis] = useState([]);
  const [newNikasi, setNewNikasi] = useState({ name: '', rate: '' });
  const [transactions, setTransactions] = useState({ date: '', quantity: '', amountPaid: '' });
  const [selectedNikasi, setSelectedNikasi] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [existingTransactions, setExistingTransactions] = useState([]);
  const [individualBalances, setIndividualBalances] = useState({});

  useEffect(() => {
    fetchNikasis();
  }, []);

  const fetchNikasis = async () => {
    const nikasisCollection = collection(db, 'nikasis'); // Changed collection to 'nikasis'
    const nikasisSnapshot = await getDocs(nikasisCollection);
    const nikasisList = nikasisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sortedNikasis = nikasisList.sort((a, b) => a.name.localeCompare(b.name));
    setNikasis(sortedNikasis);
    calculateIndividualBalances(sortedNikasis);
  };

  const calculateIndividualBalances = (nikasisList) => {
    const balances = {};
    nikasisList.forEach((nikasi) => {
      let totalBalance = 0;
      if (nikasi.transactions) {
        nikasi.transactions.forEach(({ quantity, amountPaid }) => {
          const balance = (quantity * nikasi.rate) - amountPaid;
          totalBalance += balance;
        });
      }
      balances[nikasi.id] = totalBalance;
    });
    setIndividualBalances(balances);
  };

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc(prev => ({ ...prev, [name]: value }));
  };

  const addNikasi = async (e) => {
    e.preventDefault();
    const { name, rate } = newNikasi;
    await addDoc(collection(db, 'nikasis'), { name, rate, transactions: [] });
    setNewNikasi({ name: '', rate: '' });
    fetchNikasis();
  };

  const handleNikasiClick = (nikasi) => {
    setSelectedNikasi(nikasi);
    setExistingTransactions(nikasi.transactions || []);
    setTotalBalance(calculateTotalBalance(nikasi.transactions || [], nikasi.rate));
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (selectedNikasi) {
      const { quantity, amountPaid } = transactions;
      const newTransaction = {
        date: transactions.date,
        quantity: parseInt(quantity),
        amountPaid: parseInt(amountPaid),
      };

      const updatedTransactions = [...selectedNikasi.transactions, newTransaction];
      const nikasiRef = doc(db, 'nikasis', selectedNikasi.id);
      await updateDoc(nikasiRef, { transactions: updatedTransactions });

      setExistingTransactions(updatedTransactions);
      setTotalBalance(calculateTotalBalance(updatedTransactions, selectedNikasi.rate));
      setTransactions({ date: '', quantity: '', amountPaid: '' });
      fetchNikasis();
    }
  };

  const calculateTotalBalance = (transactions, rate) => {
    return transactions.reduce((total, { quantity, amountPaid }) => {
      return total + ((quantity * rate) - amountPaid);
    }, 0);
  };

  return (
    <div className="nikasi-management">
      <h1>Nikasi Management</h1>

      <form onSubmit={addNikasi}>
        <input 
          type="text" 
          name="name" 
          placeholder="Nikasi Name" 
          value={newNikasi.name} 
          onChange={(e) => handleInputChange(e, setNewNikasi)} 
          required 
        />
        <input 
          type="number" 
          name="rate" 
          placeholder="Rate" 
          value={newNikasi.rate} 
          onChange={(e) => handleInputChange(e, setNewNikasi)} 
          required 
        />
        <button type="submit" className="add-button">Add Nikasi</button>
      </form>

      <h2>Existing Nikasis</h2>
      <div className="nikasi-buttons">
        {nikasis.length > 0 ? (
          nikasis.map((nikasi) => (
            <div key={nikasi.id} className="nikasi-button-container">
              <button className="nikasi-button" onClick={() => handleNikasiClick(nikasi)}>
                {nikasi.name}
              </button>
              <span className="nikasi-balance">
                Balance: {individualBalances[nikasi.id]?.toFixed(2) || 0}
              </span>
            </div>
          ))
        ) : (
          <p>No Nikasis available.</p>
        )}
      </div>

      {selectedNikasi && (
        <div className="transaction-window">
          <h3>Transactions for {selectedNikasi.name}</h3>
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
              <button type="button" className="close-button" onClick={() => setSelectedNikasi(null)}>Close</button>
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
            <p>No transactions found for this Nikasi.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NikasiManagement;
