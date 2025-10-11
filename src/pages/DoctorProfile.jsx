import React, { useEffect, useMemo, useState } from "react";
import "../css/DoctorProfileStyle.css";
import FooterMinimal from "../components/FooterMinimal";


const weekdayOrder = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const allDays = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

export default function DoctorProfile() {
  const [profileData, setProfileData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Editable fields
  const [editedDoctor, setEditedDoctor] = useState({});
  const [editedAvailability, setEditedAvailability] = useState([]);

  const doctorId = useMemo(() => localStorage.getItem("doctor_id"), []);

  useEffect(() => {
    if (!doctorId) {
      setErr("No doctor session found. Please log in again.");
      setLoading(false);
      return;
    }

    loadProfile();
  }, [doctorId]);

  const loadProfile = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      setErr("");

      const profileRes = await fetch(`http://localhost/Doc_Link/php/GetDoctorWithAvailability.php?id=${doctorId}`, { signal: controller.signal });
      const profileData = await profileRes.json();
      if (profileData?.error) throw new Error(profileData.error);
      setProfileData(profileData);
      setEditedDoctor(profileData.doctor || {});
      setEditedAvailability(profileData.availability || []);

      const apptRes = await fetch(`http://localhost/Doc_Link/php/GetDoctorAppointments.php?doctor_id=${doctorId}`, { signal: controller.signal });
      const apptData = await apptRes.json();
      setAppointments(Array.isArray(apptData) ? apptData : []);
    } catch (e) {
      if (e.name !== "AbortError") setErr(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }

      const pendingRes = await fetch(`http://localhost/Doc_Link/php/GetDoctorPendingAppointments.php?doctor_id=${doctorId}`);
      const pendingData = await pendingRes.json();
      setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
  };

  const doctor = profileData?.doctor;
  const availability = profileData?.availability;

  const fullName = useMemo(() => {
    if (!doctor) return "";
    return `Dr. ${doctor.first_name} ${doctor.last_name}`;
  }, [doctor]);

  const sortedAvailability = useMemo(() => {
    const data = editMode ? editedAvailability : availability;
    if (!data?.length) return [];
    return [...data].sort((a, b) => weekdayOrder.indexOf(a.day_of_week) - weekdayOrder.indexOf(b.day_of_week));
  }, [availability, editedAvailability, editMode]);

  const upcoming = useMemo(() => {
    if (!appointments?.length) return [];
    return [...appointments]
      .sort((a, b) => new Date(`${a.appointment_date} ${a.appointment_time}`) - new Date(`${b.appointment_date} ${b.appointment_time}`))
      .slice(0, 5);
  }, [appointments]);

  const handleAppointmentAction = async (appointmentId, status) => {
  const action = status === 'confirmed' ? 'accept' : 'decline';
  if (!window.confirm(`Are you sure you want to ${action} this appointment?`)) return;

  try {
    const response = await fetch('http://localhost/Doc_Link/php/UpdateAppointmentStatus.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: appointmentId, status })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to update appointment');

    alert(`Appointment ${status === 'confirmed' ? 'accepted' : 'declined'} successfully!`);
    loadProfile();
  } catch (e) {
    alert('Error: ' + e.message);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditedDoctor(profileData.doctor || {});
      setEditedAvailability(profileData.availability || []);
    }
    setEditMode(!editMode);
  };

  const handleDoctorChange = (field, value) => {
    setEditedDoctor(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    setEditedAvailability(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddDay = () => {
    const existingDays = editedAvailability.map(a => a.day_of_week);
    const availableDays = allDays.filter(d => !existingDays.includes(d));
    if (availableDays.length === 0) {
      alert("All days have been added!");
      return;
    }
    setEditedAvailability(prev => [...prev, {
      day_of_week: availableDays[0],
      is_available: 1,
      start_time: "09:00:00",
      end_time: "17:00:00",
      slot_duration: 30,
      consultation_fee: 500,
      home_visit_available: 0,
      home_visit_fee: 0
    }]);
  };

  const handleDeleteDay = (index) => {
    if (window.confirm("Are you sure you want to delete this day?")) {
      setEditedAvailability(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const doctorRes = await fetch('http://localhost/Doc_Link/php/UpdateDoctorProfile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctorId,
          experience: editedDoctor.experience,
          hospital: editedDoctor.hospital,
          clinic: editedDoctor.clinic,
          email: editedDoctor.email,
          phone_no: editedDoctor.phone_no,
          city: editedDoctor.city
        })
      });
      const doctorData = await doctorRes.json();
      if (!doctorData.success) throw new Error(doctorData.error || "Failed to update profile");

      const availRes = await fetch('http://localhost/Doc_Link/php/UpdateDoctorAvailability.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctorId,
          availability: editedAvailability
        })
      });
      const availData = await availRes.json();
      if (!availData.success) throw new Error(availData.error || "Failed to update availability");

      alert("Profile updated successfully!");
      setEditMode(false);
      loadProfile(); // Reload fresh data
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dpd-container">
        <header className="dpd-header"><div className="dpd-logo">Doc.link</div></header>
        <div className="dpd-loading">Loading profile...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="dpd-container">
        <header className="dpd-header"><div className="dpd-logo">Doc.link</div></header>
        <div className="dpd-error">{err}</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="dpd-container">
        <header className="dpd-header"><div className="dpd-logo">Doc.link</div></header>
        <div className="dpd-error">Doctor data could not be loaded.</div>
      </div>
    );
  }

  return (
    <div className="dpd-container">
      {/* Header */}
      <header className="dpd-header">
        <div className="dpd-logo">Doc.link</div>
        <div className="dpd-header-right">
          <span className="dpd-greeting">Welcome, {fullName}!</span>
          <button className="dpd-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Content */}
      <main className="dpd-content">
        {/* Edit/Save Buttons */}
        <div className="dpd-action-bar">
          {!editMode ? (
            <button className="dpd-edit-btn" onClick={handleEditToggle}>✏️ Edit Profile</button>
          ) : (
            <>
              <button className="dpd-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button className="dpd-cancel-btn" onClick={handleEditToggle} disabled={saving}>
                ✖ Cancel
              </button>
            </>
          )}
        </div>

        {/* Profile Card */}
        <section className="dpd-card dpd-profile-card">
          <div className="dpd-profile-left">
            <div className="dpd-avatar" aria-label="Doctor avatar">🧑‍⚕️</div>
            <div>
              <h1 className="dpd-title">{fullName}</h1>
              <p className="dpd-subtitle">{doctor.specialty}</p>
              <p className="dpd-meta">
                <span>Experience: {editMode ? (
                  <input
                    type="number"
                    value={editedDoctor.experience}
                    onChange={(e) => handleDoctorChange('experience', e.target.value)}
                    className="dpd-inline-input"
                  />
                ) : doctor.experience} yrs</span>
                <span>•</span>
                <span>License: {doctor.license_no}</span>
              </p>
              <p className="dpd-meta">
                <span>Hospital: {editMode ? (
                  <input
                    type="text"
                    value={editedDoctor.hospital}
                    onChange={(e) => handleDoctorChange('hospital', e.target.value)}
                    className="dpd-inline-input"
                  />
                ) : doctor.hospital}</span>
                <span>•</span>
                <span>Clinic: {editMode ? (
                  <input
                    type="text"
                    value={editedDoctor.clinic}
                    onChange={(e) => handleDoctorChange('clinic', e.target.value)}
                    className="dpd-inline-input"
                  />
                ) : doctor.clinic}</span>
              </p>
            </div>
          </div>
          <div className="dpd-profile-right">
            <div className={`dpd-verify-badge ${doctor.verified ? "dpd-verified" : "dpd-pending"}`}>
              {doctor.verified ? "Verified ✔" : "Pending Verification"}
            </div>
            <div className="dpd-contact">
              <div>📧 {editMode ? (
                <input
                  type="email"
                  value={editedDoctor.email}
                  onChange={(e) => handleDoctorChange('email', e.target.value)}
                  className="dpd-inline-input"
                />
              ) : doctor.email}</div>
              <div>📞 {editMode ? (
                <input
                  type="tel"
                  value={editedDoctor.phone_no}
                  onChange={(e) => handleDoctorChange('phone_no', e.target.value)}
                  className="dpd-inline-input"
                />
              ) : doctor.phone_no}</div>
              <div>🏙️ {editMode ? (
                <input
                  type="text"
                  value={editedDoctor.city}
                  onChange={(e) => handleDoctorChange('city', e.target.value)}
                  className="dpd-inline-input"
                />
              ) : doctor.city}</div>
            </div>
          </div>
        </section>

        {/* Availability + Fees */}
        <section className="dpd-card">
          <div className="dpd-section-header">
            <h2 className="dpd-section-title">Weekly Availability & Fees</h2>
            {editMode && <button className="dpd-add-day-btn" onClick={handleAddDay}>➕ Add Day</button>}
          </div>
          {sortedAvailability.length === 0 ? (
            <div className="dpd-empty">No availability configured yet.</div>
          ) : (
            <div className="dpd-availability-grid">
              {sortedAvailability.map((row, index) => (
                <div
                  key={`${row.day_of_week}-${index}`}
                  className={`dpd-day-card ${row.is_available ? "dpd-day-available" : "dpd-day-off"}`}
                >
                  <div className="dpd-day-header">
                    <div className="dpd-day-name">
                      {editMode ? (
                        <select
                          value={row.day_of_week}
                          onChange={(e) => handleAvailabilityChange(index, 'day_of_week', e.target.value)}
                          className="dpd-day-select"
                        >
                          {allDays.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                        </select>
                      ) : (
                        row.day_of_week.charAt(0).toUpperCase() + row.day_of_week.slice(1)
                      )}
                    </div>
                    <div className="dpd-badge-group">
                      {editMode && (
                        <button className="dpd-delete-day-btn" onClick={() => handleDeleteDay(index)}>🗑️</button>
                      )}
                      <div className={`dpd-badge ${row.is_available ? "dpd-badge-yes" : "dpd-badge-no"}`}>
                        {editMode ? (
                          <select
                            value={row.is_available}
                            onChange={(e) => handleAvailabilityChange(index, 'is_available', parseInt(e.target.value))}
                            className="dpd-avail-select"
                          >
                            <option value="1">Available</option>
                            <option value="0">Off</option>
                          </select>
                        ) : (row.is_available ? "Available" : "Off")}
                      </div>
                    </div>
                  </div>

                  <div className="dpd-day-body">
                    {row.is_available ? (
                      <>
                        <div className="dpd-row">
                          <span>Time</span>
                          {editMode ? (
                            <div className="dpd-time-inputs">
                              <input
                                type="time"
                                value={row.start_time?.slice(0,5)}
                                onChange={(e) => handleAvailabilityChange(index, 'start_time', e.target.value + ':00')}
                              />
                              <span>–</span>
                              <input
                                type="time"
                                value={row.end_time?.slice(0,5)}
                                onChange={(e) => handleAvailabilityChange(index, 'end_time', e.target.value + ':00')}
                              />
                            </div>
                          ) : (
                            <strong>{row.start_time?.slice(0,5)} – {row.end_time?.slice(0,5)}</strong>
                          )}
                        </div>
                        <div className="dpd-row">
                          <span>Slot</span>
                          {editMode ? (
                            <input
                              type="number"
                              value={row.slot_duration}
                              onChange={(e) => handleAvailabilityChange(index, 'slot_duration', parseInt(e.target.value))}
                              className="dpd-small-input"
                            />
                          ) : (
                            <strong>{row.slot_duration || 30} min</strong>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="dpd-muted">No slots</div>
                    )}

                    <div className="dpd-divider" />

                    <div className="dpd-row">
                      <span>Consultation Fee</span>
                      {editMode ? (
                        <input
                          type="number"
                          value={row.consultation_fee || 0}
                          onChange={(e) => handleAvailabilityChange(index, 'consultation_fee', parseFloat(e.target.value))}
                          className="dpd-small-input"
                        />
                      ) : (
                        <strong>{row.consultation_fee != null ? `₹ ${Number(row.consultation_fee).toFixed(2)}` : "—"}</strong>
                      )}
                    </div>
                    <div className="dpd-row">
                      <span>Home Visit</span>
                      {editMode ? (
                        <div className="dpd-home-visit-edit">
                          <select
                            value={row.home_visit_available}
                            onChange={(e) => handleAvailabilityChange(index, 'home_visit_available', parseInt(e.target.value))}
                            className="dpd-avail-select"
                          >
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {row.home_visit_available ? (
                            <input
                              type="number"
                              value={row.home_visit_fee || 0}
                              onChange={(e) => handleAvailabilityChange(index, 'home_visit_fee', parseFloat(e.target.value))}
                              placeholder="Fee"
                              className="dpd-small-input"
                            />
                          ) : null}
                        </div>
                      ) : (
                        <strong>{row.home_visit_available ? `Yes (₹ ${Number(row.home_visit_fee || 0).toFixed(2)})` : "No"}</strong>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Appointments */}
        <section className="dpd-card">
          <h2 className="dpd-section-title">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <div className="dpd-empty">No upcoming appointments.</div>
          ) : (
            <div className="dpd-appointments">
              {upcoming.map((a) => (
                <div key={`${a.appointment_id}`} className="dpd-appt-row">
                  <div className="dpd-appt-when">
                    <div className="dpd-appt-date">{a.appointment_date}</div>
                    <div className="dpd-appt-time">{a.appointment_time?.slice(0,5)}</div>
                  </div>
                  <div className="dpd-appt-meta">
                    <div className="dpd-appt-patient">{a.patient_name}</div>
                    <div className="dpd-appt-reason">{a.booking_reason || "General Consultation"}</div>
                    <div className="dpd-appt-mode">Mode: {a.mode_of_booking}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Pending Appointment Requests - ADD THIS NEW SECTION */}
        <section className="dpd-card">
          <h2 className="dpd-section-title">Pending Appointment Requests</h2>
          {pendingRequests.length === 0 ? (
          <div className="dpd-empty">No pending requests.</div>
            ) : (
            <div className="dpd-appointments">
              {pendingRequests.map((req) => (
              <div key={req.appointment_id} className="dpd-appt-row dpd-pending-request">
                <div className="dpd-appt-when">
                  <div className="dpd-appt-date">{req.appointment_date}</div>
                  <div className="dpd-appt-time">{req.appointment_time?.slice(0,5)}</div>
                </div>
                <div className="dpd-appt-meta">
                  <div className="dpd-appt-patient">Patient: {req.patient_name}</div>
                  <div className="dpd-appt-reason">{req.booking_reason || "General Consultation"}</div>
                  <div className="dpd-appt-mode">Mode: {req.mode_of_booking}</div>
                  <div className="dpd-appt-booked-by">Booked by: {req.booked_by}</div>
                </div>
                <div className="dpd-appt-actions">
                  <button 
                    className="dpd-accept-btn"
                    onClick={() => handleAppointmentAction(req.appointment_id, 'confirmed')}
                  >
                    Accept
                  </button>
                  <button 
                    className="dpd-decline-btn"
                    onClick={() => handleAppointmentAction(req.appointment_id, 'declined')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

      </main>
      <div className="mini-footer">
        <FooterMinimal />
      </div>
    </div>
  );
}
