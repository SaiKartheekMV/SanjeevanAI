/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { apiService } from '../../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(AppContext);
  
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Mock patient data - replace with actual API calls
      const mockPatient = {
        id: parseInt(id),
        name: 'John Doe',
        age: 45,
        email: 'john.doe@email.com',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345',
        dateOfBirth: '1979-03-15',
        gender: 'Male',
        emergencyContact: 'Jane Doe - +1234567899',
        lastVisit: '2025-05-20',
        nextVisit: '2025-06-20',
        status: 'stable',
        hba1c: 7.2,
        bloodPressure: '130/85',
        weight: '85 kg',
        height: '175 cm',
        bmi: 27.8,
        diabetesType: 'Type 2',
        diagnosisDate: '2020-01-15',
        medications: [
          'Metformin 500mg - Twice daily',
          'Lisinopril 10mg - Once daily',
          'Atorvastatin 20mg - Once daily'
        ],
        allergies: ['Penicillin', 'Shellfish'],
        notes: 'Patient shows good compliance with medication. Recommend continued monitoring of HbA1c levels.'
      };

      const mockReports = [
        {
          id: 1,
          date: '2025-05-20',
          type: 'Blood Test',
          status: 'completed',
          hba1c: 7.2,
          glucose: 145,
          summary: 'HbA1c levels have improved since last visit. Continue current medication regimen.',
          aiInsights: 'Blood glucose levels are within acceptable range. Consider dietary consultation.',
          riskLevel: 'moderate'
        },
        {
          id: 2,
          date: '2025-04-15',
          type: 'Comprehensive Panel',
          status: 'completed',
          hba1c: 7.8,
          glucose: 162,
          summary: 'Slight increase in HbA1c levels. Monitor closely and consider medication adjustment.',
          aiInsights: 'Trending upward in glucose levels. Recommend lifestyle modifications.',
          riskLevel: 'high'
        },
        {
          id: 3,
          date: '2025-03-10',
          type: 'Routine Checkup',
          status: 'completed',
          hba1c: 7.1,
          glucose: 138,
          summary: 'Excellent control maintained. Patient is compliant with treatment plan.',
          aiInsights: 'Stable glucose patterns. Continue current management approach.',
          riskLevel: 'low'
        }
      ];

      setPatient(mockPatient);
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load patient data'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      stable: 'bg-success',
      improving: 'bg-info',
      critical: 'bg-danger',
      warning: 'bg-warning text-dark'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const getRiskBadge = (risk) => {
    const riskClasses = {
      low: 'bg-success',
      moderate: 'bg-warning text-dark',
      high: 'bg-danger'
    };
    return `badge ${riskClasses[risk] || 'bg-secondary'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <i className="fas fa-user-times fa-3x text-muted mb-3"></i>
          <h4>Patient Not Found</h4>
          <p className="text-muted">The requested patient could not be found.</p>
          <Link to="/clinic/patients" className="btn btn-primary">
            Back to Patient List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/clinic/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/clinic/patients">Patients</Link>
              </li>
              <li className="breadcrumb-item active">{patient.name}</li>
            </ol>
          </nav>
          <h1 className="h3 mb-0">{patient.name}</h1>
        </div>
        <div className="btn-group">
          <button className="btn btn-outline-primary">
            <i className="fas fa-envelope me-2"></i>
            Send Message
          </button>
          <button className="btn btn-outline-success">
            <i className="fas fa-calendar-plus me-2"></i>
            Schedule Visit
          </button>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-2 text-center">
              <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <i className="fas fa-user fa-2x"></i>
              </div>
              <span className={getStatusBadge(patient.status)}>
                {patient.status}
              </span>
            </div>
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">Age</h6>
                  <p className="mb-3">{patient.age} years</p>
                  <h6 className="text-muted mb-1">Gender</h6>
                  <p className="mb-3">{patient.gender}</p>
                </div>
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">Last Visit</h6>
                  <p className="mb-3">{formatDate(patient.lastVisit)}</p>
                  <h6 className="text-muted mb-1">Next Visit</h6>
                  <p className="mb-3">{formatDate(patient.nextVisit)}</p>
                </div>
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">HbA1c</h6>
                  <p className="mb-3">
                    <strong className={patient.hba1c > 7 ? 'text-warning' : 'text-success'}>
                      {patient.hba1c}%
                    </strong>
                  </p>
                  <h6 className="text-muted mb-1">Blood Pressure</h6>
                  <p className="mb-3">{patient.bloodPressure} mmHg</p>
                </div>
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">BMI</h6>
                  <p className="mb-3">{patient.bmi}</p>
                  <h6 className="text-muted mb-1">Diabetes Type</h6>
                  <p className="mb-3">{patient.diabetesType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-line me-2"></i>
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="fas fa-file-medical me-2"></i>
            Reports ({reports.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            <i className="fas fa-pills me-2"></i>
            Medications
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user me-2"></i>
            Profile
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Health Trends</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border-end">
                      <h4 className="text-primary mb-1">{patient.hba1c}%</h4>
                      <small className="text-muted">Current HbA1c</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <h4 className="text-info mb-1">{reports[0]?.glucose || 'N/A'}</h4>
                      <small className="text-muted">Latest Glucose</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <h4 className="text-success mb-1">{patient.bmi}</h4>
                    <small className="text-muted">BMI</small>
                  </div>
                </div>
                <hr />
                <div className="text-center">
                  <p className="text-muted mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Detailed analytics coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Recent Activity</h5>
              </div>
              <div className="card-body">
                {reports.slice(0, 3).map((report, index) => (
                  <div key={report.id} className={`d-flex align-items-start ${index !== 2 ? 'mb-3' : ''}`}>
                    <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0">
                      <i className="fas fa-file-medical text-muted"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{report.type}</h6>
                      <p className="text-muted mb-1 small">{formatDate(report.date)}</p>
                      <span className={getRiskBadge(report.riskLevel)}>
                        {report.riskLevel} risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Medical Reports</h5>
            <Link to="/upload" className="btn btn-primary btn-sm">
              <i className="fas fa-plus me-2"></i>
              Add Report
            </Link>
          </div>
          <div className="card-body p-0">
            {reports.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>HbA1c</th>
                      <th>Glucose</th>
                      <th>Risk Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td>{formatDate(report.date)}</td>
                        <td>{report.type}</td>
                        <td>
                          <span className={report.hba1c > 7 ? 'text-warning' : 'text-success'}>
                            {report.hba1c}%
                          </span>
                        </td>
                        <td>{report.glucose} mg/dL</td>
                        <td>
                          <span className={getRiskBadge(report.riskLevel)}>
                            {report.riskLevel}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            {report.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-download"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                <p className="text-muted">No reports found for this patient</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">Current Medications</h5>
          </div>
          <div className="card-body">
            {patient.medications && patient.medications.length > 0 ? (
              <div className="row">
                {patient.medications.map((medication, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{medication.split(' - ')[0]}</h6>
                          <p className="text-muted mb-0 small">{medication.split(' - ')[1]}</p>
                        </div>
                        <span className="badge bg-success">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-pills fa-3x text-muted mb-3"></i>
                <p className="text-muted">No medications recorded</p>
              </div>
            )}
            
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="mt-4">
                <h6 className="text-danger mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Allergies
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span key={index} className="badge bg-danger">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Patient Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-1">Full Name</h6>
                    <p className="mb-0">{patient.name}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-1">Date of Birth</h6>
                    <p className="mb-0">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-1">Email</h6>
                    <p className="mb-0">{patient.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-1">Phone</h6>
                    <p className="mb-0">{patient.phone}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <h6 className="text-muted mb-1">Address</h6>
                    <p className="mb-0">{patient.address}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-1">Emergency Contact</h6>
                    <p className="mb-0">{patient.emergencyContact}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-1">Diagnosis Date</h6>
                    <p className="mb-0">{formatDate(patient.diagnosisDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Clinical Notes</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">{patient.notes}</p>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-edit me-2"></i>
                  Edit Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;