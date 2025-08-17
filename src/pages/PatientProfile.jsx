import React, { useState, useEffect } from "react";
import "../css/PatientProfileStyle.css";

const PatientProfile = () => {
  const initialProfile = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Kerala",
    dob: "1990-01-01",
    gender: "Male",
    pic: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  };

  const upcomingAppointments = [
    { doctor: "Dr. Anil Kumar", date: "2025-08-20", time: "10:30 AM" },
    { doctor: "Dr. Sreeja Menon", date: "2025-08-25", time: "2:00 PM" }
  ];

  const pastVisits = [
    { doctor: "Dr. Ramesh", date: "2025-07-15", time: "11:00 AM" },
    { doctor: "Dr. Meera", date: "2025-07-05", time: "4:00 PM" }
  ];

  const [profile, setProfile] = useState(initialProfile);

  const handleSaveProfile = () => {
    alert("Profile saved successfully!");
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({ ...profile, pic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>

      <header>
        <h1>User Profile</h1>
      </header>

      <main>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                id="profilePic"
                src={profile.pic}
                alt="Profile"
                onClick={() => document.getElementById("picInput").click()}
              />
              <div className="edit-icon">✎</div>
              <input
                type="file"
                id="picInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePicChange}
              />
            </div>

            <div className="profile-info">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <button className="btn" id="saveProfileBtn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>

        <div className="profile-card">
          <h3>Upcoming Appointments</h3>
          <div className="appointments">
            {upcomingAppointments.map((app, index) => (
              <div key={index} className="appointment-card">
                {app.doctor} - {app.date} at {app.time}
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <h3>Past Visits</h3>
          <div className="appointments">
            {pastVisits.map((app, index) => (
              <div key={index} className="appointment-card">
                {app.doctor} - {app.date} at {app.time}
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn logout-btn"
          onClick={() => window.location.href = "/"}
        >
          Logout
        </button>
      </main>
    </>
  );
};

export default PatientProfile;
