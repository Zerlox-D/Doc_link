import { useState } from 'react';
import '../css/SignUpStyle.css';

function PatientSignup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        city: '',
        state: '',
        emergencyContact: '',
        emergencyPhone: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Patient signup data:', formData);
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1 className="signup-title">Join <span style={{color:'rgb(43, 198, 182)'}}>Doc.link</span> as a Patient</h1>
                    <p className="signup-subtitle">Create your account to book appointments and home visits</p>
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

                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <div className='radio-group'>
                                <label className='radio-option'>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender==="male"}
                                        onChange={handleChange}
                                        className='radio-input'
                                    />
                                    <span className='radio-label'>Male</span>
                                </label>
                                <label className='radio-option'>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender==="female"}
                                        onChange={handleChange}
                                        className='radio-input'
                                    />
                                    <span className='radio-label'>Female</span>
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
                        <h3 className="section-title">Address Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Emergency Contact</h3>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Emergency Contact Name</label>
                                <input
                                    type="text"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Emergency Contact Phone</label>
                                <input
                                    type="tel"
                                    name="emergencyPhone"
                                    value={formData.emergencyPhone}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="+91"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms and Submit */}
                    <div className="form-section">
                        <button type="submit" className="submit-button">
                            Create Patient Account
                        </button>

                        <p className="login-link">
                            Already have an account? <a href="#">Sign in here</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PatientSignup;