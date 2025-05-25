import React, { useState } from 'react';

const ReportCard = ({ report, onDelete, onView, onDownload }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusMap = {
      'processing': { class: 'bg-warning', icon: 'fas fa-spinner', text: 'Processing' },
      'completed': { class: 'bg-success', icon: 'fas fa-check-circle', text: 'Completed' },
      'failed': { class: 'bg-danger', icon: 'fas fa-exclamation-circle', text: 'Failed' },
      'pending': { class: 'bg-secondary', icon: 'fas fa-clock', text: 'Pending' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  // Get risk level styling
  const getRiskLevel = (riskScore) => {
    if (riskScore >= 80) return { class: 'text-danger', text: 'High Risk', icon: 'fas fa-exclamation-triangle' };
    if (riskScore >= 60) return { class: 'text-warning', text: 'Medium Risk', icon: 'fas fa-exclamation' };
    if (riskScore >= 40) return { class: 'text-info', text: 'Low Risk', icon: 'fas fa-info-circle' };
    return { class: 'text-success', text: 'Normal', icon: 'fas fa-check-circle' };
  };

  // Get report type icon
  const getReportTypeIcon = (type) => {
    const iconMap = {
      'blood_test': 'fas fa-tint',
      'prescription': 'fas fa-pills',
      'hba1c': 'fas fa-chart-line',
      'glucose_monitoring': 'fas fa-heartbeat',
      'lab_report': 'fas fa-flask',
      'other': 'fas fa-file-medical'
    };
    return iconMap[type] || 'fas fa-file-medical';
  };

  const statusBadge = getStatusBadge(report.status);
  const riskLevel = report.analysis ? getRiskLevel(report.analysis.risk_score) : null;

  return (
    <div className="card border-0 shadow-sm mb-3 report-card">
      <div className="card-header bg-light border-0 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <i className={`${getReportTypeIcon(report.type)} text-primary me-2`}></i>
          <div>
            <h6 className="mb-0 fw-bold">{report.title || `${report.type.replace('_', ' ').toUpperCase()} Report`}</h6>
            <small className="text-muted">
              <i className="fas fa-calendar-alt me-1"></i>
              {formatDate(report.created_at)}
            </small>
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <span className={`badge ${statusBadge.class} d-flex align-items-center`}>
            <i className={`${statusBadge.icon} me-1 ${report.status === 'processing' ? 'fa-spin' : ''}`}></i>
            {statusBadge.text}
          </span>
          
          {/* Action Buttons */}
          <div className="dropdown">
            <button 
              className="btn btn-outline-secondary btn-sm" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => onView(report)}>
                  <i className="fas fa-eye me-2"></i>View Details
                </button>
              </li>
              {report.status === 'completed' && (
                <li>
                  <button className="dropdown-item" onClick={() => onDownload(report)}>
                    <i className="fas fa-download me-2"></i>Download Report
                  </button>
                </li>
              )}
              <li><hr className="dropdown-divider"/></li>
              <li>
                <button 
                  className="dropdown-item text-danger" 
                  onClick={() => onDelete(report.id)}
                >
                  <i className="fas fa-trash me-2"></i>Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Quick Stats */}
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3">
            <div className="text-center">
              <div className="h5 mb-1 text-primary">{report.file_count || 1}</div>
              <small className="text-muted">Files</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-center">
              <div className="h5 mb-1 text-info">{report.language?.toUpperCase() || 'EN'}</div>
              <small className="text-muted">Language</small>
            </div>
          </div>
          {report.analysis && (
            <>
              <div className="col-6 col-md-3">
                <div className="text-center">
                  <div className={`h5 mb-1 ${riskLevel.class}`}>
                    <i className={`${riskLevel.icon} me-1`}></i>
                    {report.analysis.risk_score}%
                  </div>
                  <small className="text-muted">Risk Score</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="text-center">
                  <div className={`h6 mb-1 ${riskLevel.class}`}>{riskLevel.text}</div>
                  <small className="text-muted">Risk Level</small>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Analysis Preview */}
        {report.analysis && report.status === 'completed' && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">
                <i className="fas fa-brain text-primary me-2"></i>
                AI Analysis Summary
              </h6>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
              </button>
            </div>
            
            <div className="bg-light rounded p-3">
              <p className="mb-2 text-sm">
                {isExpanded 
                  ? report.analysis.summary 
                  : `${report.analysis.summary?.substring(0, 150)}${report.analysis.summary?.length > 150 ? '...' : ''}`
                }
              </p>
              
              {isExpanded && (
                <div className="mt-3">
                  {/* Key Findings */}
                  {report.analysis.key_findings && (
                    <div className="mb-3">
                      <h6 className="fw-bold text-primary mb-2">Key Findings:</h6>
                      <ul className="list-unstyled mb-0">
                        {report.analysis.key_findings.map((finding, index) => (
                          <li key={index} className="mb-1">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Recommendations */}
                  {report.analysis.recommendations && (
                    <div className="mb-3">
                      <h6 className="fw-bold text-info mb-2">Recommendations:</h6>
                      <ul className="list-unstyled mb-0">
                        {report.analysis.recommendations.map((rec, index) => (
                          <li key={index} className="mb-1">
                            <i className="fas fa-lightbulb text-warning me-2"></i>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Alerts */}
                  {report.analysis.alerts && report.analysis.alerts.length > 0 && (
                    <div className="alert alert-warning mb-0">
                      <h6 className="alert-heading">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Health Alerts
                      </h6>
                      <ul className="mb-0">
                        {report.analysis.alerts.map((alert, index) => (
                          <li key={index}>{alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processing State */}
        {report.status === 'processing' && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Processing...</span>
            </div>
            <p className="text-muted mb-0">AI is analyzing your report...</p>
            <small className="text-muted">This usually takes 1-2 minutes</small>
          </div>
        )}

        {/* Failed State */}
        {report.status === 'failed' && (
          <div className="alert alert-danger">
            <h6 className="alert-heading">
              <i className="fas fa-exclamation-circle me-2"></i>
              Analysis Failed
            </h6>
            <p className="mb-2">We encountered an issue processing your report.</p>
            <button className="btn btn-outline-danger btn-sm">
              <i className="fas fa-redo me-2"></i>
              Retry Analysis
            </button>
          </div>
        )}

        {/* Additional Notes */}
        {report.notes && (
          <div className="mt-3">
            <h6 className="fw-bold">
              <i className="fas fa-sticky-note text-secondary me-2"></i>
              Your Notes
            </h6>
            <p className="text-muted mb-0 small bg-light rounded p-2">
              {report.notes}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className="fas fa-user-md me-1"></i>
            ID: {report.id.substring(0, 8)}...
          </small>
          
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => onView(report)}
            >
              <i className="fas fa-eye me-1"></i>
              View Full Report
            </button>
            
            {report.status === 'completed' && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onDownload(report)}
              >
                <i className="fas fa-download me-1"></i>
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;