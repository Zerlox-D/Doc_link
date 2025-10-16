import React, { useState, useEffect } from "react";
import "../css/HomeStyle.css";
import { Link, useNavigate } from "react-router-dom";
import FooterMinimal from "../components/FooterMinimal";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const heroBox = document.querySelector(".hero-box");
    if (heroBox) {
      heroBox.classList.add("active");
    }

    const storedName = localStorage.getItem("user_name");
    const storedPatientId = localStorage.getItem("patient_id");
    
    if (storedName) setUserName(storedName);
    if (storedPatientId) {
      setPatientId(storedPatientId);
      fetchNextAppointment(storedPatientId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNextAppointment = async (patientId) => {
    try {
      const response = await fetch(`http://localhost/Doc_Link/php/GetPatientNextAppointment.php?patient_id=${patientId}`);
      const data = await response.json();
      if (data && !data.error) {
        setNextAppointment(data);
      }
    } catch (error) {
      console.error("Error fetching next appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/PatientProfile");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo">Doc.link</div>
        <div className="home-user-section">
          <span className="home-user-greeting">Welcome, {userName || "Guest"}!</span>
          <div className="home-profile-icon" onClick={handleProfileClick} title="View Profile">
            👤
          </div>
          <button className="home-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-box">
            <h2>Your Health, Simplified.</h2>
            <p>Find and book appointments with trusted doctors in minutes.</p>
            <Link to="/SearchDoctors">
              <button className="btn btn-primary">🔍 Search for Doctors</button>
            </Link>
          </div>
        </section>

        <section className="next-appointment-section">
          <h3 className="section-title">My Next Appointment</h3>
          {loading ? (
            <div className="appointment-card loading-card">
              <p>Loading your appointments...</p>
            </div>
          ) : nextAppointment ? (
            <div className="appointment-card">
              <div className="appointment-icon">🩺</div>
              <div className="appointment-details">
                <h4>Dr. {nextAppointment.doctor_name}</h4>
                <p className="appointment-specialty">{nextAppointment.specialty}</p>
                <div className="appointment-datetime">
                  <span className="appointment-date">📅 {nextAppointment.appointment_date}</span>
                  <span className="appointment-time">🕐 {nextAppointment.appointment_time}</span>
                </div>
                <p className="appointment-mode">Mode: {nextAppointment.mode_of_booking}</p>
              </div>
              <Link to="/PatientProfile?tab=appointments">
                <button className="btn-view-details">View All</button>
              </Link>
            </div>
          ) : (
            <div className="appointment-card empty-card">
              <div className="empty-icon">📅</div>
              <p className="empty-message">You have no upcoming appointments.</p>
              <p className="empty-subtitle">Time to book your next check-up!</p>
              <Link to="/search-doctors">
                <button className="btn btn-secondary">Book Now</button>
              </Link>
            </div>
          )}
        </section>

        <section className="quick-access-section">
          <h3 className="section-title">How can we help you today?</h3>
          <div className="quick-access-grid">
            <Link to="/SearchDoctors" className="quick-card">
              <div className="quick-icon">🔍</div>
              <h4>Book an Appointment</h4>
              <p>Search and book with verified doctors</p>
            </Link>

            <Link to="/PatientProfile?tab=appointments" className="quick-card">
              <div className="quick-icon">📋</div>
              <h4>My Appointments</h4>
              <p>View and manage your bookings</p>
            </Link>

            <Link to="/PatientProfile?tab=appointments" className="quick-card">
              <div className="quick-icon">🏥</div>
              <h4>Medical Records</h4>
              <p>View your prescriptions and medical history</p>
            </Link>
          </div>
        </section>
      </main>
      <div className="mini-footer">
        <FooterMinimal />
      </div>
    </div>
  );
};

export default Home;