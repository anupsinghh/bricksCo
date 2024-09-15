import React from 'react';
import { downloadData } from '../utils/downloadData';
import '../styles.css';

const DownloadButton = () => {
  return (
    <div className="download-button-container">
      <h1>Download Data</h1>
      <button onClick={downloadData} className="download-button">
        Download Data
      </button>
    </div>
  );
};

export default DownloadButton;
