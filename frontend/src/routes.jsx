import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Create a loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Create placeholder components for missing ones
const PlaceholderComponent = ({ name }) => (
  <div className="container mt-4">
    <div className="alert alert-info">
      <h4 className="alert-heading">Component: {name}</h4>
      <p>This component is under development. Please create the {name} component in the appropriate directory.</p>
      <hr />
      <p className="mb-0">
        <small>Location: <code>src/pages/{name}.jsx</code></small>
      </p>
    </div>
  </div>
);

// Lazy load existing components with error boundaries and correct paths
const Home = lazy(() => 
  import('./pages/Home.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="Home" /> 
  }))
);

const Login = lazy(() => 
  import('./pages/Login.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="Login" /> 
  }))
);

const Dashboard = lazy(() => 
  import('./pages/Dashboard.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="Dashboard" /> 
  }))
);

const Upload = lazy(() => 
  import('./pages/Upload.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="Upload" /> 
  }))
);

const Settings = lazy(() => 
  import('./pages/Settings.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="Settings" /> 
  }))
);

const Help = lazy(() => 
  import('./pages/help.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="Help" /> 
  }))
);

const NotFound = lazy(() => 
  import('./pages/NotFound.jsx').catch(() => ({ 
    default: () => (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h1 className="display-1 text-muted">404</h1>
            <h2>Page Not Found</h2>
            <p className="text-muted">The page you're looking for doesn't exist.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }))
);

// Lazy load clinic components
const ClinicDashboard = lazy(() => 
  import('./pages/clinic/ClinicDashboard.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="ClinicDashboard" /> 
  }))
);

const PatientList = lazy(() => 
  import('./pages/clinic/PatientList.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="PatientList" /> 
  }))
);

const PatientDetail = lazy(() => 
  import('./pages/clinic/PatientDetail.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="PatientDetail" /> 
  }))
);

// Lazy load government components
const GovDashboard = lazy(() => 
  import('./pages/government/GovDashboard.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="GovDashboard" /> 
  }))
);

const PopulationInsights = lazy(() => 
  import('./pages/government/PopulationInsights.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="PopulationInsights" /> 
  }))
);

const HealthTrends = lazy(() => 
  import('./pages/government/HealthTrends.jsx').catch(() => ({ 
    default: () => <PlaceholderComponent name="HealthTrends" /> 
  }))
);

// Create fallback components for missing imports that don't have files yet
const Register = () => <PlaceholderComponent name="Register" />;
const Profile = () => <PlaceholderComponent name="Profile" />;
const Reports = () => <PlaceholderComponent name="Reports" />;
const ReportDetail = () => <PlaceholderComponent name="ReportDetail" />;

// Protected Route Component
const ProtectedRoute = ({ children, user, requiredRole = null }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// Role-based Route Component
const RoleBasedRoute = ({ children, user, allowedRoles = [] }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// Main Routes Component
const AppRoutes = ({ user }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Home />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Protected Routes - Common for all users */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              {user?.userType === 'clinic' ? <ClinicDashboard /> :
               user?.userType === 'government' ? <GovDashboard /> :
               <Dashboard />}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute user={user}>
              <Upload />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute user={user}>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* Patient specific routes */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute user={user} requiredRole="patient">
              <Reports />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports/:id" 
          element={
            <ProtectedRoute user={user}>
              <ReportDetail />
            </ProtectedRoute>
          } 
        />

        {/* Clinic specific routes */}
        <Route 
          path="/clinic/*" 
          element={
            <RoleBasedRoute user={user} allowedRoles={['clinic']}>
              <Routes>
                <Route path="dashboard" element={<ClinicDashboard />} />
                <Route path="patients" element={<PatientList />} />
                <Route path="patients/:id" element={<PatientDetail />} />
                <Route path="*" element={<Navigate to="/clinic/dashboard" replace />} />
              </Routes>
            </RoleBasedRoute>
          } 
        />

        {/* Government specific routes */}
        <Route 
          path="/government/*" 
          element={
            <RoleBasedRoute user={user} allowedRoles={['government']}>
              <Routes>
                <Route path="dashboard" element={<GovDashboard />} />
                <Route path="population" element={<PopulationInsights />} />
                <Route path="trends" element={<HealthTrends />} />
                <Route path="*" element={<Navigate to="/government/dashboard" replace />} />
              </Routes>
            </RoleBasedRoute>
          } 
        />

        {/* Help and Support */}
        <Route path="/help" element={<Help />} />

        {/* 404 and Catch-all */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

// Route configuration object for easier management
export const routeConfig = {
  public: [
    { path: '/', component: 'Home', exact: true },
    { path: '/login', component: 'Login' },
    { path: '/register', component: 'Register' },
    { path: '/help', component: 'Help' }
  ],
  protected: [
    { path: '/dashboard', component: 'Dashboard', roles: ['patient', 'clinic', 'government'] },
    { path: '/upload', component: 'Upload', roles: ['patient'] },
    { path: '/profile', component: 'Profile', roles: ['patient', 'clinic', 'government'] },
    { path: '/settings', component: 'Settings', roles: ['patient', 'clinic', 'government'] },
    { path: '/reports', component: 'Reports', roles: ['patient'] },
    { path: '/reports/:id', component: 'ReportDetail', roles: ['patient', 'clinic'] }
  ],
  clinic: [
    { path: '/clinic/dashboard', component: 'ClinicDashboard' },
    { path: '/clinic/patients', component: 'PatientList' },
    { path: '/clinic/patients/:id', component: 'PatientDetail' }
  ],
  government: [
    { path: '/government/dashboard', component: 'GovDashboard' },
    { path: '/government/population', component: 'PopulationInsights' },
    { path: '/government/trends', component: 'HealthTrends' }
  ]
};

// Navigation helper functions
export const getDefaultRoute = (userType) => {
  switch (userType) {
    case 'clinic':
      return '/clinic/dashboard';
    case 'government':
      return '/government/dashboard';
    default:
      return '/dashboard';
  }
};

export const isRouteAllowed = (path, userType) => {
  // Check if route is public
  if (routeConfig.public.some(route => route.path === path)) {
    return true;
  }
  
  // Check protected routes
  const protectedRoute = routeConfig.protected.find(route => route.path === path);
  if (protectedRoute) {
    return protectedRoute.roles.includes(userType);
  }
  
  // Check role-specific routes
  if (path.startsWith('/clinic/')) {
    return userType === 'clinic';
  }
  
  if (path.startsWith('/government/')) {
    return userType === 'government';
  }
  
  return false;
};

export { ProtectedRoute, RoleBasedRoute };
export default AppRoutes;