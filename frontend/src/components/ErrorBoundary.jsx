import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card shadow-lg border-0">
                  <div className="card-header bg-danger text-white text-center py-3">
                    <h4 className="mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Something went wrong
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="text-center mb-4">
                      <i className="fas fa-bug fa-3x text-muted mb-3"></i>
                      <h5>We're sorry, but something went wrong</h5>
                      <p className="text-muted">
                        The application encountered an unexpected error. Please try refreshing the page.
                      </p>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                      >
                        <i className="fas fa-redo me-2"></i>
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
                    {process.env.NODE_ENV === 'development' && (
                      <details className="mt-4">
                        <summary className="btn btn-outline-warning btn-sm">
                          Show Error Details (Development)
                        </summary>
                        <div className="mt-2">
                          <div className="alert alert-warning">
                            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                          </div>
                          <div className="alert alert-info">
                            <strong>Component Stack:</strong>
                            <pre className="small mt-2">{this.state.errorInfo.componentStack}</pre>
                          </div>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;