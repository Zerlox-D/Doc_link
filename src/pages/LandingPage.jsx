import React, { useState } from 'react';
import '../css/LandingStyle.css';
import FooterMain from '../components/FooterMain';
import PopUp from '../components/PopUp';
import { Link } from 'react-router-dom';

function LandingPage() {

  const [popUp, setpopUp] = useState(false);

  return (
    <div>
    <header>
      <span className='logo'>Doc.link</span>
      <span className='login'>Login</span>
        <button className='signup_button' onClick={()=>setpopUp(true)}>Sign up &rarr;</button>
        <PopUp isOpen={popUp} onClose={()=>setpopUp(false)} title={""} maxWidth='max-w-lg'>
          <p className='pop-up-msg'>How do you want to proceed?</p>
          <div className='pop-up-buttons'>
            <Link to="/PatientSignUp">
            <button onClick={()=>setpopUp(false)} className='pop-up-options'>Sign Up as Patient</button>
            </Link>
            <span className='OR'>OR</span>
            <Link to="/DoctorSignUp">
            <button onClick={()=>setpopUp(false)} className='pop-up-options'>Sign Up as Doctor</button>
            </Link>
          </div>
        </PopUp>
    </header>
    <hr />
    <div className='p1'>
      <span className='p1text'>
        <br /> Bridging the gap <br />between <span className='p1word'>Patients</span> <br />and <span className='p1word'>Healthcare</span>
        <br />
        
          <button className='getstarted' onClick={()=>setpopUp(true)}>Get started &rarr;</button>
        <PopUp isOpen={popUp} onClose={()=>setpopUp(false)} title={""} maxWidth='max-w-lg'>
          <p className='pop-up-msg'>How do you want to proceed?</p>
          <div className='pop-up-buttons'>
            <Link to="/PatientSignUp">
            <button onClick={()=>setpopUp(false)} className='pop-up-options'>Sign Up as Patient</button>
            </Link>
            <span className='OR'>OR</span>
            <Link to="/DoctorSignUp">
            <button onClick={()=>setpopUp(false)} className='pop-up-options'>Sign Up as Doctor</button>
            </Link>
          </div>
        </PopUp>
      </span>

      <img src="doc_patient.jpg" alt="" className='p1image'/>
    </div>

    <br /><br /><br /><br />
      <span className='cards-header'>Why Doc.link?</span><br /><br />
        <div className="cards-grid">
            <div className="feature-card">
                <div className="card-icon teal-icon">
                    <span className="icon">📅</span>
                </div>
                <h3 className="card-title">Easy Scheduling</h3>
                <p className="card-description">
                    Book appointments with top doctors in just a few clicks. 
                    View real-time availability and choose your preferred time slot.
                </p>
            </div>
            
            <div className="feature-card">
                <div className="card-icon blue-icon">
                    <span className="icon">🏠</span>
                </div>
                <h3 className="card-title">Home Visits</h3>
                <p className="card-description">
                    Request home visits from qualified healthcare professionals. 
                    Get quality medical care in the comfort of your own home.
                </p>
            </div>
            
            <div className="feature-card">
                <div className="card-icon green-icon">
                    <span className="icon">🛡️</span>
                </div>
                <h3 className="card-title">Verified Doctors</h3>
                <p className="card-description">
                    All our healthcare providers are thoroughly verified and licensed. 
                    Trust in quality care from experienced professionals.
                </p>
            </div>
        </div>
        <br /><br /><br /><br /><br />
        <div className='lower'>
            Ready to connect with healthcare?<br />
            <span className='join'>Join thousands of patients who trust Doc.link for their daily healthcare needs</span>
            <br /><br />
            <Link to="/PatientSignUp"><button className='sign-up-now'>Sign up now</button></Link>&nbsp;&nbsp;
            <button className='browse'>Browse without signing up</button>
        </div>
      <br /><br /><br />
    <FooterMain/>
    </div>
  )
}

export default LandingPage