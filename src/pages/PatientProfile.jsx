import React, { useEffect, useState, useMemo } from "react";
import "../css/PatientProfileStyle.css";
import PaymentGateway from "../components/PaymentGateway";
import PrescriptionView from "../components/PrescriptionView";
import { useNavigate, useSearchParams } from "react-router-dom";
import FooterMinimal from "../components/FooterMinimal";
import SubmitReview from "../components/Review";

export default function PatientProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  // Prescription View Modal
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionView, setShowPrescriptionView] = useState(false);

  // Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const openReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRating(0);
    setReviewText("");
    setShowReviewModal(true);
  }

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setRating(0);
    setReviewText("");
    setSelectedAppointment(null);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    const patientId = localStorage.getItem("patient_id");
    setSubmittingReview(true);

    fetch("http://doc-link.kesug.com/php/SubmitReview.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: selectedAppointment.appointment_id,
        patient_id: parseInt(patientId),
        doctor_id: selectedAppointment.doctor_id,
        rating: rating,
        review_text: reviewText
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmittingReview(false);
        if (data.success) {
          alert("Review submitted successfully!");
          closeReviewModal();
          // Refresh appointments to show review button is no longer needed
          loadProfile();
        } else {
          alert(data.error || "Failed to submit review. Please try again.");
        }
      })
      .catch(err => {
        setSubmittingReview(false);
        console.error(err);
        alert("An error occurred while submitting the review.");
      });
  }
  
  // Patient data
  const [patient, setPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState({});

  // Appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [declinedAppointments, setDeclinedAppointments] = useState([]);

  const patientId = useMemo(() => localStorage.getItem("patient_id"), []);

  useEffect(() => {
    // Check if tab parameter is passed in URL
    const tab = searchParams.get("tab");
    if (tab === "appointments") {
      setActiveTab("appointments");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!patientId) {
      setErr("No patient session found. Please log in again.");
      setLoading(false);
      return;
    }
    fetchPrescriptions();
    loadProfile();
  }, [patientId]);

useEffect(() => {
  const hash = window.location.hash.replace('#', '');
  
  if (hash === 'medical-records') {
    // Switch to appointments tab
    setActiveTab('appointments');
    
    // Wait even longer and use multiple scroll attempts
    setTimeout(() => {
      const element = document.getElementById(hash);
      
      if (element) {
        // Try method 1: scrollIntoView
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Try method 2: Manual scroll calculation (backup)
        setTimeout(() => {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // scrolled to position (no-log in production)
        }, 200);
      }
    }, 800); // Even longer delay - 800ms
  }
}, [window.location.hash, activeTab]);


  const loadProfile = async () => {
    try {
      setLoading(true);
      setErr("");

      // Fetch patient data
      const patientRes = await fetch(`http://doc-link.kesug.com/php/GetPatient.php?patient_id=${patientId}`);
      const patientData = await patientRes.json();
      if (patientData?.error) throw new Error(patientData.error);
      setPatient(patientData);
      setEditedPatient(patientData);

      const appointmentsRes = await fetch(`http://doc-link.kesug.com/php/GetPatientAppointments.php?patient_id=${patientId}`);
      const appointmentsData = await appointmentsRes.json();

      const appointments = appointmentsData.success ? appointmentsData.appointments : [];
      
      const now = new Date();
      const upcoming = [];
      const past = [];
      const declined = appointments.filter(appt => appt.status === 'declined');

      appointments.forEach(appt => {
        const apptDateTime = new Date(`${appt.appointment_date} ${appt.appointment_time}`);
        if (apptDateTime >= now && appt.status === 'confirmed') {
          upcoming.push(appt);
        } else if (apptDateTime < now && appt.status === 'confirmed') {
          past.push(appt);
        }
      });

      upcoming.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
      return dateA - dateB;
});

      past.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
      return dateB - dateA;
});

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setDeclinedAppointments(declined);
    } catch (e) {
      setErr(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
  try {
    const response = await fetch(
      `http://doc-link.kesug.com/php/GetPatientPrescriptions.php?patient_id=${patientId}`
    );
    const data = await response.json();
    if (data.success) {
      setPrescriptions(data.prescriptions);
    }
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
  }
};


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditedPatient(patient);
    }
    setEditMode(!editMode);
  };

  const handlePatientChange = (field, value) => {
    setEditedPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://doc-link.kesug.com/php/UpdatePatientProfile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          first_name: editedPatient.first_name,
          last_name: editedPatient.last_name,
          email: editedPatient.email,
          phone_no: editedPatient.phone_no,
          city: editedPatient.city,
          dob: editedPatient.dob,
          gender: editedPatient.gender
        })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to update profile");

      alert("Profile updated successfully!");
      setEditMode(false);
      loadProfile();
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const response = await fetch('http://doc-link.kesug.com/php/CancelAppointment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to cancel appointment");

      alert("Appointment cancelled successfully!");
      loadProfile();
    } catch (e) {
      alert("Error cancelling appointment: " + e.message);
    }
  };

  const handleDismissDeclined = async (appointmentId) => {
    try {
      const response = await fetch('http://doc-link.kesug.com/php/DismissDeclinedAppointment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
    
      // Remove from local state
      setDeclinedAppointments(prev => prev.filter(appt => appt.appointment_id !== appointmentId));
    } catch (e) {
      alert('Error dismissing notification: ' + e.message);
    }
  };

  const handlePayment = (appointment) => {
  setSelectedAppointment(appointment);
  setShowPaymentModal(true);
};

const handlePaymentSuccess = () => {
  setShowPaymentModal(false);
  fetchAppointments();
};

  const fullName = useMemo(() => {
    if (!patient) return "";
    return `${patient.first_name} ${patient.last_name}`;
  }, [patient]);

  if (loading) {
    return (
      <div className="pp-container">
        <header className="pp-header"><div className="pp-logo">Doc.link</div></header>
        <div className="pp-loading">Loading profile...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="pp-container">
        <header className="pp-header"><div className="pp-logo">Doc.link</div></header>
        <div className="pp-error">{err}</div>
      </div>
    );
  }

  return (
    <div className="pp-container">
      {showPaymentModal && selectedAppointment && (
      <PaymentGateway
        appointment={selectedAppointment}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaymentModal(false)}
      />
    )}
      {/* Header */}
      <header className="pp-header">
        <div className="pp-header-left">
          <div className="pp-logo">Doc.link</div>
          <span className="pp-greeting">Hello, {fullName}!</span>
        </div>
        <div className="pp-header-right">
          <button className="pp-back-btn" onClick={() => navigate('/home')}>← Back</button>
          <button className="pp-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pp-content">
        {/* Tab Navigation */}
        <div className="pp-tabs">
          <button 
            className={`pp-tab ${activeTab === 'profile' ? 'pp-tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 My Profile
          </button>
          <button 
            className={`pp-tab ${activeTab === 'appointments' ? 'pp-tab-active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📋 My Appointments
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="pp-tab-content">
            <div className="pp-action-bar">
              {!editMode ? (
                <button className="pp-edit-btn" onClick={handleEditToggle}>✏️ Edit Profile</button>
              ) : (
                <>
                  <button className="pp-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "💾 Save Changes"}
                  </button>
                  <button className="pp-cancel-btn" onClick={handleEditToggle} disabled={saving}>
                    ✖ Cancel
                  </button>
                </>
              )}
            </div>

            <section className="pp-card">
              <div className="pp-profile-header">
                <div className="pp-avatar">👤</div>
                <div>
                  <h1 className="pp-title">{fullName}</h1>
                  <p className="pp-subtitle">Patient ID: {patient.patient_id}</p>
                </div>
              </div>

              <div className="pp-info-grid">
                <div className="pp-info-section">
                  <h3>Personal Information</h3>
                  <div className="pp-info-fields">
                    <div className="pp-field-group">
                      <label>First Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editedPatient.first_name}
                          onChange={(e) => handlePatientChange('first_name', e.target.value)}
                          className="pp-input"
                        />
                      ) : (
                        <p className="pp-field-display">{patient.first_name}</p>
                      )}
                    </div>

                    <div className="pp-field-group">
                      <label>Last Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editedPatient.last_name}
                          onChange={(e) => handlePatientChange('last_name', e.target.value)}
                          className="pp-input"
                        />
                      ) : (
                        <p className="pp-field-display">{patient.last_name}</p>
                      )}
                    </div>

                    <div className="pp-field-group">
                      <label>Date of Birth</label>
                      {editMode ? (
                        <input
                          type="date"
                          value={editedPatient.dob}
                          onChange={(e) => handlePatientChange('dob', e.target.value)}
                          className="pp-input"
                        />
                      ) : (
                        <p className="pp-field-display">{patient.dob}</p>
                      )}
                    </div>

                    <div className="pp-field-group">
                      <label>Gender</label>
                      {editMode ? (
                        <select
                          value={editedPatient.gender}
                          onChange={(e) => handlePatientChange('gender', e.target.value)}
                          className="pp-input"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="pp-field-display">{patient.gender}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pp-info-section">
                  <h3>Contact Information</h3>
                  <div className="pp-info-fields">
                    <div className="pp-field-group">
                      <label>Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          value={editedPatient.email}
                          onChange={(e) => handlePatientChange('email', e.target.value)}
                          className="pp-input"
                        />
                      ) : (
                        <p className="pp-field-display">{patient.email}</p>
                      )}
                    </div>

                    <div className="pp-field-group">
                      <label>Phone Number</label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={editedPatient.phone_no}
                          onChange={(e) => handlePatientChange('phone_no', e.target.value)}
                          className="pp-input"
                        />
                      ) : (
                        <p className="pp-field-display">{patient.phone_no}</p>
                      )}
                    </div>

                    <div className="pp-field-group">
                      <label>City</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editedPatient.city}
                          onChange={(e) => handlePatientChange('city', e.target.value)}
                          className="pp-input"
                        />
                      ) : (
                        <p className="pp-field-display">{patient.city}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="pp-tab-content">
            {/* Upcoming Appointments */}
            <section className="pp-card">
              <h2 className="pp-section-title">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <div className="pp-empty">No upcoming appointments.</div>
              ) : (
                <div className="pp-appointments">
                  {upcomingAppointments.map((appt) => (
                    <div key={appt.appointment_id} className="pp-appt-card">
                      <div className="pp-appt-header">
                        <div>
                          <h4 className="pp-appt-doctor">Dr. {appt.doctor_name}</h4>
                          <p className="pp-appt-specialty">{appt.specialty}</p>
                        </div>
                        {appt.status === 'confirmed' && !appt.payment_id && (
                        <>
                        <p style={{color: '#059669', fontWeight: 700, marginTop: '10px'}}>
                          💰 Amount: ₹{appt.fee}
                        </p>
                        <button 
                        onClick={() => handlePayment(appt)}
                        style={{
                        marginTop: '10px',
                        padding: '10px 20px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      >
                      Pay Now ₹{appt.fee}
                      </button>
                </>
              )}

              {appt.payment_id && (
  <div style={{marginTop: '10px'}}>
    <p style={{color: '#059669', fontWeight: 600, marginBottom: '8px'}}>
      ✅ Payment Completed
    </p>
    {appt.invoice_number && (
      <a 
        href={`http://doc-link.kesug.com/php/GenerateInvoice.php?invoice_number=${appt.invoice_number}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: '#059669',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600
        }}
      >
        📄 Download Invoice
      </a>
    )}
  </div>
)}

                        <button 
                          className="pp-cancel-appt-btn"
                          onClick={() => handleCancelAppointment(appt.appointment_id)}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="pp-appt-details">
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Patient:</span>
                          <span>{appt.patient_name}</span>
                        </div>
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Date:</span>
                          <span>{appt.appointment_date}</span>
                        </div>
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Time:</span>
                          <span>{appt.appointment_time}</span>
                        </div>
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Mode:</span>
                          <span>{appt.mode_of_booking}</span>
                        </div>
                        {appt.booking_reason && (
                          <div className="pp-appt-info">
                            <span className="pp-appt-label">Reason:</span>
                            <span>{appt.booking_reason}</span>
                          </div>
                        )}
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past Appointments */}
            <section className="pp-card">
              <h2 className="pp-section-title">Past Appointments</h2>
              {pastAppointments.length === 0 ? (
                <div className="pp-empty">No past appointments.</div>
              ) : (
                <div className="pp-appointments">
                  {pastAppointments.map((appt) => (
                    <div key={appt.appointment_id} className="pp-appt-card pp-appt-past">
                      <div className="pp-appt-header">
                        <div>
                          <h4 className="pp-appt-doctor">Dr. {appt.doctor_name}</h4>
                          <p className="pp-appt-specialty">{appt.specialty}</p>
                        </div>
                      </div>
                      <div className="pp-appt-details">
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Patient:</span>
                          <span>{appt.patient_name}</span>
                        </div>
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Date:</span>
                          <span>{appt.appointment_date}</span>
                        </div>
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Time:</span>
                          <span>{appt.appointment_time}</span>
                        </div>
                        <div className="pp-appt-info">
                          <span className="pp-appt-label">Mode:</span>
                          <span>{appt.mode_of_booking}</span>
                        </div>
                      </div>
                      {!appt.has_reviewed && (
                      <button 
                        className="pp-review-btn" onClick={() => openReviewModal(appt)}>
                        ⭐ Review this visit
                      </button>
                      )}
                      {appt.has_reviewed && (
                      <div 
                        className="pp-already-reviewed">
                        ✅ Already Reviewed
                      </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Medical Records Section */}
<section id="medical-records" className="pp-card">
  <h2 className="pp-section-title">Medical Records</h2>
  {prescriptions.length === 0 ? (
    <p className="pp-empty">No prescriptions yet</p>
  ) : (
    <div className="pp-prescriptions-list">
      {prescriptions.map(prescription => (
        <div key={prescription.prescription_id} className="pp-appt-card pp-prescription-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
            <div>
              <h4 className="pp-appt-doctor">Dr. {prescription.doctor_name}</h4>
              <p className="pp-appt-specialty">{prescription.specialty}</p>
              <p style={{color: '#6b7280', fontSize: '14px', marginTop: '5px'}}>
                📅 Prescribed on: {new Date(prescription.prescription_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p style={{color: '#1f2937', fontWeight: 600, marginTop: '8px'}}>
                Diagnosis: {prescription.diagnosis}
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
            <button 
              onClick={() => {
                setSelectedPrescription(prescription);
                setShowPrescriptionView(true);
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              👁️ View Details
            </button>
            
            <a 
              href={`http://doc-link.kesug.com/php/GeneratePrescriptionPDF.php?prescription_id=${prescription.prescription_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '10px',
                background: '#059669',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              📥 Download PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  )}
</section>


            {/* Declined Notifications */}
            {declinedAppointments.length > 0 && (
            <div className="pp-notification-banner">
              <h3>⚠️ Appointment Declined</h3>
              <p>The following appointment request(s) were declined by the doctor:</p>
              {declinedAppointments.map(appt => (
              <div key={appt.appointment_id} className="pp-declined-notice">
                <div>
                  <strong>Dr. {appt.doctor_name}</strong> - {appt.appointment_date} at {appt.appointment_time}
                </div>
                <button 
                  className="pp-dismiss-btn"
                  onClick={() => handleDismissDeclined(appt.appointment_id)}
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
          </div>
        )}

        {/* Prescription View Modal */}
{showPrescriptionView && selectedPrescription && (
  <PrescriptionView
    prescription={selectedPrescription}
    onClose={() => {
      setShowPrescriptionView(false);
      setSelectedPrescription(null);
    }}
  />
)}
      {/* Review Modal */}
      {showReviewModal && (
        <div className="pp-modal-overlay" onClick={closeReviewModal}>
          <div className="pp-review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeReviewModal}>×</button>
          
          <div className="pp-modal-body">
            <p className="pp-doctor-name-modal">How would you rate Dr. {selectedAppointment?.doctor_name}?</p>
            <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
        
        <textarea
          className="pp-review-textarea"
          placeholder="Share your experience (optional)"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="4"
          maxLength="500"
        />
        
        <div className="pp-modal-footer">
          <button 
            className="pp-submit-review-btn"
            onClick={handleSubmitReview}
            disabled={submittingReview || rating === 0}
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
          </div>
          </div>
        </div>
      )}
      </main>

      <div className="mini-footer">
        <FooterMinimal />
      </div>
    </div>
  );
}
