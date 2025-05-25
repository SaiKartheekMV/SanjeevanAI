/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../App';
import { apiService } from '../../services/api';

const HealthTrends = () => {
  const { addNotification } = useContext(AppContext);
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('diabetes');
  const [loading, setLoading] = useState(true);
  const [trendsData, setTrendsData] = useState({
    diabetes: [],
    hypertension: [],
    obesity: [],
    demographics: [],
    riskLevels: []
  });

  // Mock data for demonstration
  const mockData = {
    diabetes: [
      { month: 'Jan', cases: 1200, newCases: 45, riskLevel: 15 },
      { month: 'Feb', cases: 1245, newCases: 52, riskLevel: 18 },
      { month: 'Mar', cases: 1290, newCases: 48, riskLevel: 22 },
      { month: 'Apr', cases: 1335, newCases: 55, riskLevel: 19 },
      { month: 'May', cases: 1380, newCases: 62, riskLevel: 25 },
      { month: 'Jun', cases: 1425, newCases: 58, riskLevel: 23 }
    ],
    hypertension: [
      { month: 'Jan', cases: 2100, newCases: 75, riskLevel: 45 },
      { month: 'Feb', cases: 2165, newCases: 82, riskLevel: 48 },
      { month: 'Mar', cases: 2230, newCases: 78, riskLevel: 52 },
      { month: 'Apr', cases: 2295, newCases: 85, riskLevel: 49 },
      { month: 'May', cases: 2360, newCases: 92, riskLevel: 55 },
      { month: 'Jun', cases: 2425, newCases: 88, riskLevel: 53 }
    ],
    obesity: [
      { month: 'Jan', cases: 890, newCases: 35, riskLevel: 12 },
      { month: 'Feb', cases: 920, newCases: 42, riskLevel: 15 },
      { month: 'Mar', cases: 950, newCases: 38, riskLevel: 18 },
      { month: 'Apr', cases: 980, newCases: 45, riskLevel: 16 },
      { month: 'May', cases: 1010, newCases: 52, riskLevel: 22 },
      { month: 'Jun', cases: 1040, newCases: 48, riskLevel: 20 }
    ]
  };

  useEffect(() => {
    fetchTrendsData();
  }, [fetchTrendsData, timeRange]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTrendsData = useCallback(async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch from API
      // const data = await apiService.getHealthMetrics(timeRange);
      
      // Using mock data for now
      setTimeout(() => {
        setTrendsData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching trends data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load health trends data'
      });
      setLoading(false);
    }
  });

  const currentData = trendsData[selectedMetric] || [];
  const latestData = currentData[currentData.length - 1] || {};
  const previousData = currentData[currentData.length - 2] || {};

  const calculateTrend = (current, previous) => {
    if (!previous || !current) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const MetricCard = ({ title, current, previous, icon, color }) => {
    const trend = calculateTrend(current, previous);
    return (
      <div className="col-md-4 mb-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">{title}</h6>
                <h4 className={`text-${color} mb-1`}>{current?.toLocaleString() || 0}</h4>
                <small className={`text-${trend >= 0 ? 'danger' : 'success'}`}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                </small>
              </div>
              <i className={`fas fa-${icon} text-${color} fs-1 opacity-50`}></i>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading trends...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/government/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Health Trends</li>
                </ol>
              </nav>
              <h2 className="text-primary mb-1">Health Trends Analysis</h2>
              <p className="text-muted mb-0">Track health condition patterns over time</p>
            </div>
            <div className="d-flex gap-2">
              <select 
                className="form-select"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
                <option value="2y">Last 2 Years</option>
              </select>
              <button 
                className="btn btn-outline-primary"
                onClick={fetchTrendsData}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <MetricCard 
          title="Total Cases"
          current={latestData.cases}
          previous={previousData.cases}
          icon="users"
          color="primary"
        />
        <MetricCard 
          title="New Cases"
          current={latestData.newCases}
          previous={previousData.newCases}
          icon="plus-circle"
          color="info"
        />
        <MetricCard 
          title="High Risk"
          current={latestData.riskLevel}
          previous={previousData.riskLevel}
          icon="exclamation-triangle"
          color="warning"
        />
      </div>

      {/* Chart Controls */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <span className="fw-bold me-3">Health Condition:</span>
                {['diabetes', 'hypertension', 'obesity'].map(metric => (
                  <button
                    key={metric}
                    className={`btn btn-sm ${selectedMetric === metric ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        {/* Total Cases Trend */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2 text-primary"></i>
                Total Cases Trend
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#0d6efd" 
                    fill="#0d6efd" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New Cases vs Risk Level */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2 text-success"></i>
                New Cases vs High Risk
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newCases" fill="#198754" name="New Cases" />
                  <Bar dataKey="riskLevel" fill="#dc3545" name="High Risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-area me-2 text-info"></i>
                All Conditions Comparison
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#0d6efd" 
                    strokeWidth={2}
                    data={trendsData.diabetes}
                    name="Diabetes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#198754" 
                    strokeWidth={2}
                    data={trendsData.hypertension}
                    name="Hypertension"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#ffc107" 
                    strokeWidth={2}
                    data={trendsData.obesity}
                    name="Obesity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2 text-warning"></i>
                Key Insights
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">Trends Identified:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-arrow-up text-danger me-2"></i>Diabetes cases increased by 15% this quarter</li>
                    <li><i className="fas fa-arrow-up text-warning me-2"></i>High-risk patients up by 8%</li>
                    <li><i className="fas fa-arrow-down text-success me-2"></i>New obesity cases decreased by 5%</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">Recommendations:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Increase diabetes screening programs</li>
                    <li><i className="fas fa-check text-success me-2"></i>Focus on preventive care initiatives</li>
                    <li><i className="fas fa-check text-success me-2"></i>Enhance community health education</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-download me-2 text-info"></i>
                Export Options
              </h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-primary w-100 mb-2">
                <i className="fas fa-file-pdf me-2"></i>
                Export as PDF
              </button>
              <button className="btn btn-outline-success w-100 mb-2">
                <i className="fas fa-file-excel me-2"></i>
                Export as Excel
              </button>
              <button className="btn btn-outline-info w-100">
                <i className="fas fa-share me-2"></i>
                Share Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTrends;