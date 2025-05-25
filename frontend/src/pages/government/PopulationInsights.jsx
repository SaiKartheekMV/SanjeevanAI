/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../App';

const PopulationInsights = () => {
  const { addNotification } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: 'all',
    ageGroup: 'all',
    gender: 'all',
    condition: 'all'
  });
  const [populationData, setPopulationData] = useState({
    demographics: [],
    conditions: [],
    regional: [],
    riskDistribution: [],
    summary: {
      totalPopulation: 0,
      healthyIndividuals: 0,
      atRiskPopulation: 0,
      criticalCases: 0
    }
  });

  // Mock data for demonstration
  const mockData = {
    demographics: [
      { ageGroup: '0-18', male: 1200, female: 1180, total: 2380 },
      { ageGroup: '19-35', male: 2100, female: 2050, total: 4150 },
      { ageGroup: '36-50', male: 1800, female: 1750, total: 3550 },
      { ageGroup: '51-65', male: 1400, female: 1450, total: 2850 },
      { ageGroup: '65+', male: 800, female: 900, total: 1700 }
    ],
    conditions: [
      { name: 'Healthy', value: 8500, color: '#28a745' },
      { name: 'Diabetes', value: 1425, color: '#ffc107' },
      { name: 'Hypertension', value: 2425, color: '#fd7e14' },
      { name: 'Obesity', value: 1040, color: '#dc3545' },
      { name: 'Multiple Conditions', value: 640, color: '#6f42c1' }
    ],
    regional: [
      { region: 'North District', population: 3200, diabetes: 280, hypertension: 450, obesity: 180 },
      { region: 'South District', population: 2800, diabetes: 320, hypertension: 380, obesity: 220 },
      { region: 'East District', population: 3500, diabetes: 410, hypertension: 520, obesity: 280 },
      { region: 'West District', population: 2900, diabetes: 290, hypertension: 420, obesity: 190 },
      { region: 'Central District', population: 4100, diabetes: 480, hypertension: 655, obesity: 310 }
    ],
    riskDistribution: [
      { risk: 'Low Risk', count: 9200, percentage: 65.4 },
      { risk: 'Moderate Risk', count: 3150, percentage: 22.4 },
      { risk: 'High Risk', count: 1450, percentage: 10.3 },
      { risk: 'Critical', count: 260, percentage: 1.9 }
    ],
    summary: {
      totalPopulation: 14060,
      healthyIndividuals: 8500,
      atRiskPopulation: 4800,
      criticalCases: 760
    }
  };

  useEffect(() => {
    fetchPopulationData();
  }, [fetchPopulationData, filters]);

  // eslint-disable-next-line no-undef
  const fetchPopulationData = useCallback(async () => {
    setLoading(true);
    try {
      // In real implementation: const data = await apiService.getPopulationData(filters);
      setTimeout(() => {
        setPopulationData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching population data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load population insights'
      });
      setLoading(false);
    }
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const SummaryCard = ({ title, value, icon, color, subtitle }) => (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm border-start-4" style={{ borderLeftColor: `var(--bs-${color})` }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-2">{title}</h6>
              <h3 className={`text-${color} mb-1`}>{value.toLocaleString()}</h3>
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
            <div className={`text-${color} fs-1 opacity-50`}>
              <i className={`fas fa-${icon}`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading population insights...</span>
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
                  <li className="breadcrumb-item active">Population Insights</li>
                </ol>
              </nav>
              <h2 className="text-primary mb-1">Population Health Insights</h2>
              <p className="text-muted mb-0">Comprehensive demographic and health analysis</p>
            </div>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchPopulationData}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-bold">Region</label>
                  <select 
                    className="form-select"
                    value={filters.region}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                  >
                    <option value="all">All Regions</option>
                    <option value="north">North District</option>
                    <option value="south">South District</option>
                    <option value="east">East District</option>
                    <option value="west">West District</option>
                    <option value="central">Central District</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Age Group</label>
                  <select 
                    className="form-select"
                    value={filters.ageGroup}
                    onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                  >
                    <option value="all">All Ages</option>
                    <option value="0-18">0-18 years</option>
                    <option value="19-35">19-35 years</option>
                    <option value="36-50">36-50 years</option>
                    <option value="51-65">51-65 years</option>
                    <option value="65+">65+ years</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Gender</label>
                  <select 
                    className="form-select"
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Health Condition</label>
                  <select 
                    className="form-select"
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                  >
                    <option value="all">All Conditions</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="hypertension">Hypertension</option>
                    <option value="obesity">Obesity</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="row mb-4">
        <SummaryCard 
          title="Total Population"
          value={populationData.summary.totalPopulation}
          icon="users"
          color="primary"
          subtitle="Registered individuals"
        />
        <SummaryCard 
          title="Healthy Individuals"
          value={populationData.summary.healthyIndividuals}
          icon="heart"
          color="success"
          subtitle={`${((populationData.summary.healthyIndividuals / populationData.summary.totalPopulation) * 100).toFixed(1)}% of population`}
        />
        <SummaryCard 
          title="At-Risk Population"
          value={populationData.summary.atRiskPopulation}
          icon="exclamation-triangle"
          color="warning"
          subtitle={`${((populationData.summary.atRiskPopulation / populationData.summary.totalPopulation) * 100).toFixed(1)}% of population`}
        />
        <SummaryCard 
          title="Critical Cases"
          value={populationData.summary.criticalCases}
          icon="ambulance"
          color="danger"
          subtitle="Require immediate attention"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="row mb-4">
        {/* Demographics Chart */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2 text-primary"></i>
                Population Demographics by Age Group
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={populationData.demographics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#0d6efd" name="Male" />
                  <Bar dataKey="female" fill="#e83e8c" name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Health Conditions Pie Chart */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2 text-success"></i>
                Health Conditions Distribution
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={populationData.conditions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {populationData.conditions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row mb-4">
        {/* Regional Analysis */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-map-marked-alt me-2 text-info"></i>
                Regional Health Analysis
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={populationData.regional}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="diabetes" fill="#ffc107" name="Diabetes" />
                  <Bar dataKey="hypertension" fill="#fd7e14" name="Hypertension" />
                  <Bar dataKey="obesity" fill="#dc3545" name="Obesity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-shield-alt me-2 text-warning"></i>
                Risk Level Distribution
              </h5>
            </div>
            <div className="card-body">
              {populationData.riskDistribution.map((risk, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">{risk.risk}</span>
                    <span className="badge bg-secondary">{risk.count.toLocaleString()}</span>
                  </div>
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className={`progress-bar ${
                        risk.risk === 'Low Risk' ? 'bg-success' :
                        risk.risk === 'Moderate Risk' ? 'bg-warning' :
                        risk.risk === 'High Risk' ? 'bg-danger' : 'bg-dark'
                      }`}
                      style={{ width: `${risk.percentage}%` }}
                    >
                      {risk.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-table me-2 text-secondary"></i>
                Regional Breakdown
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Region</th>
                      <th>Total Population</th>
                      <th>Diabetes Cases</th>
                      <th>Hypertension Cases</th>
                      <th>Obesity Cases</th>
                      <th>Overall Risk %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {populationData.regional.map((region, index) => {
                      const totalCases = region.diabetes + region.hypertension + region.obesity;
                      const riskPercentage = ((totalCases / region.population) * 100).toFixed(1);
                      return (
                        <tr key={index}>
                          <td className="fw-bold">{region.region}</td>
                          <td>{region.population.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-warning me-1">{region.diabetes}</span>
                            <small className="text-muted">
                              ({((region.diabetes / region.population) * 100).toFixed(1)}%)
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-danger me-1">{region.hypertension}</span>
                            <small className="text-muted">
                              ({((region.hypertension / region.population) * 100).toFixed(1)}%)
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-info me-1">{region.obesity}</span>
                            <small className="text-muted">
                              ({((region.obesity / region.population) * 100).toFixed(1)}%)
                            </small>
                          </td>
                          <td>
                            <span className={`badge ${
                              riskPercentage < 15 ? 'bg-success' :
                              riskPercentage < 25 ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {riskPercentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-tasks me-2 text-success"></i>
                Key Insights & Recommendations
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">Population Insights:</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-info-circle text-info me-2"></i>
                      East District has the highest case count (410 diabetes cases)
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-info-circle text-info me-2"></i>
                      Age group 19-35 represents largest demographic (29.5%)
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-info-circle text-info me-2"></i>
                      60.5% of population is healthy with no major conditions
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success mb-3">Action Items:</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Increase screening programs in East District
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Focus prevention efforts on 19-35 age group
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Implement targeted interventions for high-risk areas
                    </li>
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
                <i className="fas fa-download me-2 text-primary"></i>
                Export & Share
              </h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-primary w-100 mb-2">
                <i className="fas fa-file-pdf me-2"></i>
                Generate PDF Report
              </button>
              <button className="btn btn-outline-success w-100 mb-2">
                <i className="fas fa-file-excel me-2"></i>
                Export to Excel
              </button>
              <button className="btn btn-outline-info w-100 mb-2">
                <i className="fas fa-chart-line me-2"></i>
                Create Presentation
              </button>
              <button className="btn btn-outline-warning w-100">
                <i className="fas fa-share-alt me-2"></i>
                Share Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationInsights;