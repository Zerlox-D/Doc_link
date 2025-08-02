import { use, useState} from 'react';
import "../css/SignUpStyle.css";

function DoctorSignup() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        specializations: [],
        yearsOfExperience: '',
        hospitalsClinic: '',
        homeVisitAvailability: '',
        agreeToTerms: false
    });

    const specializationOptions = [
        'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
        'Pediatrics', 'Psychiatry', 'Gynecology', 'Ophthalmology', 'ENT',
        'Gastroenterology', 'Endocrinology', 'Oncology', 'Pulmonology', 'Radiology',
        'Anesthesiology', 'Physiotherapy', 'Family Medicine', 'Internal Medicine',
        'Pathology', 'Urology', 'Plastic Surgery', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSpecializationChange = (specialization) => {
        setFormData(prev => ({
            ...prev,
            specializations: prev.specializations.includes(specialization)
                ? prev.specializations.filter(s => s !== specialization)
                : [...prev.specializations, specialization]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Doctor signup data:', formData);
    };

    return (
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <h1 className="signup-title">Join <span style={{color:'rgb(43,198,182)'}}>Doc.link</span> as a Doctor</h1>
                        <p className="signup-subtitle">Create your professional account to connect with patients</p>
                    </div>
                    <form onSubmit={handleSubmit} className="signup-form">
                        {/* Personal Information */}
                        <div className="form-section">
                            <h3 className="section-title">Personal Information</h3>
            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="+91"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={formData.gender === 'male'}
                                            onChange={handleChange}
                                            className="radio-input"
                                        />
                                        <span className="radio-label">Male</span>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={formData.gender === 'female'}
                                            onChange={handleChange}
                                            className="radio-input"
                                        />
                                        <span className="radio-label">Female</span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Professional Information */}
                        <div className="form-section">
                            <h3 className="section-title">Professional Information</h3>
            
                            <div className="form-group">
                                <label className="form-label">Medical License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your medical license number"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Specializations (Select all that apply)</label>
                                <div className="specialization-grid">
                                    {specializationOptions.map((specialization) => (
                                        <label key={specialization} className="checkbox-option">
                                            <input
                                                type="checkbox"
                                                checked={formData.specializations.includes(specialization)}
                                                onChange={() => handleSpecializationChange(specialization)}
                                                className="checkbox-input"
                                            />
                                            <span className="checkbox-label">{specialization}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Years of Experience</label>
                                <select
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="" disabled selected hidden>Select experience</option>
                                    <option value="0-1">0-1 years</option>
                                    <option value="2-5">2-5 years</option>
                                    <option value="6-10">6-10 years</option>
                                    <option value="11-15">11-15 years</option>
                                    <option value="16-20">16-20 years</option>
                                    <option value="20+">20+ years</option>
                                </select>
                            </div>
                             <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Hospital Affiliations</label>
                                    <input
                                        type="text"
                                        name="hospitals"
                                        value={formData.hospitals}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter 'NULL' if there are none"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Clinic Affiliations</label>
                                    <input
                                        type="text"
                                        name="clinics"
                                        value={formData.clinics}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter 'NULL' if there are none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Home Visit Availability</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="homeVisitAvailability"
                                            value="yes"
                                            checked={formData.homeVisitAvailability === 'yes'}
                                            onChange={handleChange}
                                            className="radio-input"
                                        />
                                        <span className="radio-label">Yes, I provide home visits</span>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="homeVisitAvailability"
                                            value="no"
                                            checked={formData.homeVisitAvailability === 'no'}
                                            onChange={handleChange}
                                            className="radio-input"
                                        />
                                        <span className="radio-label">No, clinic appointments only</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Terms and Submit */}
                        <div className="form-section">
                            <div className="terms-group">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                    required
                                />
                                <label className="checkbox-label">
                                    I agree to the <a href="/terms" target="_blank">Terms of Service</a>,
                                    <a href="/privacy" target="_blank"> Privacy Policy</a>, and
                                    <a href="/doctor-agreement" target="_blank"> Doctor Agreement</a>.
                                    I confirm that all information provided is accurate and I am a licensed medical professional. *
                                </label>
                            </div>
                            <button type="submit" className="submit-button">
                                Create Doctor Account
                            </button>
                            <p className="login-link">
                                Already have an account? <a href="/login">Sign in here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
    );
}

export default DoctorSignup;