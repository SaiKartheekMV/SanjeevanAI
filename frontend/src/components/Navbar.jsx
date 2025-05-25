import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const Navbar = () => {
  const { user, handleLogout } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-heartbeat me-2"></i>
          DiabetesMonitor
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!user ? (
              // Public Navigation
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/')}`} to="/">
                    <i className="fas fa-home me-1"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features">
                    <i className="fas fa-star me-1"></i>
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    <i className="fas fa-info-circle me-1"></i>
                    About
                  </a>
                </li>
              </>
            ) : (
              // Authenticated Navigation
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                    <i className="fas fa-tachometer-alt me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/upload')}`} to="/upload">
                    <i className="fas fa-upload me-1"></i>
                    Upload Report
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Side Navigation */}
          <ul className="navbar-nav">
            {!user ? (
              // Login Button for Guests
              <li className="nav-item">
                <Link className="btn btn-outline-light" to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
              </li>
            ) : (
              // User Menu for Authenticated Users
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="bg-light rounded-circle me-2 d-flex align-items-center justify-content-center" 
                       style={{ width: '32px', height: '32px' }}>
                    <i className="fas fa-user text-primary"></i>
                  </div>
                  <span className="d-none d-sm-inline">
                    {user?.name || user?.email || 'User'}
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="dropdown-header">
                      <small className="text-muted">Signed in as</small><br />
                      <strong>{user?.email}</strong>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="fas fa-chart-line me-2"></i>
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/upload">
                      <i className="fas fa-file-upload me-2"></i>
                      Upload New Report
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={() => {}}>
                      <i className="fas fa-cog me-2"></i>
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={() => {}}>
                      <i className="fas fa-question-circle me-2"></i>
                      Help
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a 
                      className="dropdown-item text-danger" 
                      href="#" 
                      onClick={handleLogoutClick}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;