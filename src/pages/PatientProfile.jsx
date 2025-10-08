import React, { useState } from "react";
import "../css/PatientProfileStyle.css";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    dob: "1995-08-15",
    gender: "Male",
    bloodGroup: "O+",
    height: "175 cm",
    weight: "70 kg",
    email: "john.doe@gmail.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Kochi",
    emergency: "+91 9876543211",
    occupation: "Software Engineer",
    allergies: "None",
  });
  const [originalData, setOriginalData] = useState(profileData);
  const [profilePic, setProfilePic] = useState("👨");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPicSelector, setShowPicSelector] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const handleEdit = () => {
    setOriginalData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const confirmCancelAppointment = (id) => {
    setAppointmentToCancel(id);
    setShowConfirm(true);
  };

  const cancelConfirmed = () => {
    if (appointmentToCancel) {
      setAppointments((prev) =>
        prev.filter((app) => app.id !== appointmentToCancel)
      );
    }
    setShowConfirm(false);
  };

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Meera Krishnan",
      specialty: "Dermatology",
      date: "Aug 20, 2025",
      time: "10:30 AM",
    },
    {
      id: 2,
      doctor: "Dr. Arun Kumar",
      specialty: "Cardiology",
      date: "Aug 25, 2025",
      time: "2:15 PM",
    },
  ]);

  const pastAppointments = [
    {
      id: 3,
      doctor: "Dr. Priya Menon",
      specialty: "Orthopedics",
      date: "Jul 10, 2025",
      time: "4:00 PM",
    },
    {
      id: 4,
      doctor: "Dr. Rahul Singh",
      specialty: "General Physician",
      date: "Jun 22, 2025",
      time: "11:15 AM",
    },
  ];

  return (
    <div className="up-container">
      <nav className="up-navbar">
        <div className="up-nav-left">
          <Link className="up-nav-link" to="/Home">Home</Link>
          <Link className="up-nav-link" to="/">Profile</Link>
        </div>
        <Link className="up-logout-btn" to="/Login">Logout</Link>
      </nav>

      <header className="up-header">
        <h1 className="up-title">User Dashboard</h1>
        <div className="up-subtitle">
          Manage your personal information and appointments
        </div>
      </header>

      <main className="up-main">
        <div className="up-profile-card">
          <div className="up-profile-header">
            <div className="up-pic-container">
              <div
                className="up-profile-pic"
                onClick={() => setShowPicSelector(true)}
              >
                {profilePic}
              </div>
              {/* <button
                className="up-change-pic-btn"
                onClick={() => setShowPicSelector(true)}
              >
                📸 Change
              </button> */}
            </div>
            <div className="up-basic-info">
              <h2 className="up-display-name">{profileData.name}</h2>
              <div className="up-role">Patient</div>
            </div>
          </div>

          <div className="up-details-section">
            {/* Personal Info */}
            <div className="up-detail-group">
              <h3 className="up-section-title">Personal Information</h3>
              {[
                ["Full Name", "name"],
                ["Date of Birth", "dob"],
                ["Gender", "gender"],
                ["Blood Group", "bloodGroup"],
                ["Height", "height"],
                ["Weight", "weight"],
              ].map(([label, key]) => (
                <div className="up-detail-row" key={key}>
                  <span className="up-detail-label">{label}</span>
                  {isEditing ? (
                    <input
                      className="up-detail-input"
                      value={profileData[key]}
                      onChange={(e) =>
                        handleInputChange(key, e.target.value)
                      }
                    />
                  ) : (
                    <span className="up-detail-value">{profileData[key]}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="up-detail-group">
              <h3 className="up-section-title">Contact Information</h3>
              {[
                ["Email", "email"],
                ["Phone", "phone"],
                ["Address", "address"],
                ["Emergency", "emergency"],
                ["Occupation", "occupation"],
                ["Allergies", "allergies"],
              ].map(([label, key]) => (
                <div className="up-detail-row" key={key}>
                  <span className="up-detail-label">{label}</span>
                  {isEditing ? (
                    <input
                      className="up-detail-input"
                      value={profileData[key]}
                      onChange={(e) =>
                        handleInputChange(key, e.target.value)
                      }
                    />
                  ) : (
                    <span className="up-detail-value">{profileData[key]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="up-edit-controls">
            {!isEditing && (
              <button className="up-btn up-edit-btn" onClick={handleEdit}>
                ✏️ Edit
              </button>
            )}
            {isEditing && (
              <>
                <button className="up-btn up-save-btn" onClick={handleSave}>
                  💾 Save
                </button>
                <button className="up-btn up-cancel-edit-btn" onClick={handleCancel}>
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Appointments */}
        <div className="up-section-card">
          <h3 className="up-section-title">📅 Upcoming Appointments</h3>
          {appointments.map((app) => (
            <div className="up-appointment-item" key={app.id}>
              <div>
                <strong>{app.doctor}</strong>
                <br />
                {app.specialty} • {app.date} • {app.time}
              </div>
              <button
                className="up-cancel-btn"
                onClick={() => confirmCancelAppointment(app.id)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>

        <div className="up-section-card">
          <h3 className="up-section-title">🕒 Previous Appointments</h3>
          {pastAppointments.map((app) => (
            <div className="up-appointment-item" key={app.id}>
              <div>
                <strong>{app.doctor}</strong>
                <br />
                {app.specialty} • {app.date} • {app.time}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Confirm Box */}
      {showConfirm && (
        <div className="up-confirm-box">
          <div className="up-confirm-dialog">
            <h3>⚠️ Cancel Appointment</h3>
            <p>Are you sure you want to cancel?</p>
            <button className="up-btn up-save-btn" onClick={cancelConfirmed}>
              Yes
            </button>
            <button
              className="up-btn up-cancel-edit-btn"
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
