/* eslint-disable no-unused-vars */

// Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    userType: 'patient', // patient, clinic, government
    // Clinic specific fields
    clinicName: '',
    licenseNumber: '',
    address: '',
    // Government specific fields
    department: '',
    employeeId: '',
    // Terms and conditions
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear confirm password error when password changes
    if (name === 'password' && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    // Role-specific validation
    if (formData.userType === 'clinic') {
      if (!formData.clinicName.trim()) {
        newErrors.clinicName = 'Clinic name is required';
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License number is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
    }
    
    if (formData.userType === 'government') {
      if (!formData.department.trim()) {
        newErrors.department = 'Department is required';
      }
      if (!formData.employeeId.trim()) {
        newErrors.employeeId = 'Employee ID is required';
      }
    }
    
    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare registration data
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.replace(/\s/g, ''),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        userType: formData.userType
      };
      
      // Add role-specific data
      if (formData.userType === 'clinic') {
        registrationData.clinicDetails = {
          name: formData.clinicName.trim(),
          licenseNumber: formData.licenseNumber.trim(),
          address: formData.address.trim()
        };
      }
      
      if (formData.userType === 'government') {
        registrationData.governmentDetails = {
          department: formData.department.trim(),
          employeeId: formData.employeeId.trim()
        };
      }
      
      // Call API
      const response = await apiService.register(registrationData);
      
      // Registration successful
      alert('Registration successful! Please check your email to verify your account.');
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (formData.userType === 'clinic') {
      return (
        <>
          <div className="mb-3">
            <label htmlFor="clinicName" className="form-label fw-semibold">
              <i className="fas fa-hospital me-2"></i>Clinic Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.clinicName ? 'is-invalid' : ''}`}
              id="clinicName"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              placeholder="Enter clinic name"
            />
            {errors.clinicName && (
              <div className="invalid-feedback">{errors.clinicName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="licenseNumber" className="form-label fw-semibold">
              <i className="fas fa-certificate me-2"></i>License Number
            </label>
            <input
              type="text"
              className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Enter medical license number"
            />
            {errors.licenseNumber && (
              <div className="invalid-feedback">{errors.licenseNumber}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label fw-semibold">
              <i className="fas fa-map-marker-alt me-2"></i>Address
            </label>
            <textarea
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              id="address"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter clinic address"
            ></textarea>
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>
        </>
      );
    }

    if (formData.userType === 'government') {
      return (
        <>
          <div className="mb-3">
            <label htmlFor="department" className="form-label fw-semibold">
              <i className="fas fa-building me-2"></i>Department
            </label>
            <select
              className={`form-select ${errors.department ? 'is-invalid' : ''}`}
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="health">Ministry of Health</option>
              <option value="education">Ministry of Education</option>
              <option value="statistics">National Statistics Office</option>
              <option value="social">Social Services</option>
              <option value="other">Other</option>
            </select>
            {errors.department && (
              <div className="invalid-feedback">{errors.department}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="employeeId" className="form-label fw-semibold">
              <i className="fas fa-id-card me-2"></i>Employee ID
            </label>
            <input
              type="text"
              className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Enter government employee ID"
            />
            {errors.employeeId && (
              <div className="invalid-feedback">{errors.employeeId}</div>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      
      <div className="flex-grow-1 d-flex align-items-center py-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              
              {/* Registration Card */}
              <div className="card shadow-lg border-0">
                <div className="card-header bg-white text-center py-4">
                  <h3 className="fw-bold text-primary mb-2">
                    <i className="fas fa-heartbeat me-2"></i>
                    DiabetesMonitor
                  </h3>
                  <p className="text-muted mb-0">Create your account</p>
                </div>
                
                <div className="card-body p-4">
                  {/* User Type Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Account Type</label>
                    <div className="btn-group w-100" role="group">
                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="userType" 
                        id="patient-reg" 
                        value="patient"
                        checked={formData.userType === 'patient'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="patient-reg">
                        <i className="fas fa-user me-1"></i>Patient
                      </label>

                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="userType" 
                        id="clinic-reg" 
                        value="clinic"
                        checked={formData.userType === 'clinic'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="clinic-reg">
                        <i className="fas fa-hospital me-1"></i>Clinic
                      </label>

                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="userType" 
                        id="government-reg" 
                        value="government"
                        checked={formData.userType === 'government'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="government-reg">
                        <i className="fas fa-building me-1"></i>Gov
                      </label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors.general && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.general}
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Personal Information */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="firstName" className="form-label fw-semibold">
                            <i className="fas fa-user me-2"></i>First Name
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="lastName" className="form-label fw-semibold">
                            <i className="fas fa-user me-2"></i>Last Name
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">{errors.lastName}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2"></i>Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label fw-semibold">
                            <i className="fas fa-lock me-2"></i>Password
                          </label>
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Enter password"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          {errors.password && (
                            <div className="invalid-feedback d-block">{errors.password}</div>
                          )}
                          <div className="form-text">
                            Must be 8+ characters with uppercase, lowercase, and number
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label fw-semibold">
                            <i className="fas fa-lock me-2"></i>Confirm Password
                          </label>
                          <div className="input-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm password"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="phoneNumber" className="form-label fw-semibold">
                            <i className="fas fa-phone me-2"></i>Phone Number
                          </label>
                          <input
                            type="tel"
                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1234567890"
                          />
                          {errors.phoneNumber && (
                            <div className="invalid-feedback">{errors.phoneNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="dateOfBirth" className="form-label fw-semibold">
                            <i className="fas fa-calendar me-2"></i>Date of Birth
                          </label>
                          <input
                            type="date"
                            className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                          />
                          {errors.dateOfBirth && (
                            <div className="invalid-feedback">{errors.dateOfBirth}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-venus-mars me-2"></i>Gender
                      </label>
                      <div className="btn-group w-100" role="group">
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="gender" 
                          id="male" 
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleChange}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="male">
                          <i className="fas fa-mars me-1"></i>Male
                        </label>

                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="gender" 
                          id="female" 
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleChange}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="female">
                          <i className="fas fa-venus me-1"></i>Female
                        </label>

                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="gender" 
                          id="other" 
                          value="other"
                          checked={formData.gender === 'other'}
                          onChange={handleChange}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="other">
                          <i className="fas fa-genderless me-1"></i>Other
                        </label>
                      </div>
                      {errors.gender && (
                        <div className="text-danger small mt-1">{errors.gender}</div>
                      )}
                    </div>

                    {/* Role-specific fields */}
                    {renderRoleSpecificFields()}

                    {/* Terms and Conditions */}
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="agreeToTerms">
                          I agree to the <Link to="/terms" className="text-decoration-none">Terms and Conditions</Link>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="text-danger small">{errors.agreeToTerms}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${errors.agreeToPrivacy ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="agreeToPrivacy"
                          name="agreeToPrivacy"
                          checked={formData.agreeToPrivacy}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="agreeToPrivacy">
                          I agree to the <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                        </label>
                        {errors.agreeToPrivacy && (
                          <div className="text-danger small">{errors.agreeToPrivacy}</div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="card-footer text-center py-3 bg-light">
                  <p className="mb-0">
                    Already have an account? 
                    <Link to="/login" className="text-decoration-none ms-1 fw-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Features */}
              <div className="row g-3 mt-4">
                <div className="col-md-4 text-center">
                  <div className="text-white">
                    <i className="fas fa-shield-alt fa-2x mb-2"></i>
                    <div className="small">Secure Registration</div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="text-white">
                    <i className="fas fa-user-shield fa-2x mb-2"></i>
                    <div className="small">Privacy Protected</div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="text-white">
                    <i className="fas fa-envelope-open-text fa-2x mb-2"></i>
                    <div className="small">Email Verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;