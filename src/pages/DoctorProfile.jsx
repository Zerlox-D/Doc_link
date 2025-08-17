import React, { useState } from 'react';
import '../css/DoctorProfileStyle.css';

function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState({
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
    
    totalPatients: 1247,
    thisMonthPatients: 89,
    upcomingAppointments: 12,
    
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
    }
  });

  const [editData, setEditData] = useState({...doctorData});

  const specializationOptions = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Gynecology', 'Ophthalmology', 'ENT',
    'Gastroenterology', 'Endocrinology', 'Oncology', 'Pulmonology', 'Radiology',
    'Anesthesiology', 'Physiotherapy', 'Family Medicine', 'Internal Medicine',
    'Pathology', 'Urology', 'Plastic Surgery', 'Other'
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({...doctorData});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({...doctorData});
  };

  const handleSave = () => {
    setDoctorData({...editData});
    setIsEditing(false);
    console.log('Saving doctor data:', editData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecializationChange = (specialization) => {
    setEditData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleTimingChange = (day, field, value) => {
    setEditData(prev => ({
      ...prev,
      availableTimings: {
        ...prev.availableTimings,
        [day]: {
          ...prev.availableTimings[day],
          [field]: value
        }
      }
    }));
  };

  const handleFeeChange = (feeType, value) => {
    setEditData(prev => ({
      ...prev,
      consultationFees: {
        ...prev.consultationFees,
        [feeType]: value
      }
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="doctor-profile-container">
    
      <header className="doctor-profile-header">
        <span className="header-logo">
          Doc.link
        </span>
        <div className="header-user-info">
          <span className="welcome-text">
            Welcome, Dr. {doctorData.firstName} {doctorData.lastName}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="profile-content">
        
        <div className="statistics-section">
          <h2 className="section-heading">Practice Overview</h2>
          <div className="stats-grid">
            <div className="stat-card total-patients">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{doctorData.totalPatients}</h3>
                <p>Total Patients</p>
              </div>
            </div>
            <div className="stat-card month-patients">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{doctorData.thisMonthPatients}</h3>
                <p>This Month</p>
              </div>
            </div>
            <div className="stat-card upcoming-appointments">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <h3>{doctorData.upcomingAppointments}</h3>
                <p>Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">
                <span>👨‍⚕️</span>
              </div>
              <div className="profile-details">
                <h1>
                  Dr. {doctorData.firstName} {doctorData.lastName}
                </h1>
                <p className="specializations-text">
                  {doctorData.specializations.join(', ')}
                </p>
                <p className="experience-text">
                  Experience: {doctorData.yearsOfExperience} years
                </p>
              </div>
            </div>
            
            {!isEditing ? (
              <button className="edit-btn" onClick={handleEdit}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  ✓ Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  ✗ Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-grid">
            
            <div className="info-section">
              <h3>Personal Information</h3>
              
              <div className="info-fields">
                <div className="field-group">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-display">
                      {doctorData.email}
                    </p>
                  )}
                </div>

                <div className="field-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-display">
                      {doctorData.phone}
                    </p>
                  )}
                </div>

                <div className="field-group">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editData.dateOfBirth}
                      onChange={handleChange}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-display birth-date-display">
                      {new Date(doctorData.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="field-group">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleChange}
                      className="field-select"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="field-display gender-display">
                      {doctorData.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Professional Information</h3>
              
              <div className="info-fields">
                <div className="field-group">
                  <label>Medical License Number</label>
                  <p className="field-display license-display">
                    {doctorData.licenseNumber}
                  </p>
                </div>

                <div className="field-group">
                  <label>Specializations</label>
                  {isEditing ? (
                    <div className="specialization-edit">
                      {specializationOptions.map((spec) => (
                        <label key={spec} className="specialization-option">
                          <input
                            type="checkbox"
                            checked={editData.specializations.includes(spec)}
                            onChange={() => handleSpecializationChange(spec)}
                          />
                          {spec}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="specialization-tags">
                      {doctorData.specializations.map((spec, index) => (
                        <span key={index} className="specialization-tag">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label>Years of Experience</label>
                  {isEditing ? (
                    <select
                      name="yearsOfExperience"
                      value={editData.yearsOfExperience}
                      onChange={handleChange}
                      className="field-select"
                    >
                      <option value="0-1">0-1 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16-20">16-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  ) : (
                    <p className="field-display">
                      {doctorData.yearsOfExperience} years
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="timings-section">
            <div className="section-header">
              <h3>Available Timings</h3>
              {isEditing && <p className="edit-hint">Set your available hours for each day</p>}
            </div>
            <div className="timings-grid">
              {Object.entries(doctorData.availableTimings).map(([day, timing]) => (
                <div key={day} className="timing-row">
                  <div className="day-name">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  <div className="timing-controls">
                    {isEditing ? (
                      <>
                        <input
                          type="checkbox"
                          checked={editData.availableTimings[day].isAvailable}
                          onChange={(e) => handleTimingChange(day, 'isAvailable', e.target.checked)}
                          className="timing-checkbox"
                        />
                        <span className="available-label">Available</span>
                        {editData.availableTimings[day].isAvailable && (
                          <>
                            <input
                              type="time"
                              value={editData.availableTimings[day].startTime}
                              onChange={(e) => handleTimingChange(day, 'startTime', e.target.value)}
                              className="time-input"
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={editData.availableTimings[day].endTime}
                              onChange={(e) => handleTimingChange(day, 'endTime', e.target.value)}
                              className="time-input"
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <div className={`timing-display ${timing.isAvailable ? 'available' : 'unavailable'}`}>
                        {timing.isAvailable 
                          ? `${timing.startTime} - ${timing.endTime}`
                          : 'Not Available'
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fees-section">
            <div className="section-header">
              <h3>Consultation Fees</h3>
              {isEditing && <p className="edit-hint">Set your consultation charges</p>}
            </div>
            <div className="fees-grid">
              <div className="fee-item">
                <div className="fee-label">
                  <span className="fee-icon">🏥</span>
                  <span>Direct Appointment</span>
                </div>
                <div className="fee-value">
                  {isEditing ? (
                    <div className="fee-input-group">
                      <span className="currency">₹</span>
                      <input
                        type="number"
                        value={editData.consultationFees.directAppointment}
                        onChange={(e) => handleFeeChange('directAppointment', parseInt(e.target.value) || 0)}
                        className="fee-input"
                        min="0"
                      />
                    </div>
                  ) : (
                    <span className="fee-amount">₹{doctorData.consultationFees.directAppointment}</span>
                  )}
                </div>
              </div>
              <div className="fee-item">
                <div className="fee-label">
                  <span className="fee-icon">🏠</span>
                  <span>Home Visit</span>
                </div>
                <div className="fee-value">
                  {isEditing ? (
                    <div className="fee-input-group">
                      <span className="currency">₹</span>
                      <input
                        type="number"
                        value={editData.consultationFees.homeVisit}
                        onChange={(e) => handleFeeChange('homeVisit', parseInt(e.target.value) || 0)}
                        className="fee-input"
                        min="0"
                      />
                    </div>
                  ) : (
                    <span className="fee-amount">₹{doctorData.consultationFees.homeVisit}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="affiliations-section">
            <div className="affiliations-grid">
              <div className="affiliation-section">
                <h4>Hospital Affiliations</h4>
                {isEditing ? (
                  <textarea
                    name="hospitals"
                    value={editData.hospitals}
                    onChange={handleChange}
                    rows={3}
                    className="affiliation-textarea"
                  />
                ) : (
                  <p className="affiliation-display">
                    {doctorData.hospitals || 'No hospital affiliations'}
                  </p>
                )}
              </div>

              <div className="affiliation-section">
                <h4>Clinic Affiliations</h4>
                {isEditing ? (
                  <textarea
                    name="clinics"
                    value={editData.clinics}
                    onChange={handleChange}
                    rows={3}
                    className="affiliation-textarea"
                  />
                ) : (
                  <p className="affiliation-display">
                    {doctorData.clinics || 'No clinic affiliations'}
                  </p>
                )}
              </div>
            </div>

            <div className="home-visit-section">
              <h4>Home Visit Availability</h4>
              {isEditing ? (
                <div className="home-visit-options">
                  <label className="home-visit-option">
                    <input
                      type="radio"
                      name="homeVisitAvailability"
                      value="yes"
                      checked={editData.homeVisitAvailability === 'yes'}
                      onChange={handleChange}
                    />
                    Yes, I provide home visits
                  </label>
                  <label className="home-visit-option">
                    <input
                      type="radio"
                      name="homeVisitAvailability"
                      value="no"
                      checked={editData.homeVisitAvailability === 'no'}
                      onChange={handleChange}
                    />
                    No, clinic appointments only
                  </label>
                </div>
              ) : (
                <div className={`availability-status ${doctorData.homeVisitAvailability === 'yes' ? 'available-status' : 'unavailable-status'}`}>
                  {doctorData.homeVisitAvailability === 'yes' ? '✓ Available for Home Visits' : '✗ Clinic Only'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;