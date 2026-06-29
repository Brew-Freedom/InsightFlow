import React, { useState } from 'react';
import './UploadForm.css';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedData, setUploadedData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');
    
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setSuccess(`Successfully uploaded ${data.recordCount} records`);
      setUploadedData(data.data);
      setFile(null);
      document.getElementById('fileInput').value = '';
      
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Upload Marketing Data</h2>
        <p className="subtitle">Upload a CSV file to analyze your campaign performance</p>

        <form onSubmit={handleSubmit}>
          <div className="file-input-wrapper">
            <label htmlFor="fileInput" className="file-label">
              <div className="file-input-content">
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span className="file-text">
                  {file ? file.name : 'Click to select or drag and drop CSV file'}
                </span>
              </div>
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
              hidden
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            disabled={!file || loading}
            className="upload-button"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {uploadedData && uploadedData.length > 0 && (
          <div className="data-preview">
            <h3>Preview ({uploadedData.length} records)</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Campaign</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th>Conversions</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>{row.campaign}</td>
                      <td>{parseInt(row.impressions).toLocaleString()}</td>
                      <td>{parseInt(row.clicks).toLocaleString()}</td>
                      <td>{parseInt(row.conversions).toLocaleString()}</td>
                      <td>${parseFloat(row.revenue).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
