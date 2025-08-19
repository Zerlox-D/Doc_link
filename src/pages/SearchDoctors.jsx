import React, { useState, useEffect } from "react";
import "../css/SearchDoctorsStyle.css";
import { Link } from "react-router-dom";

const SearchDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/Doc_Link/php/SearchDoctors.php?q=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err));
  }, [searchTerm]);

  const handleSearch = () => {
    const results = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(results);
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>Find Your Doctor</h1>
      </header>

      <main className="search-main">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, specialty, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="results-container">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <Link key={doc.doctor_id} to={`/doctor/${doc.doctor_id}`}>
                <div className="doctor-card">
                  <h3>{doc.name}</h3>
                  <p>{doc.specialty}</p>
                  <p>{doc.hospital}</p>
                  <p>{doc.city}</p>
                </div>
                </Link>
              ))
            ) : (
              <p className="no-results">No doctors found</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default SearchDoctors;