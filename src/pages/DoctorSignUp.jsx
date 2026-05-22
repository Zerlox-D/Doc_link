import { use, useState} from 'react';
import { Link } from 'react-router-dom';
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
        qualification: '',
        licenseNumber: '',
        specializations: [],
        yearsOfExperience: '',
        hospitalsClinic: '',
        city: '',
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

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Validate terms agreement
  if (!formData.agreeToTerms) {
    alert('Please agree to the terms and conditions');
    return;
  }

  // Validate specializations
  if (formData.specializations.length === 0) {
    alert('Please select at least one specialization');
    return;
  }

  try {
    const response = await fetch('https://doc-link.kesug.com/php/DoctorSignUp.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Registration successful! Your account is pending admin verification. You will be able to login once verified.');
      // Redirect to login
      window.location.href = '/login';
    } else {
      alert('Registration failed: ' + data.error);
    }
  } catch (error) {
    alert('Error during registration. Please try again.');
    console.error('Signup error:', error);
  }
};


    return (
        <div className="signup-container">
            <div className='left-side'>
                <div className='logo-signup'>
                    <Link to="/"><span className='logo-text'>Doc.link</span></Link>
                </div>
                <div className="user-signup-icon">
                    <span>👨‍⚕️</span>
                </div>
                <div className='doctor-signup-button-container'>
                    <Link to="/PatientSignUp">
                    <button
                      className="doctor-signup-btn">
                        Sign up as Patient →
                    </button>
                    </Link>
                </div>
            </div>
                <div className="signup-card">
                    <div className="signup-header">
                        <h1 className="signup-title">Join <span style={{color:'rgb(43,198,182)'}}>Doc.link</span> as a Doctor</h1>
                        <p className="signup-subtitle">Create your professional account to connect with patients</p>
                    </div>
                    <form onSubmit={handleSubmit} className="signup-form">
                        
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
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={handleChange}
                                        style={{width:765}}
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
                                    <label className='radio-option'>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={formData.gender==="other"}
                                        onChange={handleChange}
                                        className='radio-input'
                                    />
                                    <span className='radio-label'>Other</span>
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
                                <label className="form-label">Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="MBBS, B.Pharm ...."
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
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter years of experience"
                                    required
                                />
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
                                Already have an account? <Link to="/login">Sign in here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
    );
}

export default DoctorSignup;