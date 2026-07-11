import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { getCurrentWeather, getWeatherForecast, getMonsoonRiskLevel, getWeatherConditionIcon } from '../utils/weather';
import { generateRealTimeAlert } from '../utils/gemini';

function WeatherDashboard({ userLocation, userProfile, onLoadingChange }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aiAlert, setAiAlert] = useState(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userLocation) {
      fetchWeatherData();
    }
  }, [userLocation]);

  const fetchWeatherData = async () => {
    setLoading(true);
    onLoadingChange(true);
    setError(null);
    setAiAlert(null);

    try {
      // Fetch current weather
      const current = await getCurrentWeather(userLocation);
      setWeatherData(current);

      // Fetch forecast
      const forecast = await getWeatherForecast(userLocation, 5);
      setForecastData(forecast);

      // Generate AI-powered alert without blocking the weather display
      setAlertLoading(true);
      generateRealTimeAlert(current, userLocation)
        .then((alert) => setAiAlert(alert))
        .catch((alertError) => {
          console.warn('Real-time alert failed:', alertError);
        })
        .finally(() => setAlertLoading(false));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-danger-500';
      case 'medium': return 'bg-warning-500';
      case 'low': return 'bg-success-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (level) => {
    switch (level) {
      case 'high': return 'text-danger-700 bg-danger-50';
      case 'medium': return 'text-warning-700 bg-warning-50';
      case 'low': return 'text-success-700 bg-success-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-danger-50 border border-danger-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-danger-600" size={24} />
          <div>
            <h3 className="font-semibold text-danger-800">Error Loading Weather Data</h3>
            <p className="text-danger-600">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchWeatherData}
          className="mt-4 btn-danger"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="card text-center">
        <Cloud size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Enter your location to view weather data</p>
      </div>
    );
  }

  const riskLevel = getMonsoonRiskLevel(weatherData);
  const alertLevel = aiAlert?.alertLevel;
  const alertTitle = aiAlert?.alertTitle;
  const alertDescription = aiAlert?.description || (aiAlert?.rawResponse ? aiAlert.rawResponse.substring(0, 200) : (alertLoading ? 'Fetching AI alert...' : 'No alert available.'));
  const alertActions = aiAlert?.recommendedActions;

  return (
    <div className="space-y-6">
      {/* AI Alert Banner */}
      {(aiAlert || alertLoading) && (
        <div className={`card border-l-4 ${
          alertLevel === 'Red' ? 'border-danger-500 bg-danger-50' :
          alertLevel === 'Orange' ? 'border-warning-500 bg-warning-50' :
          alertLevel === 'Yellow' ? 'border-primary-500 bg-primary-50' :
          'border-success-500 bg-success-50'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`${
              alertLevel === 'Red' ? 'text-danger-600' :
              alertLevel === 'Orange' ? 'text-warning-600' :
              alertLevel === 'Yellow' ? 'text-primary-600' :
              'text-success-600'
            }`} size={24} />
            <div className="flex-1">
              <h3 className={`font-semibold ${
                alertLevel === 'Red' ? 'text-danger-800' :
                alertLevel === 'Orange' ? 'text-warning-800' :
                alertLevel === 'Yellow' ? 'text-primary-800' :
                'text-success-800'
              }`}>
                {alertTitle || (alertLoading ? 'Loading alert...' : 'Weather Alert')}
              </h3>
              <p className="text-sm mt-1 text-gray-700">
                {alertDescription}
              </p>
              {alertActions && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Recommended Actions:</p>
                  <ul className="text-sm list-disc list-inside text-gray-600">
                    {Array.isArray(alertActions)
                      ? alertActions.map((action, i) => <li key={i}>{action}</li>)
                      : <li>{alertActions}</li>
                    }
                  </ul>
                </div>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              alertLevel === 'Red' ? 'bg-danger-500 text-white' :
              alertLevel === 'Orange' ? 'bg-warning-500 text-white' :
              alertLevel === 'Yellow' ? 'bg-primary-500 text-white' :
              'bg-success-500 text-white'
            }`}>
              {alertLevel || (alertLoading ? 'Loading' : 'Info')}
            </span>
          </div>
        </div>
      )}

      {/* Current Weather Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Current Weather</h2>
          <div className={`px-4 py-2 rounded-full ${getRiskTextColor(riskLevel)}`}>
            <span className="font-semibold">Monsoon Risk: {riskLevel.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Temperature */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <Thermometer size={20} />
              <span className="font-medium">Temperature</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{Math.round(weatherData.main.temp)}°C</p>
            <p className="text-sm text-gray-600">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
          </div>

          {/* Humidity */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Droplets size={20} />
              <span className="font-medium">Humidity</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{weatherData.main.humidity}%</p>
            <p className="text-sm text-gray-600">Dew point: {Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5))}°C</p>
          </div>

          {/* Wind */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
            <div className="flex items-center gap-2 text-cyan-700 mb-2">
              <Wind size={20} />
              <span className="font-medium">Wind Speed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{weatherData.wind.speed} m/s</p>
            <p className="text-sm text-gray-600">Direction: {weatherData.wind.deg}°</p>
          </div>

          {/* Condition */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <Cloud size={20} />
              <span className="font-medium">Condition</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 capitalize">
              {getWeatherConditionIcon(weatherData.weather[0].icon)} {weatherData.weather[0].description}
            </p>
            <p className="text-sm text-gray-600">Pressure: {weatherData.main.pressure} hPa</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecastData && (
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-primary-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">5-Day Forecast</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {forecastData.list
              .filter((item, index) => index % 8 === 0) // Get one forecast per day
              .slice(0, 5)
              .map((forecast, index) => {
                const date = new Date(forecast.dt * 1000);
                const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div key={forecast.dt} className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="font-semibold text-gray-700">{dayName}</p>
                    <p className="text-sm text-gray-500">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-4xl my-3">{getWeatherConditionIcon(forecast.weather[0].icon)}</p>
                    <p className="text-lg font-bold text-gray-900">{Math.round(forecast.main.temp)}°C</p>
                    <p className="text-sm text-gray-600 capitalize">{forecast.weather[0].description}</p>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                      <span>💧 {forecast.main.humidity}%</span>
                      <span>💨 {forecast.wind.speed}m/s</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Sunrise & Sunset</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Sunrise</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sunset</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Location Details</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">City: <span className="font-semibold text-gray-900">{weatherData.name}</span></p>
            <p className="text-sm text-gray-600">Country: <span className="font-semibold text-gray-900">{weatherData.sys.country}</span></p>
            <p className="text-sm text-gray-600">Coordinates: <span className="font-semibold text-gray-900">{weatherData.coord.lat.toFixed(2)}°, {weatherData.coord.lon.toFixed(2)}°</span></p>
          </div>
        </div>
      </div>

      <button
        onClick={fetchWeatherData}
        className="btn-primary w-full"
      >
        Refresh Weather Data
      </button>
    </div>
  );
}

export default WeatherDashboard;
