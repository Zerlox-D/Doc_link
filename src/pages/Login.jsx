import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/LoginStyle.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    const credentials = {
      doctor: { username: "doctor", password: "doc123", redirect: "/DoctorProfile" },
      patient: { username: "patient", password: "pat123", redirect: "/Home" },
      admin: { username: "admin", password: "admin123", redirect: "/AdminDashboard" }
    };
    if (trimmedUser && trimmedPass) {
      if (
        trimmedUser === credentials.doctor.username &&
        trimmedPass === credentials.doctor.password
      ) {
        localStorage.setItem("role", "doctor");
        window.location.href = credentials.doctor.redirect;
      } else if (
        trimmedUser === credentials.patient.username &&
        trimmedPass === credentials.patient.password
      ) {
        localStorage.setItem("role", "patient");
        window.location.href = credentials.patient.redirect;
      } else if (
        trimmedUser === credentials.admin.username &&
        trimmedPass === credentials.admin.password
      ) {
        localStorage.setItem("role", "admin");
        window.location.href = credentials.admin.redirect;
      } else {
        alert("Invalid username or password!");
      }
    } else {
      alert("Please enter both name and password!");
    }
  };

  return (
    <div>
      <nav className="login-navbar">
        <div className="nav-left">
          <Link to="/" className="logo">Doc.link</Link>
        </div>
        <div className="nav-right">
          <Link to="/SignUpChoice" className="signup-button">Sign Up &rarr;</Link>
        </div>
      </nav>
      <div className="login-page">
        <div className="login-container1">
          <h2>Login to Doc.link</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
