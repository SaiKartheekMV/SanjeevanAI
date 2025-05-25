/* eslint-disable no-unused-vars */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-danger">
                <h4 className="alert-heading">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Something went wrong
                </h4>
                <p>
                  An unexpected error occurred. Please try refreshing the page.
                </p>
                <hr />
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-refresh me-2"></i>
                    Refresh Page
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  >
                    Try Again
                  </button>
                </div>
                
                {/* Show error details in development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-3">
                    <summary className="text-muted">Error Details (Development Only)</summary>
                    <pre className="mt-2 p-2 bg-light border rounded small">
                      <strong>Error:</strong> {this.state.error.toString()}
                      {this.state.errorInfo && this.state.errorInfo.componentStack && (
                        <>
                          <br />
                          <strong>Component Stack:</strong>
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

export default ErrorBoundary;