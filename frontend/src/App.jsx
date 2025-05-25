/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components - Fixed import paths
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Import the routing system - Fixed path
import AppRoutes from './routes.jsx';

// API service - Fixed import to use static import
import { apiService } from './services/api.js';

// App Context for global state management
export const AppContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Initialize app and check authentication
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setError(null);
      
      // Check if user is logged in (using React state instead of localStorage)
      // Note: localStorage is not supported in Claude artifacts
      // In a real app, you would use: const savedUser = localStorage.getItem('user');
      const savedUser = null; // Placeholder for localStorage functionality
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          // Only fetch reports if apiService is available
          if (apiService && typeof apiService.getReports === 'function') {
            await fetchUserReports();
          }
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError);
          // In real app: localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
      setError('Failed to initialize application');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReports = async () => {
    try {
      if (apiService && typeof apiService.getReports === 'function') {
        const userReports = await apiService.getReports();
        setReports(Array.isArray(userReports) ? userReports : []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load reports'
      });
    }
  };

  const handleLogin = async (credentials) => {
    try {
      if (!apiService || typeof apiService.login !== 'function') {
        return { success: false, error: 'API service not available' };
      }

      const response = await apiService.login(credentials);
      
      if (response && response.user) {
        setUser(response.user);
        // In real app: localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          // In real app: localStorage.setItem('token', response.token);
        }
        await fetchUserReports();
        return { success: true };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const handleLogout = () => {
    try {
      setUser(null);
      setReports([]);
      setNotifications([]);
      // In real app: localStorage.removeItem('user');
      // In real app: localStorage.removeItem('token');
      
      // Call API logout if available
      if (apiService && typeof apiService.logout === 'function') {
        apiService.logout().catch(console.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUploadSuccess = (newReport) => {
    try {
      if (newReport && typeof newReport === 'object') {
        setReports(prev => Array.isArray(prev) ? [newReport, ...prev] : [newReport]);
        addNotification({
          type: 'success',
          message: 'Report uploaded and analyzed successfully!',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error handling upload success:', error);
    }
  };

  const addNotification = (notification) => {
    try {
      if (!notification || typeof notification !== 'object') return;
      
      const id = Date.now() + Math.random();
      const newNotification = { 
        ...notification, 
        id,
        timestamp: notification.timestamp || new Date().toISOString()
      };
      
      setNotifications(prev => Array.isArray(prev) ? [...prev, newNotification] : [newNotification]);
      
      // Auto remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => 
          Array.isArray(prev) ? prev.filter(n => n.id !== id) : []
        );
      }, 5000);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const contextValue = {
    user,
    setUser,
    reports: Array.isArray(reports) ? reports : [],
    setReports,
    notifications: Array.isArray(notifications) ? notifications : [],
    addNotification,
    handleLogin,
    handleLogout,
    handleUploadSuccess,
    fetchUserReports,
    error
  };

  // Show loading spinner during app initialization
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading DiabetesMonitor...</h5>
        </div>
      </div>
    );
  }

  // Show error if initialization failed
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="App min-vh-100 d-flex flex-column">
          {/* Navigation - Show for all authenticated users */}
          {user && <Navbar />}
          
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
                  role="alert"
                >
                  {notification.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setNotifications(prev => 
                      Array.isArray(prev) ? prev.filter(n => n.id !== notification.id) : []
                    )}
                  ></button>
                </div>
              ))}
            </div>
          )}

          {/* Main Content - Use the comprehensive routing system */}
          <main className="flex-grow-1">
            <AppRoutes user={user} />
          </main>

          {/* Footer - Show for all authenticated users */}
          {user && <Footer />}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;