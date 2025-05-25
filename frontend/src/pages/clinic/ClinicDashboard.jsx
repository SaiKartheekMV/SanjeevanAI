import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { apiService } from '../../services/api';

const ClinicDashboard = () => {
  const { user, addNotification } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    recentReports: 0,
    criticalAlerts: 0,
    monthlyGrowth: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashData, patients, alerts] = await Promise.all([
        apiService.getDashboardData().catch(() => ({
          totalPatients: 156,
          recentReports: 23,
          criticalAlerts: 3,
          monthlyGrowth: 12
        })),
        apiService.getPatientReports('recent').catch(() => [
          { id: 1, name: 'John Doe', lastVisit: '2025-05-20', status: 'stable' },
          { id: 2, name: 'Jane Smith', lastVisit: '2025-05-19', status: 'critical' },
          { id: 3, name: 'Mike Johnson', lastVisit: '2025-05-18', status: 'improving' }
        ]),
        fetchCriticalAlerts().catch(() => [
          { id: 1, patient: 'Jane Smith', message: 'HbA1c levels critically high', time: '2 hours ago' },
          { id: 2, patient: 'Robert Brown', message: 'Missed medication schedule', time: '4 hours ago' }
        ])
      ]);

      setDashboardData(dashData);
      setRecentPatients(patients.slice(0, 5));
      setCriticalAlerts(alerts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCriticalAlerts = async () => {
    // Mock implementation - replace with actual API call
    return [
      { id: 1, patient: 'Jane Smith', message: 'HbA1c levels critically high', time: '2 hours ago' },
      { id: 2, patient: 'Robert Brown', message: 'Missed medication schedule', time: '4 hours ago' }
    ];
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      stable: 'bg-success',
      improving: 'bg-info',
      critical: 'bg-danger',
      warning: 'bg-warning'
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
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
          <h1 className="h3 mb-1">Clinic Dashboard</h1>
          <p className="text-muted mb-0">Welcome back, Dr. {user?.name || 'Clinic'}</p>
        </div>
        <Link to="/clinic/patients" className="btn btn-primary">
          <i className="fas fa-users me-2"></i>
          View All Patients
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="mb-1">{dashboardData.totalPatients}</h3>
              <p className="text-muted mb-0">Total Patients</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="fas fa-file-medical fa-2x"></i>
              </div>
              <h3 className="mb-1">{dashboardData.recentReports}</h3>
              <p className="text-muted mb-0">New Reports</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-danger mb-2">
                <i className="fas fa-exclamation-triangle fa-2x"></i>
              </div>
              <h3 className="mb-1">{dashboardData.criticalAlerts}</h3>
              <p className="text-muted mb-0">Critical Alerts</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="fas fa-chart-line fa-2x"></i>
              </div>
              <h3 className="mb-1">+{dashboardData.monthlyGrowth}%</h3>
              <p className="text-muted mb-0">Monthly Growth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Patients */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Patients</h5>
              <Link to="/clinic/patients" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              {recentPatients.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Patient Name</th>
                        <th>Last Visit</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map((patient) => (
                        <tr key={patient.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-3">
                                <i className="fas fa-user text-muted"></i>
                              </div>
                              <strong>{patient.name}</strong>
                            </div>
                          </td>
                          <td className="text-muted">{patient.lastVisit}</td>
                          <td>
                            <span className={getStatusBadge(patient.status)}>
                              {patient.status}
                            </span>
                          </td>
                          <td>
                            <Link 
                              to={`/clinic/patients/${patient.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No recent patients found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Critical Alerts
              </h5>
            </div>
            <div className="card-body">
              {criticalAlerts.length > 0 ? (
                <div className="space-y-3">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="border-start border-danger border-3 ps-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong className="d-block">{alert.patient}</strong>
                          <p className="text-muted mb-1 small">{alert.message}</p>
                          <small className="text-muted">{alert.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                  <p className="text-muted mb-0">No critical alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/clinic/patients" className="btn btn-outline-primary w-100">
                    <i className="fas fa-users me-2"></i>
                    Manage Patients
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/upload" className="btn btn-outline-success w-100">
                    <i className="fas fa-upload me-2"></i>
                    Upload Report
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100">
                    <i className="fas fa-chart-bar me-2"></i>
                    View Analytics
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/settings" className="btn btn-outline-secondary w-100">
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;