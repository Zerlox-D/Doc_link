import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/AppointmentStyle.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BookAppointment() {
  const query = useQuery();
  const modeParam = query.get("mode");
  const doctorNameParam = query.get("doctor");

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: doctorNameParam || "",
    reason: "",
    date: "",
    time: "",
    mode: "",
  });

  const [success, setSuccess] = useState(false);
  const [availableModes, setAvailableModes] = useState([]);

  useEffect(() => {
    if (modeParam === "schedule") {
      setAvailableModes(["Hospital", "Clinic"]);
    } else if (modeParam === "home") {
      setAvailableModes(["Home Visit"]);
      setFormData((prev) => ({ ...prev, mode: "Home Visit" }));
    }
  }, [modeParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);

    // Reset, but preserve doctorName and mode if home visit
    setFormData({
      patientName: "",
      doctorName: doctorNameParam || "",
      reason: "",
      date: "",
      time: "",
      mode: modeParam === "home" ? "Home Visit" : "",
    });
  };

  return (
    <div className="ba-container">
      <nav className="ba-navbar">
        <span className="ba-logo">Doc.Link</span>
        <a href="/" className="ba-logout-btn">Logout</a>
      </nav>

      <header className="ba-header">
        <h1 className="ba-title">Book an Appointment</h1>
        <p className="ba-subtitle">Fill in your details to confirm booking</p>
      </header>

      <main className="ba-main">
        <div className="ba-form-card">
          <form onSubmit={handleSubmit} className="ba-form">
            <div className="ba-form-group">
              <label className="ba-label" htmlFor="patientName">Patient Name</label>
              <input
                className="ba-input"
                type="text"
                id="patientName"
                name="patientName"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ba-form-group">
              <label className="ba-label" htmlFor="doctorName">Doctor Name</label>
              <input
                className="ba-input"
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                readOnly
              />
            </div>

            <div className="ba-form-group">
              <label className="ba-label" htmlFor="reason">Reason for Booking</label>
              <textarea
                className="ba-textarea"
                id="reason"
                name="reason"
                placeholder="Brief description of illness or purpose"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ba-form-group">
              <label className="ba-label" htmlFor="date">Date</label>
              <input
                className="ba-input"
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ba-form-group">
              <label className="ba-label" htmlFor="time">Time</label>
              <input
                className="ba-input"
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ba-form-group">
              <label className="ba-label" htmlFor="mode">Mode of Booking</label>
              <select
                className="ba-select"
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
              >
                <option value="">Select Mode</option>
                {availableModes.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="ba-btn ba-btn-primary">
              Confirm Booking
            </button>
          </form>

          {success && (
            <div className="ba-success-msg">
              ✅ Appointment booked successfully! <br />
              <a href="/" className="ba-home-link">Go back to Home</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
