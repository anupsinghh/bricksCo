import { saveAs } from 'file-saver';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config'; // Adjust the path to your Firebase config file
import { utils, write } from 'xlsx'; // Import named exports from 'xlsx'

export const downloadData = async () => {
  try {
    // Query the 'data' collection
    const dataQuery = query(collection(db, 'data'));
    const snapshot = await getDocs(dataQuery);
    const allData = snapshot.docs.map(doc => doc.data());

    // Generate workbook and sheets
    const wb = utils.book_new();

    // Labour Entries Sheet
    const labourSheet = utils.json_to_sheet(generateLabourData(allData), { header: ["Date", "Labour Name", "Bricks Quantity"] });
    utils.book_append_sheet(wb, labourSheet, "Labour Entries");

    // Sales Entries Sheet
    const salesSheet = utils.json_to_sheet(generateSalesData(allData), { header: ["Date", "Quantity", "Rate", "Customer Name"] });
    utils.book_append_sheet(wb, salesSheet, "Sales Entries");

    // Expense Entries Sheet
    const expenseSheet = utils.json_to_sheet(generateExpenseData(allData), { header: ["Date", "Expense Name", "Amount"] });
    utils.book_append_sheet(wb, expenseSheet, "Expense Entries");

    // Save the workbook
    const wbout = write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, 'database_data.xlsx');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const generateLabourData = (data) => {
  const result = [];
  data.forEach((doc) => {
    if (Array.isArray(doc.labourEntries)) {
      doc.labourEntries.forEach(entry => {
        result.push({
          Date: doc.date.toDate().toISOString().split('T')[0],
          'Labour Name': entry.labour,
          'Bricks Quantity': entry.amount || ''
        });
      });
    }
  });
  return result;
};

const generateSalesData = (data) => {
  const result = [];
  data.forEach((doc) => {
    if (Array.isArray(doc.salesEntries)) {
      doc.salesEntries.forEach(entry => {
        result.push({
          Date: doc.date.toDate().toISOString().split('T')[0],
          Quantity: entry.quantity || '',
          Rate: entry.rate || '',
          'Customer Name': entry.name || ''
        });
      });
    }
  });
  return result;
};

const generateExpenseData = (data) => {
  const result = [];
  data.forEach((doc) => {
    if (Array.isArray(doc.expenseEntries)) {
      doc.expenseEntries.forEach(entry => {
        result.push({
          Date: doc.date.toDate().toISOString().split('T')[0],
          'Expense Name': entry.expenseName || '',
          Amount: entry.amount || ''
        });
      });
    }
  });
  return result;
};

// Helper function to convert string to ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
