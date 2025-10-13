import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/VerificationPendingStyle.css';

export default function VerificationPending() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    setDoctorName(name || 'Doctor');
  }, []);

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    const doctorId = localStorage.getItem('doctor_id');
    
    try {
      const response = await fetch(`http://localhost/Doc_Link/php/CheckVerificationStatus.php?doctor_id=${doctorId}`);
      const data = await response.json();
      
      if (data.verified) {
        // Doctor is now verified!
        localStorage.setItem('role', 'doctor');
        localStorage.removeItem('verification_status');
        alert('Great news! Your account has been verified. Redirecting to your profile...');
        navigate('/DoctorProfile');
      } else {
        alert('Your account is still under review. Please check back later.');
      }
    } catch (error) {
      alert('Unable to check status. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="vp-container">
      <div className="vp-card">
        <div className="vp-icon">⏳</div>
        <h1 className="vp-title">Account Under Review</h1>
        <p className="vp-greeting">Hello, Dr. {doctorName}!</p>
        <p className="vp-message">
          Thank you for registering with Doc.link. Your account is currently being reviewed by our admin team.
        </p>
        <div className="vp-info-box">
          <h3>What's Next?</h3>
          <ul>
            <li>Our team is verifying your credentials and license information</li>
            <li>This process typically takes 24-48 hours</li>
            <li>You'll be able to access your full account once verified</li>
          </ul>
        </div>
        <div className="vp-actions">
          <button 
            className="vp-check-btn"
            onClick={handleCheckStatus}
            disabled={checkingStatus}
          >
            {checkingStatus ? 'Checking...' : '🔄 Check Verification Status'}
          </button>
          <button className="vp-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <p className="vp-contact">
          Need help? Contact us at <strong>admin@doclink.com</strong>
        </p>
      </div>
    </div>
  );
}