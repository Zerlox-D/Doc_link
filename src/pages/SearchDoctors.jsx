import React, { useState } from "react";
import "../css/SearchDoctorsStyle.css";

const SearchDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const doctors = [
    { name: "Dr. Anil Kumar", specialty: "Cardiologist", location: "Kochi" },
    { name: "Dr. Sreeja Menon", specialty: "Dermatologist", location: "Thiruvananthapuram" },
    { name: "Dr. Ramesh", specialty: "Pediatrician", location: "Kozhikode" },
    { name: "Dr. Meera", specialty: "Neurologist", location: "Kochi" },
    { name: "Dr. Prakash Nair", specialty: "Orthopedic", location: "Thrissur" },
  ];

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
      <nav className="navbar">
        <div className="nav-left">
          <a href="/">Home</a>
          <a href="/search">Search</a>
        </div>
      </nav>

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
              <div key={index} className="doctor-card">
                <h3>{doc.name}</h3>
                <p>{doc.specialty}</p>
                <p>{doc.location}</p>
              </div>
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
