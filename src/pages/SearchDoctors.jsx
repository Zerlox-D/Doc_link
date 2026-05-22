import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/SearchDoctorsStyle.css";

export default function SearchDoctors() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    city: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  // Get unique specialties and cities for filter dropdowns
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
  const patientId = localStorage.getItem("patient_id");
  if (!patientId) {
    setIsGuest(true);
  }
}, []);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, doctors]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://doc-link.kesug.com/php/SearchDoctors.php');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setDoctors(data);
        
        // Extract unique specialties and cities
        const uniqueSpecialties = [...new Set(data.map(d => d.specialty))].filter(Boolean).sort();
        const uniqueCities = [...new Set(data.map(d => d.city))].filter(Boolean).sort();
        
        setSpecialties(uniqueSpecialties);
        setCities(uniqueCities);
      } else {
        setError("Failed to load doctors");
      }
    } catch (e) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

const applyFilters = () => {
  let filtered = [...doctors];

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(doc => {
      const name = (doc.name || '').toLowerCase();
      const specialty = (doc.specialty || '').toLowerCase();
      const city = (doc.city || '').toLowerCase();
      const hospital = (doc.hospital || '').toLowerCase();
      const clinic = (doc.clinic || '').toLowerCase(); // Include clinic in search
      
      return name.includes(query) ||
             specialty.includes(query) ||
             city.includes(query) ||
             hospital.includes(query) ||
             clinic.includes(query); // Search in clinic too
    });
  }

    // Apply specialty filter
    if (filters.specialty) {
      filtered = filtered.filter(doc => doc.specialty === filters.specialty);
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(doc => doc.city === filters.city);
    }

    setFilteredDoctors(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ specialty: "", city: "" });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sd-container">
      {/* Header */}
      <header className="sd-header">
          <div className="sd-header-left">
          <div className="sd-logo">Doc.link</div>
        </div>
        <div className="sd-header-right">
        {!isGuest ? (
        <>
        <Link to="/home"><button className="sd-back-btn">← Back to Home</button></Link>
        <button className="sd-logout-btn" onClick={handleLogout}>
          Logout
        </button>
        </>
        ) : (
        <>
          <Link to="/"><button className="sd-back-btn">← Back to Landing</button></Link>
          <Link to="/Login" className="sd-login-link">Login</Link>
          <Link to="/SignUpChoice"><button className="sd-signup-btn">Sign Up</button></Link>
        </>
        )}
        </div>
      </header>

      {/* Main Content */}
      <main className="sd-main">
        <div className="sd-content">
          {/* Page Title */}
          <div className="sd-title-section">
            <h1 className="sd-page-title">Find Your Doctor</h1>
            <p className="sd-page-subtitle">
              Search through our network of verified healthcare professionals
            </p>
          </div>

          {/* Search & Filters */}
          <div className="sd-search-section">
            <div className="sd-search-bar">
              <span className="sd-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, specialty, city, or hospital..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="sd-search-input"
              />
              {(searchQuery || filters.specialty || filters.city) && (
                <button className="sd-clear-btn" onClick={clearFilters}>
                  ✕ Clear
                </button>
              )}
            </div>

            <div className="sd-filters">
              <div className="sd-filter-group">
                <label htmlFor="specialty">Specialty</label>
                <select
                  id="specialty"
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="sd-filter-select"
                >
                  <option value="">All Specialties</option>
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="sd-filter-group">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="sd-filter-select"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="sd-results-section">
            <div className="sd-results-header">
              <h2 className="sd-results-title">
                {loading ? "Loading..." : `${filteredDoctors.length} Doctor${filteredDoctors.length !== 1 ? 's' : ''} Found`}
              </h2>
            </div>

            {loading ? (
              <div className="sd-loading">
                <div className="sd-spinner"></div>
                <p>Finding doctors for you...</p>
              </div>
            ) : error ? (
              <div className="sd-error">{error}</div>
            ) : filteredDoctors.length === 0 ? (
              <div className="sd-empty">
                <div className="sd-empty-icon">🔍</div>
                <h3>No doctors found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="sd-clear-filters-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="sd-doctor-grid">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.doctor_id} className="sd-doctor-card">
                    <div className="sd-doctor-avatar">👨‍⚕️</div>
                    <div className="sd-doctor-info">
                      <h3 className="sd-doctor-name">Dr. {doctor.name}</h3>
                      <p className="sd-doctor-specialty">{doctor.specialty}</p>
                      {doctor.total_reviews > 0 ? (
                      <div className="sd-rating-display">
                        <span className="sd-rating-number">
                          {doctor.average_rating.toFixed(1)}
                        </span>
                        <span className="sd-rating-star">⭐</span>
                        <span className="sd-rating-count">
                          ({doctor.total_reviews})
                        </span>
                      </div>
                      ) : (
                      <div className="sd-rating-display no-rating">
                        <span className="sd-no-reviews-text">No reviews yet</span>
                      </div>
                      )}
                      <div className="sd-doctor-details">
                        <div className="sd-detail-item">
                        {(doctor.hospital || doctor.clinic) && (
                          <span className="sd-detail-icon">
                            <p style={{fontSize:'14px'}}>
                              &nbsp;{doctor.hospital ? `🏥 ${doctor.hospital}` : `🏪 ${doctor.clinic}`}
                            </p>
                          </span>
                        )}
                        </div>
                        <div className="sd-detail-item">
                          <span className="sd-detail-icon">📍</span>
                          <span>{doctor.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sd-card-actions">
                      <Link
                        to={`/doctor/${doctor.doctor_id}`}
                        className="sd-view-profile-btn"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}