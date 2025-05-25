/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { apiService } from '../../services/api';

const PatientList = () => {
  const { addNotification } = useContext(AppContext);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterAndSortPatients();
  }, [patients, searchTerm, statusFilter, sortBy, filterAndSortPatients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPatients = [
        {
          id: 1,
          name: 'John Doe',
          age: 45,
          email: 'john.doe@email.com',
          phone: '+1234567890',
          lastVisit: '2025-05-20',
          status: 'stable',
          hba1c: 7.2,
          reportsCount: 5
        },
        {
          id: 2,
          name: 'Jane Smith',
          age: 52,
          email: 'jane.smith@email.com',
          phone: '+1234567891',
          lastVisit: '2025-05-19',
          status: 'critical',
          hba1c: 9.1,
          reportsCount: 8
        },
        {
          id: 3,
          name: 'Mike Johnson',
          age: 38,
          email: 'mike.johnson@email.com',
          phone: '+1234567892',
          lastVisit: '2025-05-18',
          status: 'improving',
          hba1c: 6.8,
          reportsCount: 3
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          age: 29,
          email: 'sarah.wilson@email.com',
          phone: '+1234567893',
          lastVisit: '2025-05-17',
          status: 'stable',
          hba1c: 6.5,
          reportsCount: 12
        },
        {
          id: 5,
          name: 'Robert Brown',
          age: 61,
          email: 'robert.brown@email.com',
          phone: '+1234567894',
          lastVisit: '2025-05-16',
          status: 'warning',
          hba1c: 8.3,
          reportsCount: 7
        }
      ];

      setPatients(mockPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load patients'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPatients = () => {
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort patients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastVisit':
          return new Date(b.lastVisit) - new Date(a.lastVisit);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'hba1c':
          return b.hba1c - a.hba1c;
        default:
          return 0;
      }
    });

    setFilteredPatients(filtered);
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

  const getHbA1cStatus = (value) => {
    if (value < 7) return { class: 'text-success', icon: 'check-circle' };
    if (value < 8) return { class: 'text-warning', icon: 'exclamation-triangle' };
    return { class: 'text-danger', icon: 'times-circle' };
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

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Patient Management</h1>
          <p className="text-muted mb-0">Manage and monitor your patients</p>
        </div>
        <Link to="/clinic/dashboard" className="btn btn-outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="stable">Stable</option>
                <option value="improving">Improving</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="lastVisit">Sort by Last Visit</option>
                <option value="status">Sort by Status</option>
                <option value="hba1c">Sort by HbA1c</option>
              </select>
            </div>
            <div className="col-md-2">
              <div className="text-muted small">
                {filteredPatients.length} of {patients.length} patients
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filteredPatients.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Last Visit</th>
                    <th>HbA1c</th>
                    <th>Status</th>
                    <th>Reports</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    const hba1cStatus = getHbA1cStatus(patient.hba1c);
                    return (
                      <tr key={patient.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-3">
                              <i className="fas fa-user text-muted"></i>
                            </div>
                            <div>
                              <strong className="d-block">{patient.name}</strong>
                              <small className="text-muted">Age: {patient.age}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="text-muted">
                              <i className="fas fa-envelope me-1"></i>
                              {patient.email}
                            </div>
                            <div className="text-muted">
                              <i className="fas fa-phone me-1"></i>
                              {patient.phone}
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{patient.lastVisit}</td>
                        <td>
                          <span className={hba1cStatus.class}>
                            <i className={`fas fa-${hba1cStatus.icon} me-1`}></i>
                            {patient.hba1c}%
                          </span>
                        </td>
                        <td>
                          <span className={getStatusBadge(patient.status)}>
                            {patient.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {patient.reportsCount} reports
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/clinic/patients/${patient.id}`}
                              className="btn btn-outline-primary"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <button
                              className="btn btn-outline-success"
                              title="Send Message"
                              onClick={() => addNotification({
                                type: 'info',
                                message: `Message feature coming soon for ${patient.name}`
                              })}
                            >
                              <i className="fas fa-envelope"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No patients found</h5>
              <p className="text-muted mb-0">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No patients have been added yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {filteredPatients.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h5 className="text-success">
                  {filteredPatients.filter(p => p.status === 'stable').length}
                </h5>
                <small className="text-muted">Stable Patients</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h5 className="text-warning">
                  {filteredPatients.filter(p => p.status === 'warning').length}
                </h5>
                <small className="text-muted">Need Attention</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h5 className="text-danger">
                  {filteredPatients.filter(p => p.status === 'critical').length}
                </h5>
                <small className="text-muted">Critical</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h5 className="text-info">
                  {filteredPatients.reduce((sum, p) => sum + p.reportsCount, 0)}
                </h5>
                <small className="text-muted">Total Reports</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;