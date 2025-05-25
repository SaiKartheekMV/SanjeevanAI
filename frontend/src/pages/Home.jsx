import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Smart Diabetes Monitoring
                <span className="text-warning d-block">Made Simple</span>
              </h1>
              <p className="lead mb-4">
                Upload your diabetes reports and get AI-powered insights, trends analysis, 
                and personalized health recommendations in multiple languages.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/login" className="btn btn-warning btn-lg px-4">
                  <i className="fas fa-rocket me-2"></i>
                  Get Started Free
                </Link>
                <a href="#features" className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-play-circle me-2"></i>
                  Learn More
                </a>
              </div>
              
              {/* Stats */}
              <div className="row mt-5 text-center">
                <div className="col-4">
                  <h3 className="fw-bold text-warning">1000+</h3>
                  <small>Reports Analyzed</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-warning">95%</h3>
                  <small>Accuracy Rate</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-warning">24/7</h3>
                  <small>AI Monitoring</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-4 p-4 backdrop-blur">
                  <i className="fas fa-chart-line fa-5x text-warning mb-3"></i>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="bg-white bg-opacity-20 rounded p-2 mb-2">
                        <i className="fas fa-file-medical text-warning"></i>
                        <small className="d-block">Upload Reports</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-white bg-opacity-20 rounded p-2 mb-2">
                        <i className="fas fa-brain text-warning"></i>
                        <small className="d-block">AI Analysis</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-white bg-opacity-20 rounded p-2">
                        <i className="fas fa-language text-warning"></i>
                        <small className="d-block">Multi-Language</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-white bg-opacity-20 rounded p-2">
                        <i className="fas fa-bell text-warning"></i>
                        <small className="d-block">Smart Alerts</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">Powerful Features</h2>
            <p className="lead text-muted">Everything you need to monitor your diabetes effectively</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-upload fa-2x text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">Easy Upload</h5>
                  <p className="card-text text-muted">
                    Simply upload your blood test reports, prescriptions, or medical documents. 
                    We support PDF, images, and scanned documents.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-robot fa-2x text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">AI Analysis</h5>
                  <p className="card-text text-muted">
                    Our medical AI analyzes your reports using advanced transformers trained 
                    on clinical data to provide accurate insights.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-chart-line fa-2x text-warning"></i>
                  </div>
                  <h5 className="card-title fw-bold">Trend Tracking</h5>
                  <p className="card-text text-muted">
                    Visualize your health trends over time with interactive charts and 
                    receive personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-language fa-2x text-info"></i>
                  </div>
                  <h5 className="card-title fw-bold">Multi-Language</h5>
                  <p className="card-text text-muted">
                    Get summaries and insights in your preferred language. We support 
                    English, Hindi, and other regional languages.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-exclamation-triangle fa-2x text-danger"></i>
                  </div>
                  <h5 className="card-title fw-bold">Risk Alerts</h5>
                  <p className="card-text text-muted">
                    Receive timely alerts when your test results indicate potential 
                    health risks or require immediate attention.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-purple bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-shield-alt fa-2x text-purple"></i>
                  </div>
                  <h5 className="card-title fw-bold">Secure & Private</h5>
                  <p className="card-text text-muted">
                    Your health data is encrypted and secure. We follow strict privacy 
                    guidelines to protect your medical information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary">How It Works</h2>
            <p className="lead text-muted">Get started in just 3 simple steps</p>
          </div>
          
          <div className="row g-4 align-items-center">
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h3 text-white fw-bold mb-0">1</span>
                </div>
                <h5 className="fw-bold">Upload Report</h5>
                <p className="text-muted">Upload your diabetes test reports, prescriptions, or medical documents</p>
              </div>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h3 text-white fw-bold mb-0">2</span>
                </div>
                <h5 className="fw-bold">AI Analysis</h5>
                <p className="text-muted">Our AI processes and analyzes your medical data using advanced algorithms</p>
              </div>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h3 text-white fw-bold mb-0">3</span>
                </div>
                <h5 className="fw-bold">Get Insights</h5>
                <p className="text-muted">Receive personalized insights, trends, and recommendations for better health</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="lead mb-4">Join thousands of users who are already monitoring their diabetes smartly</p>
          <Link to="/login" className="btn btn-warning btn-lg px-5">
            <i className="fas fa-user-plus me-2"></i>
            Start Free Today
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold text-primary mb-4">About DiabetesMonitor</h2>
              <p className="lead mb-4">
                We're on a mission to make diabetes management accessible and intelligent for everyone.
              </p>
              <p className="mb-4">
                Our platform combines cutting-edge AI technology with medical expertise to provide 
                you with actionable insights from your health reports. Whether you're a patient 
                monitoring your condition or a healthcare provider tracking multiple patients, 
                we've got you covered.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  FDA-approved AI algorithms
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  HIPAA compliant security
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  24/7 monitoring and alerts
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Multi-language support
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow-lg p-4">
                <div className="text-center mb-4">
                  <i className="fas fa-heartbeat fa-4x text-primary"></i>
                </div>
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <h4 className="text-primary fw-bold">99.9%</h4>
                    <small className="text-muted">Uptime</small>
                  </div>
                  <div className="col-6 mb-3">
                    <h4 className="text-success fw-bold">50K+</h4>
                    <small className="text-muted">Users</small>
                  </div>
                  <div className="col-6">
                    <h4 className="text-warning fw-bold">24/7</h4>
                    <small className="text-muted">Support</small>
                  </div>
                  <div className="col-6">
                    <h4 className="text-info fw-bold">5★</h4>
                    <small className="text-muted">Rating</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;