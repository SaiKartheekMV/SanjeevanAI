import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5">
      {/* Main Footer */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand & Description */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <h5 className="fw-bold text-primary mb-3">
                <i className="fas fa-heartbeat me-2"></i>
                DiabetesAI
              </h5>
              <p className="text-light opacity-75 mb-3">
                Empowering diabetes management through AI-powered report analysis. 
                Get personalized insights, risk assessments, and health recommendations 
                from your medical reports.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-light opacity-75 hover-opacity-100">
                  <i className="fab fa-facebook-f fs-5"></i>
                </a>
                <a href="#" className="text-light opacity-75 hover-opacity-100">
                  <i className="fab fa-twitter fs-5"></i>
                </a>
                <a href="#" className="text-light opacity-75 hover-opacity-100">
                  <i className="fab fa-linkedin-in fs-5"></i>
                </a>
                <a href="#" className="text-light opacity-75 hover-opacity-100">
                  <i className="fab fa-instagram fs-5"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-home me-2"></i>Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/upload" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-upload me-2"></i>Upload Report
                </a>
              </li>
              <li className="mb-2">
                <a href="/dashboard" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-chart-pie me-2"></i>Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="/login" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-primary mb-3">Features</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-brain me-2"></i>AI Analysis
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-language me-2"></i>Multi-language
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-shield-alt me-2"></i>Secure & Private
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-chart-line me-2"></i>Trend Analysis
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-primary mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-question-circle me-2"></i>Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-file-alt me-2"></i>Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-envelope me-2"></i>Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <i className="fas fa-bug me-2"></i>Report Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-primary mb-3">Contact</h6>
            <div className="mb-3">
              <div className="d-flex align-items-start mb-2">
                <i className="fas fa-envelope text-primary me-2 mt-1"></i>
                <div>
                  <small className="text-light opacity-75">Email</small>
                  <div className="text-light">support@diabetesai.com</div>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-2">
                <i className="fas fa-phone text-primary me-2 mt-1"></i>
                <div>
                  <small className="text-light opacity-75">Phone</small>
                  <div className="text-light">+1 (555) 123-4567</div>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <i className="fas fa-clock text-primary me-2 mt-1"></i>
                <div>
                  <small className="text-light opacity-75">Support Hours</small>
                  <div className="text-light">24/7 Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-top border-secondary">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-shield-alt text-success me-2"></i>
                  <small className="text-light opacity-75">HIPAA Compliant</small>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-lock text-success me-2"></i>
                  <small className="text-light opacity-75">SSL Encrypted</small>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-user-shield text-success me-2"></i>
                  <small className="text-light opacity-75">Privacy Protected</small>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-certificate text-success me-2"></i>
                  <small className="text-light opacity-75">ISO 27001</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end align-items-center gap-2">
                <small className="text-light opacity-75">Powered by</small>
                <div className="d-flex align-items-center">
                  <i className="fab fa-python text-warning me-1"></i>
                  <small className="text-light">FastAPI</small>
                </div>
                <span className="text-light opacity-50">•</span>
                <div className="d-flex align-items-center">
                  <i className="fab fa-react text-info me-1"></i>
                  <small className="text-light">React</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-top border-secondary">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-light opacity-75 mb-0">
                © {currentYear} DiabetesAI. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end gap-3 mt-2 mt-md-0">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <small>Privacy Policy</small>
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <small>Terms of Service</small>
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <small>Cookie Policy</small>
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  <small>Disclaimer</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-warning bg-opacity-10 border-top border-warning">
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-center text-center">
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            <small className="text-light opacity-75">
              <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only. 
              Always consult with healthcare professionals for medical decisions.
            </small>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .hover-opacity-100:hover {
          opacity: 1 !important;
          transition: opacity 0.2s ease;
        }
        
        footer a:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        
        .border-secondary {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        @media (max-width: 768px) {
          footer .col-md-6:first-child {
            text-align: center;
          }
          
          footer .d-flex {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;