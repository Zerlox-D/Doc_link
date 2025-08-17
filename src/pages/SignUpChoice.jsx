import React from 'react';
import { Link } from 'react-router-dom';
import '../css/SignUpChoiceStyle.css';

function RoleSelection() {
  return (
    <div className="role-selection-container">
    
      <header className="role-selection-header">
        <span className="header-logo">
          <Link to="/" className='header-logo'>Doc.link</Link>
        </span>
        <div className="header-nav">
          <Link to="/login" className="header-login">
            Login
          </Link>
        </div>
      </header>

      <div className="split-container">
        
        <div className="patient-section">
          
          <div className="patient-content">
        
            <div className="patient-icon">
              <span>👤</span>
            </div>
            
            <h2 className="patient-title">
              Patient
            </h2>
            
            <p className="patient-description">
              Book appointments, schedule home visits, and connect with verified healthcare professionals
            </p>


            <Link to="/PatientSignUp">
              <button
                className="patient-signup-btn">
                  Sign up as Patient →
              </button>
            </Link>
          </div>
        </div>


        <div className="doctor-section">
          
          <div className="doctor-content">

            <div className="doctor-icon">
              <span>👨‍⚕️</span>
            </div>
            
            <h2 className="doctor-title">
              Doctor
            </h2>
            
            <p className="doctor-description">
              Build your profile, connect with patients at hospitals and homes, and provide quality healthcare services
            </p>
           
            <Link to="/DoctorSignUp">
                <button
                  className="doctor-signup-btn">
                    Sign up as Doctor →
                </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;