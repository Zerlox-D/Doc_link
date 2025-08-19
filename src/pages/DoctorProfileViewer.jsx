import React, { useEffect, useState } from 'react';
import '../css/DocProfileViewStyle.css';
import { Link, useParams } from 'react-router-dom';

function DoctorProfileViewer() {

const { id } = useParams();
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/Doc_Link/php/GetDoctor.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched doctor:", data);
        setDoctorData(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!doctorData) return <p>Loading doctor profile...</p>;

  if (doctorData.error) return <p>{doctorData.error}</p>;

return (
    <div className="patient-doctor-profile-container">
      <header className="patient-profile-header">
        <span className="header-logo">Doc.link</span>
        <div className="header-navigation">
          <div className="header-user-info">
            <span className="user-greeting">Welcome, Patient</span>
            <button className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="patient-profile-content">
        <div className="doctor-profile-card">
          <div className="doctor-header">
            <div className="doctor-basic-info">
              <div className="doctor-avatar"><span>👨‍⚕️</span></div>
              <div className="doctor-details">
                <h1>
                  Dr. {doctorData.first_name} {doctorData.last_name}
                </h1>
                <p className="specializations-text">{doctorData.specialty}</p>
                <p className="experience-text">
                  Experience: {doctorData.experience} years
                </p>
              </div>
            </div>
            <div className="verification-badge">
              <div className="verified-icon">✓</div>
              <span>{doctorData.verified ? "Verified Doctor" : "Unverified"}</span>
            </div>
          </div>

          <div className="doctor-info-grid">
            <div className="info-section">
              <h3>Contact Information</h3>
              <p>📧 {doctorData.email}</p>
              <p>📞 {doctorData.phone_no}</p>
              <p>🆔 {doctorData.license_no}</p>
            </div>

            <div className="info-section">
              <h3>Professional Details</h3>
              <p>🎯 {doctorData.specialty}</p>
              <p>👤 {doctorData.gender}</p>
              <p>🏥 {doctorData.hospital}</p>
              <p>🏢 {doctorData.clinic}</p>
            </div>
          </div>
          <div className="action-buttons">
         <Link to={`/Book?doctor=${doctorData.first_name} ${doctorData.last_name}&mode=schedule`}>
           <button className="action-btn schedule-btn">
               <span style={{ fontSize: '18px' }}>Schedule Appointment</span>
             </button>
         </Link>
           <Link to={`/Book?doctor=${doctorData.first_name} ${doctorData.last_name}&mode=home`}>
             <button className="action-btn home-visit-btn">
               <span style={{ fontSize: '18px' }}>Book Home Visit</span>
             </button>
           </Link>
         </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileViewer;