import React from 'react';
import '../css/DocProfileViewStyle.css';

function DoctorProfileViewer() {
  const doctorData = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+91 9876543210',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    licenseNumber: 'MED123456789',
    specializations: ['Cardiology', 'Internal Medicine'],
    yearsOfExperience: '11-15',
    hospitals: 'City General Hospital, Metro Medical Center',
    clinics: 'Heart Care Clinic, Downtown Medical',
    homeVisitAvailability: 'yes',
    profilePic: null,
    
    availableTimings: {
      monday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      thursday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      friday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      saturday: { isAvailable: true, startTime: '09:00', endTime: '13:00' },
      sunday: { isAvailable: false, startTime: '09:00', endTime: '17:00' }
    },
    
    consultationFees: {
      directAppointment: 500,
      homeVisit: 800
    },
    
    rating: 4.5,
    totalReviews: 142,
    patientCount: 1247
  };

  const handleScheduleAppointment = () => {
    console.log('Navigating to appointment booking...');
    // Navigate to appointment booking page
  };

  const handleBookHomeVisit = () => {
    console.log('Navigating to home visit booking...');
    // Navigate to home visit booking page
  };

  return (
    <div className="patient-doctor-profile-container">
      
      <header className="patient-profile-header">
        <span className="header-logo">
          Doc.link
        </span>
        <div className="header-navigation">
          <div className="header-user-info">
            <span className="user-greeting">Welcome, Patient</span>
            <button className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="patient-profile-content">

        <div className="doctor-profile-card">
          
          {/* Doctor Header Info */}
          <div className="doctor-header">
            <div className="doctor-basic-info">
              <div className="doctor-avatar">
                <span>👨‍⚕️</span>
              </div>
              <div className="doctor-details">
                <h1>Dr. {doctorData.firstName} {doctorData.lastName}</h1>
                <p className="specializations-text">
                  {doctorData.specializations.join(', ')}
                </p>
                <p className="experience-text">
                  Experience: {doctorData.yearsOfExperience} years
                </p>
                <div className="rating-section">
                  <div className="rating-stars">
                    {'★'.repeat(Math.floor(doctorData.rating))}{'☆'.repeat(5-Math.floor(doctorData.rating))}
                  </div>
                  <span className="rating-text">
                    {doctorData.rating} ({doctorData.totalReviews} reviews)
                  </span>
                </div>
                <p className="patient-count">
                  👥 {doctorData.patientCount}+ patients treated
                </p>
              </div>
            </div>
            
            <div className="verification-badge">
              <div className="verified-icon">✓</div>
              <span>Verified Doctor</span>
            </div>
          </div>

          <div className="doctor-info-grid">
            
            {/* Contact Information */}
            <div className="info-section">
              <h3>Contact Information</h3>
              <div className="info-fields">
                <div className="field-group">
                  <label>📧 Email Address</label>
                  <p className="field-display">{doctorData.email}</p>
                </div>

                <div className="field-group">
                  <label>📞 Phone Number</label>
                  <p className="field-display">{doctorData.phone}</p>
                </div>

                <div className="field-group">
                  <label>🆔 Medical License</label>
                  <p className="field-display license-display">{doctorData.licenseNumber}</p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Professional Details</h3>
              <div className="info-fields">
                <div className="field-group">
                  <label>🎯 Specializations</label>
                  <div className="specialization-tags">
                    {doctorData.specializations.map((spec, index) => (
                      <span key={index} className="specialization-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="field-group">
                  <label>📅 Experience</label>
                  <p className="field-display">{doctorData.yearsOfExperience} years</p>
                </div>

                <div className="field-group">
                  <label>👤 Gender</label>
                  <p className="field-display gender-display">{doctorData.gender}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="timings-section">
            <div className="section-header">
              <h3>🕐 Available Timings</h3>
              <p className="timings-note">Doctor's weekly schedule</p>
            </div>
            <div className="timings-grid">
              {Object.entries(doctorData.availableTimings).map(([day, timing]) => (
                <div key={day} className="timing-row">
                  <div className="day-name">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  <div className="timing-display-container">
                    <div className={`timing-display ${timing.isAvailable ? 'available' : 'unavailable'}`}>
                      {timing.isAvailable 
                        ? `${timing.startTime} - ${timing.endTime}`
                        : 'Not Available'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fees-section">
            <div className="section-header">
              <h3>Consultation Fees</h3>
            </div>
            <div className="fees-grid">
              <div className="fee-item">
                <div className="fee-label">
                  <span className="fee-icon">🏥</span>
                  <span>Clinic Appointment</span>
                </div>
                <div className="fee-value">
                  <span className="fee-amount">₹{doctorData.consultationFees.directAppointment}</span>
                </div>
              </div>
              <div className="fee-item">
                <div className="fee-label">
                  <span className="fee-icon">🏠</span>
                  <span>Home Visit</span>
                </div>
                <div className="fee-value">
                  <span className="fee-amount">₹{doctorData.consultationFees.homeVisit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
          <button className="action-btn schedule-btn" onClick={handleScheduleAppointment}>
            Schedule Appointment
          </button>
          <button className="action-btn home-visit-btn" onClick={handleBookHomeVisit}>
            Book Home Visit
          </button>
        </div>

          {/* Hospital and Clinic Affiliations */}
          <div className="affiliations-section">
            <div className="affiliations-grid">
              <div className="affiliation-section">
                <h4>🏥 Hospital Affiliations</h4>
                <p className="affiliation-display">
                  {doctorData.hospitals || 'No hospital affiliations'}
                </p>
              </div>

              <div className="affiliation-section">
                <h4>🏢 Clinic Affiliations</h4>
                <p className="affiliation-display">
                  {doctorData.clinics || 'No clinic affiliations'}
                </p>
              </div>
            </div>

            {/* Home Visit Availability */}
            <div className="home-visit-section">
              <h4>🏠 Home Visit Service</h4>
              <div className={`availability-status ${doctorData.homeVisitAvailability === 'yes' ? 'available-status' : 'unavailable-status'}`}>
                {doctorData.homeVisitAvailability === 'yes' ? '✓ Available for Home Visits' : '✗ Clinic Only'}
              </div>
              {doctorData.homeVisitAvailability === 'yes' && (
                <p className="home-visit-note">
                  This doctor provides medical consultations at your home for your convenience.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="profile-footer">
            <p className="booking-note">
              🔒 Secure booking • 💳 Multiple payment options • 📞 24/7 support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileViewer;