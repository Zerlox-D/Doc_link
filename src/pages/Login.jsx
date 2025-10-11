
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginStyle.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [loading, setLoading] = useState(false);

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
        localStorage.setItem('role', data.userType);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_name', `${data.user.first_name} ${data.user.last_name}`);
        localStorage.setItem('user_email', data.user.email);
        
        if (data.userType === 'doctor') {
          localStorage.setItem('doctor_id', data.user.id);
          navigate('/DoctorProfile');
        } else {
          localStorage.setItem('patient_id', data.user.id);
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
      <div className="auth-card">
        <h1 className="auth-page-title">Welcome to Doc.link</h1>
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
