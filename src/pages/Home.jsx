import React, { useState, useEffect } from "react";
import "../css/HomeStyle.css";
import { Link } from "react-router-dom";

const Home = () => {

  useEffect(() => {
    const heroBox = document.querySelector(".hero-box");
    if (heroBox) {
      heroBox.classList.add("active");
    }
  }, []);

  return (
    <>
      <header className="home-header">
        <div className="logo">
          <h1>Doc.link</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/Home">Home</Link></li>
          <li><Link to="/SearchDoctors">Search</Link></li>
          <li><Link to="/PatientProfile">Patient Profile</Link></li>
        </ul>
      </header>

      <section className="hero" id="home">
        <div className="hero-box">
          <h2>Your Health, One Click Away</h2>
          <p>
            Instantly book appointments with experienced doctors and clinics near you.
            Simple, secure, and made for your comfort.
          </p>
          <Link to="/SearchDoctors"><button className="btn">Search Doctors</button></Link>
        </div>
      </section>
    </>
  );
};

export default Home;
