/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

const Settings = () => {
  const { user, setUser, addNotification } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.language || 'en',
    notifications: user?.notifications || true,
    darkMode: user?.darkMode || false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user context
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      addNotification({
        type: 'success',
        message: 'Settings updated successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to update settings'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      addNotification({
        type: 'error',
        message: 'Account deletion feature will be available soon'
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Settings
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSave}>
                {/* Profile Information */}
                <div className="mb-4">
                  <h5 className="text-secondary border-bottom pb-2">Profile Information</h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div className="mb-4">
                  <h5 className="text-secondary border-bottom pb-2">Preferences</h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Language</label>
                      <select
                        className="form-select"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="kn">Kannada</option>
                        <option value="ml">Malayalam</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="notifications"
                      id="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="notifications">
                      Enable email notifications
                    </label>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="darkMode"
                      id="darkMode"
                      checked={formData.darkMode}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="darkMode">
                      Enable dark mode
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleDeleteAccount}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="card shadow-sm mt-4">
            <div className="card-header">
              <h5 className="mb-0">Data & Privacy</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <button className="btn btn-outline-info w-100 mb-2">
                    <i className="fas fa-download me-2"></i>
                    Export My Data
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-warning w-100 mb-2">
                    <i className="fas fa-shield-alt me-2"></i>
                    Privacy Settings
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

export default Settings;