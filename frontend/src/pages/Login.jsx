/* eslint-disable no-unused-vars */

// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Register from './Register';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'patient' // patient, clinic, government
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data (in real app, this would come from API)
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        userType: formData.userType,
        isAuthenticated: true
      }));
      
      // Redirect based on user type
      switch (formData.userType) {
        case 'clinic':
          navigate('/clinic-dashboard');
          break;
        case 'government':
          navigate('/gov-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      
      <div className="flex-grow-1 d-flex align-items-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              
              {/* Login Card */}
              <div className="card shadow-lg border-0">
                <div className="card-header bg-white text-center py-4">
                  <h3 className="fw-bold text-primary mb-2">
                    <i className="fas fa-heartbeat me-2"></i>
                    DiabetesMonitor
                  </h3>
                  <p className="text-muted mb-0">Sign in to your account</p>
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
                        id="patient" 
                        value="patient"
                        checked={formData.userType === 'patient'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="patient">
                        <i className="fas fa-user me-1"></i>Patient
                      </label>

                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="userType" 
                        id="clinic" 
                        value="clinic"
                        checked={formData.userType === 'clinic'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="clinic">
                        <i className="fas fa-hospital me-1"></i>Clinic
                      </label>

                      <input 
                        type="radio" 
                        className="btn-check" 
                        name="userType" 
                        id="government" 
                        value="government"
                        checked={formData.userType === 'government'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="government">
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

                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2"></i>Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
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

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <i className="fas fa-lock me-2"></i>Password
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <Link to="/forgot-password" className="text-decoration-none">
                        Forgot password?
                      </Link>
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
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="text-center mb-3">
                    <span className="text-muted">or</span>
                  </div>

                  {/* Social Login */}
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-danger">
                      <i className="fab fa-google me-2"></i>
                      Continue with Google
                    </button>
                    <button className="btn btn-outline-primary">
                      <i className="fab fa-facebook me-2"></i>
                      Continue with Facebook
                    </button>
                  </div>
                </div>

                <div className="card-footer text-center py-3 bg-light">
                  <p className="mb-0">
                    Don't have an account? 
                    <Link to="/register" className="text-decoration-none ms-1 fw-semibold">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="row g-3 mt-4">
                <div className="col-4 text-center">
                  <div className="text-white">
                    <i className="fas fa-shield-alt fa-2x mb-2"></i>
                    <div className="small">Secure</div>
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="text-white">
                    <i className="fas fa-mobile-alt fa-2x mb-2"></i>
                    <div className="small">Mobile Ready</div>
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="text-white">
                    <i className="fas fa-clock fa-2x mb-2"></i>
                    <div className="small">24/7 Access</div>
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

export default Login;