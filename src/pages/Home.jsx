import React, { useState, useEffect } from "react";
import "../css/HomeStyle.css";
import { Link,useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const heroBox = document.querySelector(".hero-box");
    if (heroBox) {
      heroBox.classList.add("active");
    }

    // Get user name from localStorage
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("patient_id");
    localStorage.removeItem("doctor_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    
    // Redirect to landing page
    navigate("/");
  };

  return (
    <>
      <header className="home-header">
        <div className="logo">
          <h1>Doc.link</h1>
        </div>
        <div className="home-user-section">
          {userName && (
            <span className="home-user-greeting">Welcome, {userName}!</span>
          )}
          <button onClick={handleLogout} className="home-logout-btn">
            Logout
          </button>
        </div>
        <ul className="nav-links">
          {/* <li><Link to="/PatientProfile">Patient Profile</Link></li> */}
        </ul>
      </header>

      <section className="hero" id="home">
        <div className="hero-box">
          <h2>Your Health, One Click Away</h2>
          <p>
            Instantly book appointments with experienced doctors and clinics near you.
            Simple, secure, and made for your comfort.
          </p>
          <Link to="/SearchDoctors"><button className="btn">Search Doctors</button></Link>
        </div>
      </section>
    </>
  );
};

export default Home;
