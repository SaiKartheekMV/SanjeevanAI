/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { apiService } from '../../services/api';

const GovDashboard = () => {
  const { user, addNotification } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalClinics: 0,
    riskAlerts: 0,
    monthlyReports: 0,
    recentAlerts: [],
    healthMetrics: {
      diabetes: { total: 0, risk: 0 },
      hypertension: { total: 0, risk: 0 },
      obesity: { total: 0, risk: 0 }
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // eslint-disable-next-line no-undef
  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await apiService.getDashboardData();
      setDashboardData(data || dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title text-muted mb-2">{title}</h6>
              <h3 className={`mb-0 text-${color}`}>{value.toLocaleString()}</h3>
              {trend && (
                <small className={`text-${trend > 0 ? 'success' : 'danger'}`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </small>
              )}
            </div>
            <div className={`text-${color} fs-1 opacity-50`}>
              <i className={`fas fa-${icon}`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-1">Government Health Dashboard</h2>
              <p className="text-muted mb-0">Population health monitoring and insights</p>
            </div>
            <div>
              <button 
                className="btn btn-outline-primary me-2"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="row">
        <StatCard 
          title="Total Patients" 
          value={dashboardData.totalPatients} 
          icon="users" 
          color="primary"
          trend={5.2}
        />
        <StatCard 
          title="Registered Clinics" 
          value={dashboardData.totalClinics} 
          icon="hospital" 
          color="success"
          trend={2.1}
        />
        <StatCard 
          title="Active Risk Alerts" 
          value={dashboardData.riskAlerts} 
          icon="exclamation-triangle" 
          color="warning"
          trend={-3.4}
        />
        <StatCard 
          title="Monthly Reports" 
          value={dashboardData.monthlyReports} 
          icon="file-medical" 
          color="info"
          trend={8.7}
        />
      </div>

      {/* Health Conditions Overview */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2 text-primary"></i>
                Health Conditions Overview
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.entries(dashboardData.healthMetrics).map(([condition, data]) => (
                  <div key={condition} className="col-md-4 mb-3">
                    <div className="border rounded p-3 text-center">
                      <h6 className="text-capitalize mb-2">{condition}</h6>
                      <div className="mb-2">
                        <span className="badge bg-primary fs-6">{data.total}</span>
                        <small className="text-muted d-block">Total Cases</small>
                      </div>
                      <div>
                        <span className="badge bg-danger fs-6">{data.risk}</span>
                        <small className="text-muted d-block">High Risk</small>
                      </div>
                      <div className="progress mt-2" style={{ height: '4px' }}>
                        <div 
                          className="progress-bar bg-danger" 
                          style={{ width: `${(data.risk / data.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-bell me-2 text-warning"></i>
                Recent Alerts
              </h5>
            </div>
            <div className="card-body p-0">
              {dashboardData.recentAlerts.length > 0 ? (
                <div className="list-group list-group-flush">
                  {dashboardData.recentAlerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{alert.type || 'Health Alert'}</h6>
                        <small className="text-muted">{alert.time || '2 hours ago'}</small>
                      </div>
                      <p className="mb-1">{alert.message || 'New high-risk patient identified'}</p>
                      <small className="text-muted">{alert.location || 'District Hospital'}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted">
                  <i className="fas fa-check-circle fs-1 mb-3"></i>
                  <p>No recent alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-tasks me-2 text-success"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/government/population" className="btn btn-outline-primary w-100 h-100">
                    <i className="fas fa-users fs-1 mb-2 d-block"></i>
                    <span>Population Insights</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/government/trends" className="btn btn-outline-success w-100 h-100">
                    <i className="fas fa-chart-line fs-1 mb-2 d-block"></i>
                    <span>Health Trends</span>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100 h-100">
                    <i className="fas fa-download fs-1 mb-2 d-block"></i>
                    <span>Export Reports</span>
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100 h-100">
                    <i className="fas fa-cog fs-1 mb-2 d-block"></i>
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovDashboard;