import React from 'react';
import { AlertTriangle } from 'lucide-react';

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
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4" role="alert">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={32} />
              <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
            </div>
            
            <p className="text-gray-600 mb-4">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-gray-100 rounded border border-gray-300 text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">Error Details (Development Only)</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-48 text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="btn-primary flex-1"
                aria-label="Try again"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary flex-1"
                aria-label="Go to home page"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
