import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa"; // Import phone icon

const MunshiPage = () => {
  // State to manage the form data
  const [munshis, setMunshis] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState("");

  // Handler to add new Munshi
  const addMunshi = (e) => {
    e.preventDefault();

    // Ensure all inputs are filled
    if (name === "" || number === "" || amount === "" || paid === "") {
      alert("Please fill in all fields!");
      return;
    }

    // Calculate the balance
    const balance = amount - paid;

    // Add Munshi details to the list
    setMunshis([...munshis, { name, number, amount, paid, balance }]);

    // Clear the input fields
    setName("");
    setNumber("");
    setAmount("");
    setPaid("");
  };

  return (
    <div style={styles.container}>
      <h1>Munshi Management</h1>

      {/* Form to Add Munshi */}
      <form onSubmit={addMunshi} style={styles.form}>
        <input
          type="text"
          placeholder="Munshi Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Paid Amount"
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Add Munshi
        </button>
      </form>

      {/* Munshi List */}
      <h2>Munshi List</h2>
      <ul style={styles.list}>
        {munshis.map((munshi, index) => (
          <li key={index} style={styles.listItem}>
            <div style={styles.munshiInfo}>
              <span><strong>Name:</strong> {munshi.name}</span>
              <span><strong>Number:</strong> {munshi.number}</span>
              <span><strong>Amount:</strong> ₹{munshi.amount}</span>
              <span><strong>Paid:</strong> ₹{munshi.paid}</span>
              <span><strong>Balance:</strong> ₹{munshi.balance}</span>
            </div>
            {/* Call button with phone icon */}
            <a href={`tel:${munshi.number}`} style={styles.callButton}>
              <FaPhoneAlt />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Basic CSS styles for the components
const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    borderRadius: "5px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
  },
  munshiInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
  },
  callButton: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    borderRadius: "50%",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
  },
  '@media (max-width: 600px)': {
    listItem: {
      flexDirection: 'column',
      textAlign: 'left'
    }
  }
};

export default MunshiPage;
