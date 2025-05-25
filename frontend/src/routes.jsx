import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';



// Clinic specific pages
import ClinicDashboard from './pages/clinic/ClinicDashboard';
import PatientList from './pages/clinic/PatientList';
import PatientDetail from './pages/clinic/PatientDetail';

// Government specific pages
import GovDashboard from './pages/government/GovDashboard';
import PopulationInsights from './pages/government/PopulationInsights';
import HealthTrends from './pages/government/HealthTrends';

// Other pages
import Settings from './pages/Settings';
import Help from './pages/help';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, user, requiredRole = null }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Role-based Route Component
const RoleBasedRoute = ({ children, user, allowedRoles = [] }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main Routes Component
const AppRoutes = ({ user }) => {
  return (
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