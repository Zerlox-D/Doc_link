import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginStyle.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [loading, setLoading] = useState(false);

  // Admin modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  // Secret admin credentials
  const ADMIN_EMAIL = "admin@doclink.com";
  const ADMIN_PASSWORD = "admin123";

useEffect(() => {
  if (showAdminModal) {
    // Disable scrolling
    document.body.style.overflow = 'hidden';
  } else {
    // Re-enable scrolling
    document.body.style.overflow = 'unset';
  }

  // Cleanup function to ensure scroll is re-enabled if component unmounts
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [showAdminModal]);


  // Easter egg: Triple-click on title to reveal admin login
  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimer) clearTimeout(clickTimer);
    
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 500);
    
    setClickTimer(timer);
    
    if (clickCount + 1 === 3) {
      setShowAdminModal(true);
      setClickCount(0);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem('role', 'admin');
      localStorage.setItem('admin_authenticated', 'true');
      navigate('/AdminDashboard');
    } else {
      alert('Invalid admin credentials!');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      alert("Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost/Doc_Link/php/LoginPage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPass,
          userType: userType
        })
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        if (data.userType === 'doctor') {
          if (data.user.verified === 0 || data.user.verified === false || data.user.verified === '0') {
            localStorage.setItem('doctor_id', data.user.id);
            localStorage.setItem('user_name', `${data.user.first_name} ${data.user.last_name}`);
            localStorage.setItem('verification_status', 'pending');
            navigate('/VerificationPending');
          } else {
            localStorage.setItem('role', data.userType);
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('doctor_id', data.user.id);
            localStorage.setItem('user_name', `${data.user.first_name} ${data.user.last_name}`);
            localStorage.setItem('user_email', data.user.email);
            navigate('/DoctorProfile');
          }
        } else {
          localStorage.setItem('role', data.userType);
          localStorage.setItem('user_id', data.user.id);
          localStorage.setItem('patient_id', data.user.id);
          localStorage.setItem('user_name', `${data.user.first_name} ${data.user.last_name}`);
          localStorage.setItem('user_email', data.user.email);
          navigate('/Home');
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Admin Modal */}
      {showAdminModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>🔐 Admin Access</h2>
              <button className="modal-close" onClick={() => setShowAdminModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdminLogin} className="admin-form">
              <div className="auth-field-group">
                <label htmlFor="admin-email" className="auth-field-label">Admin Email</label>
                <input
                  type="email"
                  id="admin-email"
                  className="auth-text-input"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  autoFocus
                />
              </div>
              <div className="auth-field-group">
                <label htmlFor="admin-password" className="auth-field-label">Admin Password</label>
                <input
                  type="password"
                  id="admin-password"
                  className="auth-text-input"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button type="submit" className="admin-login-btn">
                Login as Admin
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="auth-card">
        <h1 
          className="auth-page-title" 
          onClick={handleTitleClick}
          style={{cursor: 'pointer', userSelect: 'none'}}
        >
          Welcome to Doc.link
        </h1>
        <p className="auth-page-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field-group">
            <label className="auth-field-label">Login as:</label>
            <div className="auth-user-type-selector">
              <label className="auth-radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="patient"
                  checked={userType === "patient"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <span>Patient</span>
              </label>
              <label className="auth-radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="doctor"
                  checked={userType === "doctor"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <span>Doctor</span>
              </label>
            </div>
          </div>

          {/* Email Input */}
          <div className="auth-field-group">
            <label htmlFor="email" className="auth-field-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="auth-text-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="auth-field-group">
            <label htmlFor="password" className="auth-field-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="auth-text-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="auth-alternate-action">
          <p>
            Don't have an account?{" "}
            <Link to="/SignUpChoice" className="auth-text-link">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="auth-navigation-back">
          <Link to="/" className="auth-text-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
