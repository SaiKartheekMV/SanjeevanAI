/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { apiService } from '../services/api';
import ReportCard from '../components/ReportCard';

const Dashboard = () => {
  const { user, reports, addNotification, fetchUserReports } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    lastUpload: null,
    avgGlucose: 0,
    riskLevel: 'normal',
    trends: []
  });
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // days

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      calculateStats();
      prepareChartData();
    }
  }, [calculateStats, prepareChartData, reports, selectedPeriod]);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      await fetchUserReports();
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!reports || reports.length === 0) return;

    const sortedReports = [...reports].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    const recentReports = sortedReports.filter(report => {
      const reportDate = new Date(report.uploadDate);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(selectedPeriod));
      return reportDate >= cutoffDate;
    });

    // Calculate average glucose from recent reports
    const glucoseValues = recentReports
      .filter(report => report.analysis?.glucose)
      .map(report => parseFloat(report.analysis.glucose));
    
    const avgGlucose = glucoseValues.length > 0 
      ? glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length 
      : 0;

    // Determine risk level
    let riskLevel = 'normal';
    if (avgGlucose > 200) riskLevel = 'high';
    else if (avgGlucose > 140) riskLevel = 'moderate';

    setStats({
      totalReports: reports.length,
      lastUpload: sortedReports[0]?.uploadDate || null,
      avgGlucose: Math.round(avgGlucose),
      riskLevel,
      trends: recentReports.slice(0, 5)
    });
  };

  const prepareChartData = () => {
    if (!reports || reports.length === 0) return;

    const sortedReports = [...reports]
      .filter(report => report.analysis?.glucose)
      .sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate))
      .slice(-10); // Last 10 reports

    const data = sortedReports.map(report => ({
      date: new Date(report.uploadDate).toLocaleDateString(),
      glucose: parseFloat(report.analysis.glucose),
      target: 140 // Target glucose level
    }));

    setChartData(data);
  };

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'high': return 'badge bg-danger';
      case 'moderate': return 'badge bg-warning';
      default: return 'badge bg-success';
    }
  };

  const getGlucoseStatusColor = (glucose) => {
    if (glucose > 200) return 'text-danger';
    if (glucose > 140) return 'text-warning';
    return 'text-success';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h2 className="h3 mb-1">Welcome back, {user?.name || 'User'}!</h2>
              <p className="text-muted mb-0">Here's your health overview</p>
            </div>
            <Link to="/upload" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Upload New Report
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Total Reports</h6>
                  <h3 className="mb-0">{stats.totalReports}</h3>
                </div>
                <i className="fas fa-file-medical fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Avg Glucose</h6>
                  <h3 className="mb-0">{stats.avgGlucose} <small>mg/dL</small></h3>
                </div>
                <i className="fas fa-tint fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Risk Level</h6>
                  <span className={getRiskBadgeClass(stats.riskLevel)}>
                    {stats.riskLevel.toUpperCase()}
                  </span>
                </div>
                <i className="fas fa-exclamation-triangle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Last Upload</h6>
                  <small>
                    {stats.lastUpload 
                      ? new Date(stats.lastUpload).toLocaleDateString()
                      : 'No uploads yet'
                    }
                  </small>
                </div>
                <i className="fas fa-calendar fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line text-primary me-2"></i>
                  Glucose Trends
                </h5>
                <select 
                  className="form-select form-select-sm w-auto"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>
              <div className="card-body">
                <div className="row">
                  {chartData.map((point, index) => (
                    <div key={index} className="col-2 text-center mb-3">
                      <div className="d-flex flex-column align-items-center">
                        <div 
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white mb-2"
                          style={{ 
                            width: '40px', 
                            height: '40px',
                            backgroundColor: point.glucose > 140 ? '#dc3545' : point.glucose > 100 ? '#ffc107' : '#28a745'
                          }}
                        >
                          <small className="fw-bold">{point.glucose}</small>
                        </div>
                        <small className="text-muted">{point.date}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="row text-center">
                    <div className="col-4">
                      <span className="badge bg-success me-2"></span>
                      <small>Normal (&lt;100)</small>
                    </div>
                    <div className="col-4">
                      <span className="badge bg-warning me-2"></span>
                      <small>Elevated (100-140)</small>
                    </div>
                    <div className="col-4">
                      <span className="badge bg-danger me-2"></span>
                      <small>High (&gt;140)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reports & Quick Actions */}
      <div className="row">
        {/* Recent Reports */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="mb-0">
                <i className="fas fa-history text-primary me-2"></i>
                Recent Reports
              </h5>
            </div>
            <div className="card-body">
              {reports.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-file-upload fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">No reports uploaded yet</h6>
                  <p className="text-muted mb-3">Upload your first diabetes report to get started</p>
                  <Link to="/upload" className="btn btn-primary">
                    Upload Report
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {reports.slice(0, 6).map((report) => (
                    <div key={report.id} className="col-md-6">
                      <ReportCard report={report} />
                    </div>
                  ))}
                </div>
              )}
              
              {reports.length > 6 && (
                <div className="text-center mt-3">
                  <button className="btn btn-outline-primary">
                    View All Reports ({reports.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0">
                <i className="fas fa-bolt text-warning me-2"></i>
                Quick Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/upload" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-upload me-2"></i>
                  Upload New Report
                </Link>
                <button className="btn btn-outline-success btn-sm" onClick={() => {}}>
                  <i className="fas fa-download me-2"></i>
                  Export Data
                </button>
                <button className="btn btn-outline-info btn-sm" onClick={() => {}}>
                  <i className="fas fa-bell me-2"></i>
                  Set Reminders
                </button>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                Health Tips
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0">
                    <i className="fas fa-utensils text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Monitor Carbs</h6>
                    <small className="text-muted">Track carbohydrate intake to better manage blood sugar levels.</small>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0">
                    <i className="fas fa-walking text-success"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Stay Active</h6>
                    <small className="text-muted">Regular exercise helps improve insulin sensitivity.</small>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="d-flex">
                  <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0">
                    <i className="fas fa-clock text-info"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Regular Testing</h6>
                    <small className="text-muted">Check blood sugar levels as recommended by your doctor.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;