import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboardStyle.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Statistics
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    pendingVerifications: 0
  });

  // Lists
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  
  // Selected doctor for detail view
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load statistics
      const statsResponse = await fetch('http://localhost/Doc_Link/php/GetAdminStats.php');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Load pending doctors
      const pendingResponse = await fetch('http://localhost/Doc_Link/php/GetPendingDoctors.php');
      const pendingData = await pendingResponse.json();
      if (pendingData.success) {
        setPendingDoctors(pendingData.doctors);
      }

      // Load all doctors
      const doctorsResponse = await fetch('http://localhost/Doc_Link/php/GetAllDoctors.php');
      const doctorsData = await doctorsResponse.json();
      if (doctorsData.success) {
        setAllDoctors(doctorsData.doctors);
      }

      // Load all patients
      const patientsResponse = await fetch('http://localhost/Doc_Link/php/GetAllPatients.php');
      const patientsData = await patientsResponse.json();
      if (patientsData.success) {
        setAllPatients(patientsData.patients);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost/Doc_Link/php/VerifyDoctor.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id: doctorId, action: action })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Doctor ${action === 'approve' ? 'verified' : 'rejected'} successfully!`);
        loadDashboardData(); // Reload data
        setSelectedDoctor(null);
      } else {
        alert('Action failed: ' + data.error);
      }
    } catch (error) {
      alert('Error processing request');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">Doc.link Admin</div>
        <div className="admin-header-right">
          <span className="admin-welcome">Welcome, Admin</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button 
          className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Verifications
          {pendingDoctors.length > 0 && (
            <span className="badge">{pendingDoctors.length}</span>
          )}
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          👨‍⚕️ All Doctors
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          👥 All Patients
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="admin-content">
            <h1 className="admin-page-title">Platform Overview</h1>
            
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card stat-blue">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalDoctors}</div>
                  <div className="stat-label">Total Doctors</div>
                </div>
              </div>

              <div className="stat-card stat-green">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalPatients}</div>
                  <div className="stat-label">Total Patients</div>
                </div>
              </div>

              <div className="stat-card stat-orange">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendingAppointments}</div>
                  <div className="stat-label">Pending Appointments</div>
                </div>
              </div>

              <div className="stat-card stat-purple">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.confirmedAppointments}</div>
                  <div className="stat-label">Confirmed Appointments</div>
                </div>
              </div>

              <div className="stat-card stat-teal">
                <div className="stat-icon">✔️</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.completedAppointments}</div>
                  <div className="stat-label">Completed Appointments</div>
                </div>
              </div>

              <div className="stat-card stat-red">
                <div className="stat-icon">🔔</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendingVerifications}</div>
                  <div className="stat-label">Pending Verifications</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <h2 className="section-title">Platform Statistics</h2>
              <div className="charts-grid">
                {/* Doctors vs Patients */}
                <div className="chart-card">
                  <h3>Users Distribution</h3>
                  <div className="bar-chart">
                    <div className="bar-item">
                      <div className="bar-label">Doctors</div>
                      <div className="bar-container">
                        <div 
                          className="bar bar-blue" 
                          style={{width: `${(stats.totalDoctors / (stats.totalDoctors + stats.totalPatients)) * 100}%`}}
                        ></div>
                      </div>
                      <div className="bar-value">{stats.totalDoctors}</div>
                    </div>
                    <div className="bar-item">
                      <div className="bar-label">Patients</div>
                      <div className="bar-container">
                        <div 
                          className="bar bar-green" 
                          style={{width: `${(stats.totalPatients / (stats.totalDoctors + stats.totalPatients)) * 100}%`}}
                        ></div>
                      </div>
                      <div className="bar-value">{stats.totalPatients}</div>
                    </div>
                  </div>
                </div>

                {/* Appointments Status */}
                <div className="chart-card">
                  <h3>Appointments Overview</h3>
                  <div className="bar-chart">
                    <div className="bar-item">
                      <div className="bar-label">Pending</div>
                      <div className="bar-container">
                        <div 
                          className="bar bar-orange" 
                          style={{width: `${stats.pendingAppointments > 0 ? (stats.pendingAppointments / 20) * 100 : 0}%`}}
                        ></div>
                      </div>
                      <div className="bar-value">{stats.pendingAppointments}</div>
                    </div>
                    <div className="bar-item">
                      <div className="bar-label">Confirmed</div>
                      <div className="bar-container">
                        <div 
                          className="bar bar-purple" 
                          style={{width: `${stats.confirmedAppointments > 0 ? (stats.confirmedAppointments / 20) * 100 : 0}%`}}
                        ></div>
                      </div>
                      <div className="bar-value">{stats.confirmedAppointments}</div>
                    </div>
                    <div className="bar-item">
                      <div className="bar-label">Completed</div>
                      <div className="bar-container">
                        <div 
                          className="bar bar-teal" 
                          style={{width: `${stats.completedAppointments > 0 ? (stats.completedAppointments / 20) * 100 : 0}%`}}
                        ></div>
                      </div>
                      <div className="bar-value">{stats.completedAppointments}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PENDING VERIFICATIONS TAB */}
        {activeTab === 'pending' && (
          <div className="admin-content">
            <h1 className="admin-page-title">Pending Doctor Verifications</h1>
            
            {pendingDoctors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <h3>All Caught Up!</h3>
                <p>No pending doctor verifications at the moment.</p>
              </div>
            ) : (
              <div className="doctors-grid">
                {pendingDoctors.map((doctor) => (
                  <div key={doctor.doctor_id} className="doctor-card pending">
                    <div className="doctor-card-header">
                      <div className="doctor-avatar">👨‍⚕️</div>
                      <div className="doctor-info">
                        <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
                        <p className="doctor-specialty">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="doctor-details">
                      <div className="detail-row">
                        <span className="detail-label">📧 Email:</span>
                        <span>{doctor.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📞 Phone:</span>
                        <span>{doctor.phone_no}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🆔 License:</span>
                        <span>{doctor.license_no}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🏆 Experience:</span>
                        <span>{doctor.experience} years</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🏥 Hospital:</span>
                        <span>{doctor.hospital || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📍 City:</span>
                        <span>{doctor.city}</span>
                      </div>
                    </div>
                    <div className="doctor-actions">
                      <button 
                        className="btn-approve"
                        onClick={() => handleVerifyDoctor(doctor.doctor_id, 'approve')}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleVerifyDoctor(doctor.doctor_id, 'reject')}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL DOCTORS TAB */}
        {/* ALL DOCTORS TAB */}
{activeTab === 'doctors' && (
  <div className="admin-content">
    <h1 className="admin-page-title">All Doctors ({allDoctors.length})</h1>
    
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialty</th>
            <th>Experience</th>
            <th>City</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {allDoctors.map((doctor) => (
            <tr key={doctor.doctor_id}>
              <td>{doctor.doctor_id}</td>
              <td>Dr. {doctor.first_name} {doctor.last_name}</td>
              <td>{doctor.email}</td>
              <td>{doctor.specialty}</td>
              <td>{doctor.experience} yrs</td>
              <td>{doctor.city}</td>
              <td>
                <span className={`status-badge ${doctor.verified === 1 ? 'verified' : 'pending'}`}>
                  {doctor.verified === 1 ? '✓ Verified' : '⏳ Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


        {/* ALL PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="admin-content">
            <h1 className="admin-page-title">All Patients ({allPatients.length})</h1>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Gender</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {allPatients.map((patient) => (
                    <tr key={patient.patient_id}>
                      <td>{patient.patient_id}</td>
                      <td>{patient.first_name} {patient.last_name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone_no}</td>
                      <td>{patient.city}</td>
                      <td>{patient.gender}</td>
                      <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
