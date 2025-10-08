// import React, { useEffect, useState } from 'react';
// import '../css/DocProfileViewStyle.css';
// import { Link, useParams } from 'react-router-dom';

// function DoctorProfileViewer() {

// const { id } = useParams();
//   const [doctorData, setDoctorData] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost/Doc_Link/php/GetDoctor.php?id=${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Fetched doctor:", data);
//         setDoctorData(data);
//       })
//       .catch((err) => console.error(err));
//   }, [id]);

//   if (!doctorData) return <p>Loading doctor profile...</p>;

//   if (doctorData.error) return <p>{doctorData.error}</p>;

// return (
//     <div className="patient-doctor-profile-container">
//       <header className="patient-profile-header">
//         <span className="header-logo">Doc.link</span>
//         <div className="header-navigation">
//           <div className="header-user-info">
//             <span className="user-greeting">Welcome, Patient</span>
//             <button className="logout-btn">Logout</button>
//           </div>
//         </div>
//       </header>

//       <div className="patient-profile-content">
//         <div className="doctor-profile-card">
//           <div className="doctor-header">
//             <div className="doctor-basic-info">
//               <div className="doctor-avatar"><span>👨‍⚕️</span></div>
//               <div className="doctor-details">
//                 <h1>
//                   Dr. {doctorData.first_name} {doctorData.last_name}
//                 </h1>
//                 <p className="specializations-text">{doctorData.specialty}</p>
//                 <p className="experience-text">
//                   Experience: {doctorData.experience} years
//                 </p>
//               </div>
//             </div>
//             <div className="verification-badge">
//               <div className="verified-icon">✓</div>
//               <span>{doctorData.verified ? "Verified Doctor" : "Unverified"}</span>
//             </div>
//           </div>

//           <div className="doctor-info-grid">
//             <div className="info-section">
//               <h3>Contact Information</h3>
//               <p>📧 {doctorData.email}</p>
//               <p>📞 {doctorData.phone_no}</p>
//               <p>🆔 {doctorData.license_no}</p>
//             </div>

//             <div className="info-section">
//               <h3>Professional Details</h3>
//               <p>🎯 {doctorData.specialty}</p>
//               <p>👤 {doctorData.gender}</p>
//               <p>🏥 {doctorData.hospital}</p>
//               <p>🏢 {doctorData.clinic}</p>
//             </div>
//           </div>
//           <div className="action-buttons">
//          <Link to={`/Book?doctor=${doctorData.first_name} ${doctorData.last_name}&mode=schedule`}>
//            <button className="action-btn schedule-btn">
//                <span style={{ fontSize: '18px' }}>Schedule Appointment</span>
//              </button>
//          </Link>
//            <Link to={`/Book?doctor=${doctorData.first_name} ${doctorData.last_name}&mode=home`}>
//              <button className="action-btn home-visit-btn">
//                <span style={{ fontSize: '18px' }}>Book Home Visit</span>
//              </button>
//            </Link>
//          </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DoctorProfileViewer;

import React, { useEffect, useState } from 'react';
import '../css/DocProfileViewStyle.css';
import { Link, useParams } from 'react-router-dom';

function DoctorProfileViewer() {
    const { id } = useParams();
    const [doctorData, setDoctorData] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost/Doc_Link/php/GetDoctorWithAvailability.php?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched doctor:", data);
                if (data.error) {
                    setDoctorData({ error: data.error });
                } else {
                    setDoctorData(data.doctor);
                    setAvailability(data.availability || []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setDoctorData({ error: 'Failed to load doctor profile' });
                setLoading(false);
            });
    }, [id]);

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getDayName = (day) => {
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    const getConsultationFee = () => {
        const availableDay = availability.find(a => a.is_available);
        return availableDay?.consultation_fee || 'N/A';
    };

    const getHomeVisitFee = () => {
        const homeVisitDay = availability.find(a => a.home_visit_available);
        return homeVisitDay?.home_visit_fee || 'N/A';
    };

    const isHomeVisitAvailable = () => {
        return availability.some(a => a.home_visit_available);
    };

    if (loading) return (
        <div className="patient-doctor-profile-container">
            <div className="loading-message">Loading doctor profile...</div>
        </div>
    );

    if (doctorData?.error) return (
        <div className="patient-doctor-profile-container">
            <div className="error-message">{doctorData.error}</div>
        </div>
    );

    return (
        <div className="patient-doctor-profile-container">
            {/* Header */}
            <header className="patient-profile-header">
                <div className="header-logo">Doc.link</div>
                <div className="header-navigation">
                    <Link to="/SearchDoctors">
                        <button className="back-btn">← Back to Search</button>
                    </Link>
                    <div className="header-user-info">
                        <span className="user-greeting">Welcome, Patient</span>
                        <button className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="patient-profile-content">
                {/* Doctor Information Card */}
                <div className="doctor-info-card">
                    <div className="doctor-header-section">
                        <div className="doctor-avatar">
                            <span className="avatar-emoji">👨‍⚕️</span>
                        </div>
                        <div className="doctor-basic-info">
                            <h1 className="doctor-name">
                                Dr. {doctorData.first_name} {doctorData.last_name}
                            </h1>
                            <p className="doctor-specialty">{doctorData.specialty}</p>
                            <p className="doctor-experience">
                                Experience: {doctorData.experience} years
                            </p>
                        </div>
                    </div>

                    {/* Contact and Details Grid */}
                    <div className="doctor-details-grid">
                        <div className="detail-item">
                            <span className="detail-icon">📧</span>
                            <span className="detail-text">{doctorData.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">📞</span>
                            <span className="detail-text">{doctorData.phone_no}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🆔</span>
                            <span className="detail-text">{doctorData.license_no}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <span className="detail-text">{doctorData.city}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">👤</span>
                            <span className="detail-text">{doctorData.gender}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🎯</span>
                            <span className="detail-text">{doctorData.specialty}</span>
                        </div>
                    </div>

                    {/* Affiliations */}
                    <div className="doctor-affiliations">
                        <div className="affiliation-section">
                            <h3 className="affiliation-title">🏥 Hospital</h3>
                            <p className="affiliation-text">
                                {doctorData.hospital || 'Not specified'}
                            </p>
                        </div>
                        <div className="affiliation-section">
                            <h3 className="affiliation-title">🏢 Clinic</h3>
                            <p className="affiliation-text">
                                {doctorData.clinic || 'Not specified'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Consultation Fees */}
                <div className="fees-section">
                    <h2 className="section-title">💰 Consultation Fees</h2>
                    <div className="fees-grid">
                        <div className="fee-card">
                            <div className="fee-icon">🏥</div>
                            <div className="fee-details">
                                <p className="fee-type">Clinic/Hospital Visit</p>
                                <p className="fee-amount">₹{getConsultationFee()}</p>
                            </div>
                        </div>
                        <div className="fee-card">
                            <div className="fee-icon">🏠</div>
                            <div className="fee-details">
                                <p className="fee-type">Home Visit</p>
                                <p className="fee-amount">
                                    {isHomeVisitAvailable() 
                                        ? `₹${getHomeVisitFee()}` 
                                        : 'Not Available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Availability Schedule */}
                <div className="availability-section">
                    <h2 className="section-title">🗓️ Weekly Availability</h2>
                    <div className="availability-grid">
                        {availability.length > 0 ? (
                            availability.map((dayData) => (
                                <div 
                                    key={dayData.day_of_week} 
                                    className={`availability-day-card ${
                                        dayData.is_available ? 'available' : 'unavailable'
                                    }`}
                                >
                                    <div className="day-header">
                                        <h3 className="day-name">
                                            {getDayName(dayData.day_of_week)}
                                        </h3>
                                        <span className={`status-badge ${
                                            dayData.is_available ? 'available-badge' : 'unavailable-badge'
                                        }`}>
                                            {dayData.is_available ? '✓ Available' : '✗ Unavailable'}
                                        </span>
                                    </div>
                                    {dayData.is_available && (
                                        <div className="day-details">
                                            <p className="timing">
                                                ⏰ {formatTime(dayData.start_time)} - {formatTime(dayData.end_time)}
                                            </p>
                                            {dayData.home_visit_available && (
                                                <p className="home-visit-indicator">
                                                    {isHomeVisitAvailable() 
                                        ? `🏠 Home visits available` 
                                        : 'Not Available'}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-availability">
                                <p>Doctor has not set availability yet. Please contact directly.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <Link to={`/Book?doctor_id=${id}&doctor=${doctorData.first_name} ${doctorData.last_name}&mode=schedule`}>
                      <button className="book-appointment-btn">
                          📅 Book Appointment
                      </button>
                    </Link>
                    <Link to={`/Book?doctor_id=${id}&doctor=${doctorData.first_name} ${doctorData.last_name}&mode=home`}>
                      <button className="book-home-visit-btn" >
                          🏠 Book Home Visit
                      </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfileViewer;
