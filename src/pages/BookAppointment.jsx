// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import "../css/AppointmentStyle.css";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// export default function BookAppointment() {
//   const query = useQuery();
//   const modeParam = query.get("mode");
//   const doctorNameParam = query.get("doctor");

//   const [formData, setFormData] = useState({
//     patientName: "",
//     doctorName: doctorNameParam || "",
//     reason: "",
//     date: "",
//     time: "",
//     mode: "",
//   });

//   const [success, setSuccess] = useState(false);
//   const [availableModes, setAvailableModes] = useState([]);

//   useEffect(() => {
//     if (modeParam === "schedule") {
//       setAvailableModes(["Hospital", "Clinic"]);
//     } else if (modeParam === "home") {
//       setAvailableModes(["Home Visit"]);
//       setFormData((prev) => ({ ...prev, mode: "Home Visit" }));
//     }
//   }, [modeParam]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSuccess(true);

//     // Reset, but preserve doctorName and mode if home visit
//     setFormData({
//       patientName: "",
//       doctorName: doctorNameParam || "",
//       reason: "",
//       date: "",
//       time: "",
//       mode: modeParam === "home" ? "Home Visit" : "",
//     });
//   };

//   return (
//     <div className="ba-container">
//       <nav className="ba-navbar">
//         <span className="ba-logo">Doc.Link</span>
//         <a href="/" className="ba-logout-btn">Logout</a>
//       </nav>

//       <header className="ba-header">
//         <h1 className="ba-title">Book an Appointment</h1>
//         <p className="ba-subtitle">Fill in your details to confirm booking</p>
//       </header>

//       <main className="ba-main">
//         <div className="ba-form-card">
//           <form onSubmit={handleSubmit} className="ba-form">
//             <div className="ba-form-group">
//               <label className="ba-label" htmlFor="patientName">Patient Name</label>
//               <input
//                 className="ba-input"
//                 type="text"
//                 id="patientName"
//                 name="patientName"
//                 placeholder="Enter patient name"
//                 value={formData.patientName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="ba-form-group">
//               <label className="ba-label" htmlFor="doctorName">Doctor Name</label>
//               <input
//                 className="ba-input"
//                 type="text"
//                 id="doctorName"
//                 name="doctorName"
//                 value={formData.doctorName}
//                 readOnly
//               />
//             </div>

//             <div className="ba-form-group">
//               <label className="ba-label" htmlFor="reason">Reason for Booking</label>
//               <textarea
//                 className="ba-textarea"
//                 id="reason"
//                 name="reason"
//                 placeholder="Brief description of illness or purpose"
//                 value={formData.reason}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="ba-form-group">
//               <label className="ba-label" htmlFor="date">Date</label>
//               <input
//                 className="ba-input"
//                 type="date"
//                 id="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="ba-form-group">
//               <label className="ba-label" htmlFor="time">Time</label>
//               <input
//                 className="ba-input"
//                 type="time"
//                 id="time"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="ba-form-group">
//               <label className="ba-label" htmlFor="mode">Mode of Booking</label>
//               <select
//                 className="ba-select"
//                 id="mode"
//                 name="mode"
//                 value={formData.mode}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Mode</option>
//                 {availableModes.map((m, idx) => (
//                   <option key={idx} value={m}>{m}</option>
//                 ))}
//               </select>
//             </div>

//             <button type="submit" className="ba-btn ba-btn-primary">
//               Confirm Booking
//             </button>
//           </form>

//           {success && (
//             <div className="ba-success-msg">
//               ✅ Appointment booked successfully! <br />
//               <a href="/" className="ba-home-link">Go back to Home</a>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/AppointmentStyle.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BookAppointment() {
  const query = useQuery();
  const modeParam = query.get("mode");
  const doctorNameParam = query.get("doctor");
  const doctorIdParam = query.get("doctor_id");

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: doctorNameParam || "",
    reason: "",
    date: "",
    time: "",
    mode: "",
  });

  const [success, setSuccess] = useState(false);
  const [availableModes, setAvailableModes] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (modeParam === "schedule") {
      setAvailableModes(["Hospital", "Clinic"]);
    } else if (modeParam === "home") {
      setAvailableModes(["Home Visit"]);
      setFormData((prev) => ({ ...prev, mode: "Home Visit" }));
    }
  }, [modeParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // When date is selected, fetch available slots
    if (name === "date" && value && doctorIdParam) {
      fetchAvailableSlots(doctorIdParam, value);
    }
  };

  const fetchAvailableSlots = (doctorId, date) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setFormData((prev) => ({ ...prev, time: "" }));

    fetch(`http://localhost/Doc_Link/php/GetAvailableSlots.php?doctor_id=${doctorId}&date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setLoadingSlots(false);
        if (data.available && data.slots) {
          setAvailableSlots(data.slots);
        } else {
          alert(data.message || "No slots available for this date");
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadingSlots(false);
        alert("Failed to load slots. Please try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const patient_id = localStorage.getItem('patient_id');
    
    if (!patient_id) {
      alert("Please login to book appointment");
      return;
    }

    if (!doctorIdParam) {
      alert("Doctor information is missing");
      return;
    }

    const bookingData = {
      patient_id: parseInt(patient_id),
      doctor_id: parseInt(doctorIdParam),
      booking_reason: formData.reason || null,
      appointment_date: formData.date,
      appointment_time: formData.time,
      mode_of_booking: formData.mode
    };

    // Submit to backend
    fetch('http://localhost/Doc_Link/php/BookAppointmentSubmit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          patientName: "",
          doctorName: doctorNameParam || "",
          reason: "",
          date: "",
          time: "",
          mode: modeParam === "home" ? "Home Visit" : "",
        });
        setAvailableSlots([]);
      } else {
        alert('Booking failed: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error(err);
      alert('Failed to book appointment. Please try again.');
    });
  };

  return (
    <div className="ba-container">
      <nav className="ba-navbar">
        <div className="ba-logo">Doc.link</div>
        {/* <div>
          <a href="/home" className="ba-nav-link">Home</a>
          <a href="/appointments" className="ba-nav-link">Appointments</a>
          <a href="/doctors" className="ba-nav-link">Doctors</a>
          <a href="/logout" className="ba-logout-btn">Logout</a>
        </div> */}
      </nav>

      <header className="ba-header">
        <h1 className="ba-title">Book Your Appointment</h1>
        <p className="ba-subtitle">Fill out the form to schedule your visit</p>
      </header>

      <div className="ba-form-card">
        <form className="ba-form" onSubmit={handleSubmit}>
          {/* Patient Name */}
          <div className="ba-form-group">
            <label className="ba-label">Patient Name</label>
            <input
              type="text"
              name="patientName"
              className="ba-input"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="ba-form-group">
            <label className="ba-label">Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              className="ba-input"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Enter doctor's name"
              readOnly={!!doctorNameParam}
            />
          </div>

          <div className="ba-form-group">
            <label className="ba-label">Reason for Visit</label>
            <textarea
              name="reason"
              className="ba-textarea"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly describe your concern"
            />
          </div>

          {/* Date */}
          <div className="ba-form-group">
            <label className="ba-label">Preferred Date</label>
            <input
              type="date"
              name="date"
              className="ba-input"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Time Slot Dropdown - CHANGED FROM INPUT TO DROPDOWN */}
          <div className="ba-form-group">
            <label className="ba-label">Preferred Time</label>
            {!formData.date ? (
              <p style={{color: '#666', fontSize: '0.9rem', marginTop: '5px'}}>
                Please select a date first
              </p>
            ) : loadingSlots ? (
              <p style={{color: '#666', fontSize: '0.9rem', marginTop: '5px'}}>
                Loading available slots...
              </p>
            ) : availableSlots.length > 0 ? (
              <select
                name="time"
                className="ba-select"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a time slot --</option>
                {availableSlots.map((slot) => (
                  <option key={slot.time} value={slot.time}>
                    {slot.formatted_time}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{color: '#d32f2f', fontSize: '0.9rem', marginTop: '5px'}}>
                No available slots for this date
              </p>
            )}
          </div>

          {/* Mode */}
          <div className="ba-form-group">
            <label className="ba-label">Consultation Mode</label>
            <select
              name="mode"
              className="ba-select"
              value={formData.mode}
              onChange={handleChange}
              disabled={modeParam === "home"}
              required
            >
              <option value="">-- Select Mode --</option>
              {availableModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="ba-btn ba-btn-primary">
            Book Appointment
          </button>
        </form>

        {/* Success Message */}
        {success && (
          <div className="ba-success-msg">
            ✅ Your appointment has been successfully booked!
            <br />
            <a href="/home" className="ba-home-link">
              Go back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
