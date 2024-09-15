import React, { useState, useEffect } from 'react';
import { where, query, collection, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import '../styles.css';

const ViewData = () => {
  const [date, setDate] = useState('');
  const [data, setData] = useState({
    labourEntries: [],
    expenseEntries: [],
    salesEntries: [],
  });
  const [editMode, setEditMode] = useState({
    labour: null,
    expense: null,
    sales: null,
  });
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    if (date) {
      const fetchData = () => {
        const startOfDay = new Date(date).setHours(0, 0, 0, 0);
        const endOfDay = new Date(date).setHours(23, 59, 59, 999);

        const startTimestamp = Timestamp.fromMillis(startOfDay);
        const endTimestamp = Timestamp.fromMillis(endOfDay);

        const dataQuery = query(
          collection(db, 'data'),
          where('date', '>=', startTimestamp),
          where('date', '<=', endTimestamp)
        );

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          if (snapshot.docs.length > 0) {
            const docData = snapshot.docs[0].data();
            const docId = snapshot.docs[0].id;
            console.log('Fetched Document ID:', docId); // Log document ID
            console.log('Fetched Document Data:', docData); // Log document data

            setData({
              labourEntries: docData.labourEntries || [],
              expenseEntries: docData.expenseEntries || [],
              salesEntries: docData.salesEntries || [],
            });
            setDocId(docId); // Set the document ID
          } else {
            console.log('No documents found for the selected date.');
          }
        });

        return () => {
          unsubscribe();
        };
      };

      fetchData();
    }
  }, [date]);

  const handleEdit = async (collectionName, updatedEntries) => {
    if (!docId) {
      console.error('Document ID is missing.');
      return;
    }

    try {
      const docRef = doc(db, 'data', docId);
      console.log('Updating Document ID:', docId); // Log document ID
      console.log('Update Data:', {
        [`${collectionName}Entries`]: updatedEntries,
      }); // Log update data

      await updateDoc(docRef, {
        [`${collectionName}Entries`]: updatedEntries,
      });

      console.log('Update successful');
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleSubmitEdit = (collectionName, index, entry) => {
    const updatedEntries = data[`${collectionName}Entries`].map((e, i) =>
      i === index ? { ...entry } : e
    );

    handleEdit(collectionName, updatedEntries).then(() => {
      alert('Data updated successfully!');
      setEditMode(prev => ({ ...prev, [collectionName]: null }));
    }).catch(error => {
      console.error("Error updating documents:", error);
    });
  };

  const handleEditChange = (collectionName, index, field, value) => {
    const updatedEntries = data[`${collectionName}Entries`].map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setData(prevData => ({ ...prevData, [`${collectionName}Entries`]: updatedEntries }));
  };

  return (
    <div className="view-data">
      <h1>View Data</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="entries-section">
        <h2>Labour Entries</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Labour</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.labourEntries.length ? (
              data.labourEntries.map((entry, index) => (
                <tr key={index}>
                  {editMode.labour === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={entry.labour}
                          onChange={(e) => handleEditChange('labour', index, 'labour', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={(e) => handleEditChange('labour', index, 'amount', e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleSubmitEdit('labour', index, entry)}>Submit</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{entry.labour}</td>
                      <td>{entry.amount}</td>
                      <td>
                        <button onClick={() => setEditMode(prev => ({ ...prev, labour: index }))}>Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No labour entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="entries-section">
        <h2>Expense Entries</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.expenseEntries.length ? (
              data.expenseEntries.map((entry, index) => (
                <tr key={index}>
                  {editMode.expense === index ? (
                    <>
                      <td>
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={(e) => handleEditChange('expense', index, 'amount', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.remark}
                          onChange={(e) => handleEditChange('expense', index, 'remark', e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleSubmitEdit('expense', index, entry)}>Submit</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{entry.amount}</td>
                      <td>{entry.remark}</td>
                      <td>
                        <button onClick={() => setEditMode(prev => ({ ...prev, expense: index }))}>Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No expense entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="entries-section">
        <h2>Sales Entries</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.salesEntries.length ? (
              data.salesEntries.map((entry, index) => (
                <tr key={index}>
                  {editMode.sales === index ? (
                    <>
                      <td>
                        <input
                          type="number"
                          value={entry.quantity}
                          onChange={(e) => handleEditChange('sales', index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={entry.rate}
                          onChange={(e) => handleEditChange('sales', index, 'rate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={(e) => handleEditChange('sales', index, 'amount', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.name}
                          onChange={(e) => handleEditChange('sales', index, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleSubmitEdit('sales', index, entry)}>Submit</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{entry.quantity}</td>
                      <td>{entry.rate}</td>
                      <td>{entry.amount}</td>
                      <td>{entry.name}</td>
                      <td>
                        <button onClick={() => setEditMode(prev => ({ ...prev, sales: index }))}>Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">No sales entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewData;
