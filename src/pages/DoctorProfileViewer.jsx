import React, { useEffect, useState } from 'react';
import '../css/DocProfileViewStyle.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FooterMinimal from "../components/FooterMinimal";


function DoctorProfileViewer() {
    const { id } = useParams();
    const [doctorData, setDoctorData] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [isGuest, setIsGuest] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [ratingStats, setRatingStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const heroBox = document.querySelector(".hero-box");
        if (heroBox) {
          heroBox.classList.add("active");
        }
    
        const storedName = localStorage.getItem("user_name");
        if (storedName) {
          setUserName(storedName);
        }
      }, []);

    useEffect(() => {
        const patientId = localStorage.getItem("patient_id");
        if (!patientId) {
            setIsGuest(true);
        }
      }, []);

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

    useEffect(() => {
  if (id) {
    fetch(`http://localhost/Doc_Link/php/GetDoctorReviews.php?doctor_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
          setRatingStats(data.statistics);
        }
      });
  }
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

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleBookingClick = (mode) => {
    if (isGuest) {
    // Redirect to signup with return URL
    navigate(`/PatientSignUp?returnTo=/doctor/${id}&mode=${mode}`);
    } else {
    // Proceed with normal booking
    navigate(`/Book?mode=${mode}&doctor=${doctorData.first_name} ${doctorData.last_name}&doctor_id=${doctorData.doctor_id}`);
    }
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
                <div className="dpp-header-left">
                    <span className="header-logo">Doc.link</span>
                    <span className="user-greeting">
                        Hello, {userName || "Guest User"}!
                    </span>
                </div>
                <div className="header-navigation">
                    {!isGuest ? (
                    <>
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                    ) : (
                    <>
                    <button className="back-btn" onClick={() => navigate('/SearchDoctors')}>
                        ← Back to Search
                    </button>
                    <Link to="/Login" className="guest-login-link">Login</Link>
                    <Link to="/PatientSignUp"><button className="guest-signup-btn">Sign Up</button></Link>
                    </>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="patient-profile-content">
                {/* Doctor Information Card */}
                <div className="doctor-info-card">
                {/* Doctor Header */}
                    <div className="doctor-header">
                        <div className="doctor-basic-info">
                            <div className="doctor-avatar">👨‍⚕️</div>
                            <div className="doctor-details">
                                <h1 className="doctor-name">Dr. {doctorData.first_name} {doctorData.last_name}</h1>
                                <p className="doctor-specialty-main">{doctorData.specialty}</p>
                                <p className="experience-text">
                                    {doctorData.experience} years of experience
                                </p>
                                {doctorData.total_reviews > 0 ? (
                                <div className="doctor-profile-rating">
                                    <span className="doctor-rating-value">{doctorData.average_rating}</span>
                                    <span className="doctor-rating-star">⭐</span>
                                    <span className="doctor-rating-count">({doctorData.total_reviews})</span>
                                </div>
                                ) : (
                                <div className="doctor-profile-rating no-reviews">
                                    <span className="doctor-no-rating-text">No reviews yet</span>
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="doctor-verification">
                            <div className={`verify-badge ${doctorData.verified ? 'verified' : 'pending'}`}>
                                {doctorData.verified ? '✔ Verified Professional' : 'Verification Pending'}
                            </div>
                        </div>
                        
                    </div>

                    {/* Doctor Info Grid */}
                    <div className="doctor-info-grid">
                        {/* Contact & Location */}
                        <div className="info-section">
                            <h3 className="info-section-title">
                                <span className="icon">📞</span> Contact & Personal Details
                            </h3>
                            <div className="info-fields">
                                <div className="field-group">
                                    <label>Email</label>
                                    <p className="field-display">{doctorData.email}</p>
                                </div>
                                <div className="field-group">
                                    <label>Phone</label>
                                    <p className="field-display">{doctorData.phone_no}</p>
                                </div>
                                <div className="field-group">
                                    <label>Gender</label>
                                    <p className="field-display">{doctorData.gender}</p>
                                </div>
                                <div className="field-group">
                                    <label>City</label>
                                    <p className="field-display">{doctorData.city}</p>
                                </div>
                            </div>
                        </div>

                    {/* Affiliations */}
                    <div className="info-section">
                        <h3 className="info-section-title">
                        <span className="icon">🏥</span> Affiliations
                                                                                                                                                                            </h3>
                        <div className="info-fields">
                            <div className="affiliation-section">
                                <h3 className="affiliation-title" style={{color:'rgb(43, 198, 182)'}}>🏥 Hospital</h3>
                                <p className="affiliation-text">
                                    {doctorData.hospital || 'N/A'}
                                </p>
                            </div>
                            <div className="affiliation-section">
                                <h3 className="affiliation-title" style={{color:'rgb(43, 198, 182)'}}>🏢 Clinic</h3>
                                <p className="affiliation-text">
                                    {doctorData.clinic || 'N/A'}
                                </p>
                            </div>
                        </div>
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
                                            <p className={`home-visit-indicator ${dayData.home_visit_available ? 'available' : 'not-available'}`}>
                                                {dayData.home_visit_available ? '🏠 Home visits available' : '🏠 Not available'}
                                            </p>
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
                    <button 
                        className="book-appointment-btn"
                        onClick={() => handleBookingClick('schedule')}
                    >
                    {isGuest ? '📅 Sign Up to Book Appointment' : '📅 Book Appointment'}
                    </button>
                    <button
                        className="book-home-visit-btn"
                        onClick={() => handleBookingClick('home')}
                        disabled={!isHomeVisitAvailable()}
                    >
                    {isGuest ? '🏠 Sign Up for Home Visit' : '🏠 Book Home Visit'}
                    </button>
                </div>
            </div>
            <div className="mini-footer">
                <FooterMinimal />
            </div>
        </div>
    );
}

export default DoctorProfileViewer;