import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const quickLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/upload', label: 'Upload Report', icon: 'fas fa-upload' },
    { path: '/reports', label: 'My Reports', icon: 'fas fa-file-medical' },
    { path: '/help', label: 'Help & Support', icon: 'fas fa-question-circle' }
  ];

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="mb-4">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '5rem' }}></i>
            </div>

            {/* Error Message */}
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="lead text-muted mb-4">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <Link to="/" className="btn btn-primary btn-lg">
                <i className="fas fa-home me-2"></i>
                Go Home
              </Link>
              <button 
                onClick={handleGoBack}
                className="btn btn-outline-secondary btn-lg"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-compass me-2"></i>
                  Quick Navigation
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {quickLinks.map((link, index) => (
                    <div key={index} className="col-md-6">
                      <Link 
                        to={link.path} 
                        className="btn btn-outline-primary w-100 text-start"
                      >
                        <i className={`${link.icon} me-2`}></i>
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4">
              <p className="text-muted">
                Still having trouble? 
                <Link to="/help" className="text-decoration-none ms-1">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern (Optional) */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23007bff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: -1
        }}
      ></div>
    </div>
  );
};

export default NotFound;