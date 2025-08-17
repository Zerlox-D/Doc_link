import React, { useState } from 'react';
import '../css/AdminDashboardStyle.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const dashboardStats = {
    totalDoctors: 156,
    pendingApprovals: 8,
    totalPatients: 2847,
    activeAppointments: 94,
    homeVisitsToday: 23,
    totalRevenue: 8600,
    pendingReviews: 12,
    systemAlerts: 3
  };

  const pendingDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', submittedDate: '2024-08-14', license: 'MED987654321' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatology', submittedDate: '2024-08-13', license: 'MED876543210' },
    { id: 3, name: 'Dr. Priya Sharma', specialty: 'Pediatrics', submittedDate: '2024-08-12', license: 'MED765432109' },
    { id: 4, name: 'Dr. Robert Williams', specialty: 'Orthopedics', submittedDate: '2024-08-11', license: 'MED654321098' }
  ];

  const recentAppointments = [
    { id: 1, patient: 'Rahul Kumar', doctor: 'Dr. John Smith', date: '2024-08-16', time: '10:00 AM', type: 'Clinic', status: 'Confirmed' },
    { id: 2, patient: 'Ananya Patel', doctor: 'Dr. Lisa Wong', date: '2024-08-16', time: '2:30 PM', type: 'Home Visit', status: 'In Progress' },
    { id: 3, patient: 'Mohammed Ali', doctor: 'Dr. James Brown', date: '2024-08-16', time: '4:00 PM', type: 'Clinic', status: 'Completed' },
    { id: 4, patient: 'Sneha Reddy', doctor: 'Dr. Emily Davis', date: '2024-08-17', time: '9:00 AM', type: 'Home Visit', status: 'Scheduled' }
  ];

  const activeHomeVisits = [
    { id: 1, doctor: 'Dr. Lisa Wong', patient: 'Ananya Patel', address: '123 MG Road, Bangalore', status: 'En Route', eta: '15 mins' },
    { id: 2, doctor: 'Dr. Mark Wilson', patient: 'Suresh Kumar', address: '456 Park Street, Mumbai', status: 'Arrived', eta: 'On Site' },
    { id: 3, doctor: 'Dr. Kavya Nair', patient: 'Ravi Shankar', address: '789 Lake View, Chennai', status: 'Scheduled', eta: '45 mins' }
  ];

  const recentReviews = [
    { id: 1, patient: 'Rahul Kumar', doctor: 'Dr. John Smith', rating: 5, comment: 'Excellent service and very professional', date: '2024-08-15', status: 'Approved' },
    { id: 2, patient: 'Priya Singh', doctor: 'Dr. Sarah Ahmed', rating: 4, comment: 'Good consultation, helped with my concerns', date: '2024-08-14', status: 'Pending' },
    { id: 3, patient: 'Mohammed Ali', doctor: 'Dr. James Brown', rating: 2, comment: 'Long waiting time, not satisfied', date: '2024-08-14', status: 'Flagged' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Server response time increased by 20%', time: '10 mins ago' },
    { id: 2, type: 'info', message: 'New doctor registration from Kerala region', time: '25 mins ago' },
    { id: 3, type: 'error', message: 'Payment gateway timeout reported', time: '1 hour ago' }
  ];

  const handleDoctorAction = (doctorId, action) => {
    console.log(`${action} doctor with ID: ${doctorId}`);
  };

  const handleReviewAction = (reviewId, action) => {
    console.log(`${action} review with ID: ${reviewId}`);
  };

  const TabButton = ({ tabId, label, icon, isActive, onClick }) => (
    <button 
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(tabId)}
    >
      <span className="tab-icon">{icon}</span>
      <span className="tab-label">{label}</span>
    </button>
  );

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-dashboard-container">
      
      <header className="admin-header">
        <div className="header-left">
          <span className="admin-logo">Doc.link</span>
          <span className="admin-title">Admin Dashboard</span>
        </div>
        <div className="header-right">
          <div className="admin-profile">
            <span className="admin-name">Admin Panel</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        
        <nav className="dashboard-nav">
          <TabButton 
            tabId="overview" 
            label="Overview" 
            icon="📊" 
            isActive={activeTab === 'overview'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tabId="doctors" 
            label="Doctor Management" 
            icon="👨‍⚕️" 
            isActive={activeTab === 'doctors'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tabId="appointments" 
            label="Appointments" 
            icon="📅" 
            isActive={activeTab === 'appointments'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tabId="homevisits" 
            label="Home Visits" 
            icon="🏠" 
            isActive={activeTab === 'homevisits'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            tabId="reviews" 
            label="Reviews" 
            icon="⭐" 
            isActive={activeTab === 'reviews'} 
            onClick={setActiveTab} 
          />
        </nav>

        <main className="dashboard-main">
          
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2 className="tab-title">System Overview</h2>
              
              <div className="stats-grid">
                <div className="stat-card doctors-card">
                  <div className="stat-header">
                    <span className="stat-icon">👨‍⚕️</span>
                    <span className="stat-title">Doctors</span>
                  </div>
                  <div className="stat-value">{dashboardStats.totalDoctors}</div>
                  <div className="stat-subtitle">
                    {dashboardStats.pendingApprovals} pending approval
                  </div>
                </div>
                
                <div className="stat-card patients-card">
                  <div className="stat-header">
                    <span className="stat-icon">👥</span>
                    <span className="stat-title">Patients</span>
                  </div>
                  <div className="stat-value">{dashboardStats.totalPatients}</div>
                  <div className="stat-subtitle">Registered users</div>
                </div>
                
                <div className="stat-card appointments-card">
                  <div className="stat-header">
                    <span className="stat-icon">📅</span>
                    <span className="stat-title">Appointments</span>
                  </div>
                  <div className="stat-value">{dashboardStats.activeAppointments}</div>
                  <div className="stat-subtitle">Active today</div>
                </div>
                
                <div className="stat-card homevisits-card">
                  <div className="stat-header">
                    <span className="stat-icon">🏠</span>
                    <span className="stat-title">Home Visits</span>
                  </div>
                  <div className="stat-value">{dashboardStats.homeVisitsToday}</div>
                  <div className="stat-subtitle">Scheduled today</div>
                </div>
                
                <div className="stat-card revenue-card">
                  <div className="stat-header">
                    <span className="stat-icon">💰</span>
                    <span className="stat-title">Revenue</span>
                  </div>
                  <div className="stat-value">₹{dashboardStats.totalRevenue.toLocaleString()}</div>
                  <div className="stat-subtitle">This month</div>
                </div>
                
                <div className="stat-card alerts-card">
                  <div className="stat-header">
                    <span className="stat-icon">⚠️</span>
                    <span className="stat-title">Alerts</span>
                  </div>
                  <div className="stat-value">{dashboardStats.systemAlerts}</div>
                  <div className="stat-subtitle">Require attention</div>
                </div>
              </div>

              <div className="activity-section">
                <h3>Recent Activity</h3>
                <div className="activity-cards">
                  <div className="activity-card">
                    <h4>Recent Appointments</h4>
                    <div className="activity-list">
                      {recentAppointments.slice(0, 3).map(appointment => (
                        <div key={appointment.id} className="activity-item">
                          <span className="activity-text">
                            {appointment.patient} → {appointment.doctor}
                          </span>
                          <span className={`activity-status ${appointment.status.toLowerCase()}`}>
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="activity-card">
                    <h4>System Alerts</h4>
                    <div className="activity-list">
                      {systemAlerts.map(alert => (
                        <div key={alert.id} className="activity-item">
                          <span className={`alert-type ${alert.type}`}>
                            {alert.type === 'error' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                          </span>
                          <span className="activity-text">{alert.message}</span>
                          <span className="activity-time">{alert.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="tab-title">Doctor Management</h2>
                <div className="section-actions">
                  <button className="action-btn primary">Add New Doctor</button>
                  <button className="action-btn secondary">Export List</button>
                </div>
              </div>
              
              <div className="pending-approvals">
                <h3>Pending Doctor Approvals ({pendingDoctors.length})</h3>
                <div className="doctors-table">
                  <div className="table-header">
                    <span>Doctor Name</span>
                    <span>Specialty</span>
                    <span>License Number</span>
                    <span>Submitted Date</span>
                    <span>Actions</span>
                  </div>
                  {pendingDoctors.map(doctor => (
                    <div key={doctor.id} className="table-row">
                      <span className="doctor-name">{doctor.name}</span>
                      <span className="doctor-specialty">{doctor.specialty}</span>
                      <span className="doctor-license">{doctor.license}</span>
                      <span className="doctor-date">{doctor.submittedDate}</span>
                      <div className="doctor-actions">
                        <button 
                          className="approve-btn"
                          onClick={() => handleDoctorAction(doctor.id, 'approve')}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleDoctorAction(doctor.id, 'reject')}
                        >
                          ✗ Reject
                        </button>
                        <button className="view-btn">👁️ View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="tab-title">Appointment Management</h2>
              </div>
              
              <div className="appointments-table">
                <div className="table-header">
                  <span>Patient</span>
                  <span>Doctor</span>
                  <span>Date & Time</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {recentAppointments.map(appointment => (
                  <div key={appointment.id} className="table-row">
                    <span className="patient-name">{appointment.patient}</span>
                    <span className="doctor-name">{appointment.doctor}</span>
                    <span className="appointment-time">{appointment.date} at {appointment.time}</span>
                    <span className={`appointment-type ${appointment.type.toLowerCase().replace(' ', '-')}`}>
                      {appointment.type}
                    </span>
                    <span className={`appointment-status ${appointment.status.toLowerCase().replace(' ', '-')}`}>
                      {appointment.status}
                    </span>
                    <div className="appointment-actions">
                      <button className="edit-btn">✏️ Edit</button>
                      <button className="cancel-btn">❌ Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'homevisits' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="tab-title">Home Visit Tracking</h2>
                <div className="homevisit-stats">
                  <span className="stat-pill">Active: {activeHomeVisits.length}</span>
                  <span className="stat-pill">Today: {dashboardStats.homeVisitsToday}</span>
                </div>
              </div>
              
              <div className="homevisits-grid">
                {activeHomeVisits.map(visit => (
                  <div key={visit.id} className="homevisit-card">
                    <div className="visit-header">
                      <h4>{visit.doctor}</h4>
                      <span className={`visit-status ${visit.status.toLowerCase().replace(' ', '-')}`}>
                        {visit.status}
                      </span>
                    </div>
                    <div className="visit-details">
                      <p><strong>Patient:</strong> {visit.patient}</p>
                      <p><strong>Address:</strong> {visit.address}</p>
                      <p><strong>ETA:</strong> {visit.eta}</p>
                    </div>
                    <div className="visit-actions">
                      <button className="track-btn">📍 Track Location</button>
                      <button className="contact-btn">📞 Contact Doctor</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="tab-title">Review Management</h2>
              </div>
              
              <div className="reviews-list">
                {recentReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-info">
                        <h4>{review.patient}</h4>
                        <span className="review-doctor">for {review.doctor}</span>
                        <div className="review-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                        </div>
                      </div>
                      <div className="review-meta">
                        <span className="review-date">{review.date}</span>
                        <span className={`review-status ${review.status.toLowerCase()}`}>
                          {review.status}
                        </span>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => handleReviewAction(review.id, 'approve')}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="flag-btn"
                        onClick={() => handleReviewAction(review.id, 'flag')}
                      >
                        🚩 Flag
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleReviewAction(review.id, 'delete')}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;