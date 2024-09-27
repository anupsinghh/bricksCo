import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa"; // Import the phone icon

const LabourPage = () => {
  // State to store labour details
  const [labours, setLabours] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  // Handler to add a new labour
  const addLabour = (e) => {
    e.preventDefault();

    // Simple validation to ensure name and number are provided
    if (name === "" || number === "") {
      alert("Please fill in both name and number!");
      return;
    }

    // Add labour to the list
    setLabours([...labours, { name, number }]);

    // Clear input fields
    setName("");
    setNumber("");
  };

  return (
    <div style={styles.container}>
      <h1>Labour Management</h1>

      {/* Form to Add Labour */}
      <form onSubmit={addLabour} style={styles.form}>
        <input
          type="text"
          placeholder="Labour Name"
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
        <button type="submit" style={styles.button}>
          Add Labour
        </button>
      </form>

      {/* Labour List */}
      <h2>Labour List</h2>
      <ul style={styles.list}>
        {labours.map((labour, index) => (
          <li key={index} style={styles.listItem}>
            <span>{labour.name}</span>
            <div style={styles.callSection}>
              <span>{labour.number}</span>
              {/* Call button with phone icon */}
              <a href={`tel:${labour.number}`} style={styles.callButton}>
                <FaPhoneAlt />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Basic CSS styles for the components
const styles = {
  container: {
    maxWidth: "600px",
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
  callSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
};

export default LabourPage;
