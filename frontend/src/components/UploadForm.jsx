import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../App';
import { apiService } from '../services/api';

const UploadForm = () => {
  const { handleUploadSuccess, addNotification } = useContext(AppContext);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reportType, setReportType] = useState('blood_test');
  const [language, setLanguage] = useState('en');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef(null);

  const acceptedFileTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const errors = [];

    // Check file count
    if (selectedFiles.length + files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }

    files.forEach((file) => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max 10MB)`);
        return;
      }

      // Check file type
      const fileType = file.type;
      const isValidType = Object.keys(acceptedFileTypes).some(type => {
        if (type.includes('*')) {
          return fileType.startsWith(type.split('*')[0]);
        }
        return fileType === type;
      });

      if (!isValidType) {
        errors.push(`${file.name} is not a supported file type`);
        return;
      }

      // Check for duplicates
      if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name} is already selected`);
        return;
      }

      validFiles.push({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      });
    });

    if (errors.length > 0) {
      addNotification({
        type: 'error',
        message: errors.join(', ')
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up preview URLs
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      addNotification({
        type: 'error',
        message: 'Please select at least one file to upload'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Add files
      selectedFiles.forEach(fileData => {
        formData.append('files', fileData.file);
      });
      
      // Add metadata
      formData.append('reportType', reportType);
      formData.append('language', language);
      formData.append('notes', notes);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.uploadReport(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Clean up preview URLs
      selectedFiles.forEach(fileData => {
        if (fileData.preview) {
          URL.revokeObjectURL(fileData.preview);
        }
      });

      // Reset form
      setSelectedFiles([]);
      setNotes('');
      setReportType('blood_test');
      setLanguage('en');
      
      // Success callback
      handleUploadSuccess(response.report);
      
      addNotification({
        type: 'success',
        message: 'Report uploaded successfully! Analysis will be ready shortly.'
      });

    } catch (error) {
      console.error('Upload error:', error);
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-upload me-2"></i>
                Upload Medical Report
              </h4>
              <p className="mb-0 mt-2 opacity-75">
                Upload your diabetes-related reports for AI-powered analysis
              </p>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Report Type Selection */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="fas fa-file-medical text-primary me-2"></i>
                      Report Type
                    </label>
                    <select 
                      className="form-select"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      required
                    >
                      <option value="blood_test">Blood Test Report</option>
                      <option value="prescription">Prescription</option>
                      <option value="hba1c">HbA1c Test</option>
                      <option value="glucose_monitoring">Glucose Monitoring</option>
                      <option value="lab_report">Lab Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="fas fa-language text-primary me-2"></i>
                      Preferred Language
                    </label>
                    <select 
                      className="form-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-cloud-upload-alt text-primary me-2"></i>
                    Upload Files
                  </label>
                  
                  <div
                    className={`border-2 border-dashed rounded-3 p-4 text-center position-relative ${
                      dragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-light'
                    } ${uploading ? 'pe-none' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{ minHeight: '200px' }}
                  >
                    {uploading && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-3">
                        <div className="text-center">
                          <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Uploading...</span>
                          </div>
                          <div className="progress mb-2" style={{ width: '200px' }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                          <p className="text-muted mb-0">Uploading and analyzing...</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="d-flex flex-column align-items-center">
                      <i className="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                      <h5 className="mb-2">Drop files here or click to browse</h5>
                      <p className="text-muted mb-3">
                        Support for PDF, Images (JPG, PNG), Word documents
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <i className="fas fa-folder-open me-2"></i>
                        Choose Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={Object.keys(acceptedFileTypes).join(',')}
                        onChange={handleFileSelect}
                        className="d-none"
                      />
                    </div>
                    
                    <div className="mt-3">
                      <small className="text-muted">
                        Maximum {maxFiles} files, up to 10MB each
                      </small>
                    </div>
                  </div>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      <i className="fas fa-paperclip text-primary me-2"></i>
                      Selected Files ({selectedFiles.length})
                    </h6>
                    <div className="row g-3">
                      {selectedFiles.map((fileData) => (
                        <div key={fileData.id} className="col-md-6">
                          <div className="card border">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-start">
                                <div className="me-3">
                                  {fileData.preview ? (
                                    <img 
                                      src={fileData.preview} 
                                      alt={fileData.name}
                                      className="rounded"
                                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center"
                                         style={{ width: '50px', height: '50px' }}>
                                      <i className="fas fa-file-alt text-primary"></i>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="mb-1 text-truncate" title={fileData.name}>
                                    {fileData.name}
                                  </h6>
                                  <small className="text-muted">
                                    {formatFileSize(fileData.size)}
                                  </small>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => removeFile(fileData.id)}
                                  disabled={uploading}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-sticky-note text-primary me-2"></i>
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional context about your report, symptoms, or specific concerns you'd like the AI to focus on..."
                    disabled={uploading}
                  />
                  <div className="form-text">
                    Provide context like symptoms, medication changes, or specific questions for more personalized analysis.
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="alert alert-info mb-4">
                  <div className="d-flex">
                    <i className="fas fa-shield-alt text-info me-3 mt-1"></i>
                    <div>
                      <h6 className="alert-heading mb-2">Privacy & Security</h6>
                      <p className="mb-0">
                        Your medical data is encrypted and processed securely. We follow HIPAA compliance standards 
                        and never share your personal health information with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {selectedFiles.length > 0 && (
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} ready to upload
                      </small>
                    )}
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setSelectedFiles([]);
                        setNotes('');
                        setReportType('blood_test');
                        setLanguage('en');
                      }}
                      disabled={uploading || selectedFiles.length === 0}
                    >
                      <i className="fas fa-undo me-2"></i>
                      Reset
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={uploading || selectedFiles.length === 0}
                    >
                      {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-brain me-2"></i>
                          Analyze Report
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* File Type Help */}
                <div className="mt-4">
                  <details className="text-muted">
                    <summary className="cursor-pointer">
                      <small>
                        <i className="fas fa-question-circle me-1"></i>
                        Supported file formats
                      </small>
                    </summary>
                    <div className="mt-2 ps-3">
                      <small>
                        <strong>Images:</strong> JPG, JPEG, PNG, GIF, BMP<br/>
                        <strong>Documents:</strong> PDF, DOC, DOCX<br/>
                        <strong>Maximum size:</strong> 10MB per file<br/>
                        <strong>Maximum files:</strong> 5 files per upload
                      </small>
                    </div>
                  </details>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;