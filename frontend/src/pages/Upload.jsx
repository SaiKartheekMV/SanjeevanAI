import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UploadForm from '../components/UploadForm';

const Upload = () => {
  const [uploadResults, setUploadResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = (results) => {
    setUploadResults(results);
    setIsProcessing(false);
  };

  const handleUploadStart = () => {
    setIsProcessing(true);
    setUploadResults([]);
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-primary py-5" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-3">
                <i className="fas fa-upload me-3"></i>
                Upload Medical Reports
              </h1>
              <p className="lead text-white-50 mb-4">
                Upload your diabetes-related reports and get AI-powered insights instantly. 
                Our advanced system analyzes blood tests, prescriptions, and medical documents.
              </p>
              <div className="row text-center mt-4">
                <div className="col-md-4">
                  <div className="text-white">
                    <i className="fas fa-brain fa-2x mb-2"></i>
                    <h6>AI Analysis</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-white">
                    <i className="fas fa-language fa-2x mb-2"></i>
                    <h6>Multi-Language</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-white">
                    <i className="fas fa-shield-alt fa-2x mb-2"></i>
                    <h6>Secure & Private</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              {/* Upload Form Section */}
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-file-medical me-2"></i>
                    Upload Your Medical Reports
                  </h5>
                </div>
                <div className="card-body p-4">
                  <UploadForm 
                    onUploadSuccess={handleUploadSuccess}
                    onUploadStart={handleUploadStart}
                  />
                </div>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="card shadow border-0 mb-4">
                  <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-primary">Processing Your Reports...</h5>
                    <p className="text-muted">Our AI is analyzing your medical data. This may take a few moments.</p>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {uploadResults.length > 0 && (
                <div className="card shadow-lg border-0 mb-4">
                  <div className="card-header bg-success text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">
                        <i className="fas fa-check-circle me-2"></i>
                        Analysis Complete
                      </h5>
                      <button 
                        className="btn btn-light btn-sm"
                        onClick={handleViewDashboard}
                      >
                        <i className="fas fa-chart-line me-1"></i>
                        View Dashboard
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {uploadResults.map((result, index) => (
                        <div key={index} className="col-md-6 mb-3">
                          <div className="card border-success">
                            <div className="card-body">
                              <h6 className="card-title text-success">
                                <i className="fas fa-file-alt me-2"></i>
                                {result.fileName || `Report ${index + 1}`}
                              </h6>
                              <p className="card-text small text-muted">
                                {result.summary || 'Analysis completed successfully'}
                              </p>
                              {result.riskLevel && (
                                <span className={`badge bg-${result.riskLevel === 'high' ? 'danger' : result.riskLevel === 'medium' ? 'warning' : 'success'}`}>
                                  Risk: {result.riskLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Information Cards */}
              <div className="row g-4 mt-4">
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-file-pdf fa-xl text-primary"></i>
                      </div>
                      <h6 className="fw-bold">Supported Formats</h6>
                      <p className="text-muted small">PDF, JPG, PNG files up to 10MB each</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-clock fa-xl text-success"></i>
                      </div>
                      <h6 className="fw-bold">Quick Analysis</h6>
                      <p className="text-muted small">Get results in under 2 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-user-md fa-xl text-info"></i>
                      </div>
                      <h6 className="fw-bold">Clinical Grade</h6>
                      <p className="text-muted small">Medical AI trained on clinical data</p>
                    </div>
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

export default Upload;
