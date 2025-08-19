import React, { useState } from 'react';
import '../css/LandingStyle.css';
import FooterMain from '../components/FooterMain';
import { Link } from 'react-router-dom';

function LandingPage() {

  return (
    <div>
    <header>
      <span className='logo'>Doc.link</span>
      <div className='login-container'>
        <Link to="/Login" className='login'>Login</Link>
        <Link to="/SignUpChoice"><button className='signup_button'>Sign up &rarr;</button></Link>
      </div>
    </header>
    <hr />

    <div className='p1'>
      <span className='p1text'>
        <br /> Bridging the gap <br />between <span className='p1word'>Patients</span> <br />and <span className='p1word'>Healthcare</span>
        <br />
          <Link to="/SignUpChoice"><button className='getstarted'>Get started &rarr;</button></Link>
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
            <Link to="/SignUpChoice"><button className='sign-up-now'>Sign up now</button></Link>&nbsp;&nbsp;
            <Link to="/Home"><button className='browse'>Browse without signing up</button></Link>
        </div>
      <br /><br /><br />
    <FooterMain/>
    </div>
  )
}

export default LandingPage