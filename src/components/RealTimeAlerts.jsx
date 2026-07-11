import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, MapPin, X, RefreshCw } from 'lucide-react';
import { getCurrentWeather, getWeatherAlerts, getMonsoonRiskLevel } from '../utils/weather';
import { generateRealTimeAlert } from '../utils/gemini';
import { saveAlert } from '../utils/firebase';

function RealTimeAlerts({ userLocation, onLoadingChange }) {
  const [alerts, setAlerts] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (userLocation) {
      fetchAlerts();
      // Set up auto-refresh every 5 minutes
      const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  const fetchAlerts = async () => {
    if (!userLocation) return;

    setLoading(true);
    onLoadingChange(true);
    setError(null);

    try {
      const weatherData = await getCurrentWeather(userLocation);
      const weatherAlerts = await getWeatherAlerts(userLocation);
      
      // Generate AI-powered alert
      const aiAlert = await generateRealTimeAlert(weatherData, userLocation);
      setCurrentAlert(aiAlert);

      // Combine weather alerts with AI alert
      const combinedAlerts = [
        {
          id: 'ai-alert',
          type: 'ai-generated',
          ...aiAlert,
          timestamp: new Date().toISOString()
        },
        ...weatherAlerts.map((alert, index) => ({
          id: `weather-${index}`,
          type: 'weather-service',
          title: alert.event || 'Weather Alert',
          description: alert.description,
          severity: alert.severity || 'moderate',
          startTime: new Date(alert.start * 1000).toISOString(),
          endTime: new Date(alert.end * 1000).toISOString()
        }))
      ];

      setAlerts(combinedAlerts);
      setLastUpdated(new Date());

      // Save alert to Firebase
      try {
        await saveAlert('guest-user', {
          location: userLocation,
          alerts: combinedAlerts,
          weatherData: weatherData
        });
      } catch (saveError) {
        console.error('Error saving alert to Firebase:', saveError);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const getAlertColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'red':
      case 'severe':
      case 'extreme':
        return 'border-danger-500 bg-danger-50';
      case 'orange':
      case 'high':
        return 'border-warning-500 bg-warning-50';
      case 'yellow':
      case 'moderate':
        return 'border-primary-500 bg-primary-50';
      case 'green':
      case 'low':
        return 'border-success-500 bg-success-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getAlertBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'red':
      case 'severe':
      case 'extreme':
        return 'bg-danger-500 text-white';
      case 'orange':
      case 'high':
        return 'bg-warning-500 text-white';
      case 'yellow':
      case 'moderate':
        return 'bg-primary-500 text-white';
      case 'green':
      case 'low':
        return 'bg-success-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Fetching real-time alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="text-primary-600" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Real-Time Alerts</h2>
              <p className="text-gray-600">AI-powered weather alerts and warnings</p>
            </div>
          </div>
          <button
            onClick={fetchAlerts}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4">
            <p className="text-danger-600 text-sm">{error}</p>
          </div>
        )}

        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock size={16} />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {!userLocation && (
        <div className="card text-center">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">Please set your location to receive real-time alerts</p>
        </div>
      )}

      {userLocation && alerts.length === 0 && !loading && (
        <div className="card bg-success-50 border border-success-200">
          <div className="flex items-center gap-3">
            <div className="bg-success-500 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-success-800">All Clear</h3>
              <p className="text-sm text-success-600">No active weather alerts for your location</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`card border-l-4 ${getAlertColor(alert.alertLevel || alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className={`${
                  alert.alertLevel === 'Red' || alert.severity === 'severe' ? 'text-danger-600' :
                  alert.alertLevel === 'Orange' || alert.severity === 'high' ? 'text-warning-600' :
                  'text-primary-600'
                }`} size={24} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {alert.alertTitle || alert.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAlertBadge(alert.alertLevel || alert.severity)}`}>
                      {alert.alertLevel || alert.severity || 'Info'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {alert.description || alert.rawResponse?.substring(0, 300)}
                  </p>

                  {alert.recommendedActions && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-600 mb-1">Recommended Actions:</p>
                      <ul className="text-xs list-disc list-inside text-gray-600">
                        {Array.isArray(alert.recommendedActions) 
                          ? alert.recommendedActions.map((action, i) => <li key={i}>{action}</li>)
                          : <li>{alert.recommendedActions}</li>
                        }
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {alert.startTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Start: {new Date(alert.startTime).toLocaleString()}</span>
                      </div>
                    )}
                    {alert.endTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>End: {new Date(alert.endTime).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Dismiss alert"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentAlert && currentAlert.affectedAreas && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Affected Areas</h3>
          <p className="text-sm text-gray-700">{currentAlert.affectedAreas}</p>
        </div>
      )}

      {currentAlert && currentAlert.timeline && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Expected Timeline</h3>
          <p className="text-sm text-gray-700">{currentAlert.timeline}</p>
        </div>
      )}
    </div>
  );
}

export default RealTimeAlerts;
