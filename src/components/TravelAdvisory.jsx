import React, { useState } from 'react';
import { Navigation, MapPin, AlertTriangle, Clock } from 'lucide-react';
import { generateTravelAdvisory } from '../utils/gemini';
import { getCurrentWeather } from '../utils/weather';

function TravelAdvisory({ userLocation, onLoadingChange }) {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState('');

  const generateAdvisory = async () => {
    if (!userLocation) {
      setError('Please set your current location first');
      return;
    }

    if (!destination.trim()) {
      setError('Please enter your destination');
      return;
    }

    setLoading(true);
    onLoadingChange(true);
    setError(null);

    try {
      const originWeather = await getCurrentWeather(userLocation);
      const destWeather = await getCurrentWeather(destination);
      
      const weatherData = {
        origin: originWeather,
        destination: destWeather
      };

      const generatedAdvisory = await generateTravelAdvisory(userLocation, destination, weatherData);
      setAdvisory(generatedAdvisory);
    } catch (err) {
      console.error('[v0] Error generating advisory:', err);
      setError(err.message || 'Failed to generate travel advisory. Please try again.');
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-danger-500';
      case 'medium': return 'bg-warning-500';
      case 'low': return 'bg-success-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Analyzing route conditions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Navigation className="text-primary-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Travel Advisory</h2>
            <p className="text-gray-600">AI-powered travel recommendations for monsoon season</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Origin (Current Location)
                </div>
              </label>
              <input
                type="text"
                value={userLocation || ''}
                readOnly
                className="input-field bg-gray-100"
                placeholder="Set your location in the header"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Navigation size={16} />
                  Destination
                </div>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input-field"
                placeholder="Enter destination city"
              />
            </div>
          </div>

          <button
            onClick={generateAdvisory}
            className="btn-primary w-full"
            disabled={!userLocation}
          >
            Get Travel Advisory
          </button>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {advisory && (
        <div className="space-y-4">
          {/* Risk Assessment */}
          {advisory.travelRiskAssessment && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Travel Risk Assessment</h3>
                    <p className="text-sm text-gray-600">Based on current weather conditions</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-white font-semibold ${getRiskColor(advisory.travelRiskAssessment)}`}>
                  {advisory.travelRiskAssessment?.toUpperCase() || 'MEDIUM'}
                </span>
              </div>
            </div>
          )}

          {/* Detailed Advisory */}
          {advisory.rawResponse ? (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Travel Advisory Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                {advisory.rawResponse}
              </div>
            </div>
          ) : (
            <>
              {advisory.recommendedDepartureTimes && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="text-primary-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Recommended Departure Times</h3>
                  </div>
                  <p className="text-gray-700">{advisory.recommendedDepartureTimes}</p>
                </div>
              )}

              {advisory.routeSuggestions && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3">Route Suggestions</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{advisory.routeSuggestions}</p>
                </div>
              )}

              {advisory.vehiclePreparation && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3">Vehicle Preparation Checklist</h3>
                  <ul className="space-y-1">
                    {Array.isArray(advisory.vehiclePreparation) ? advisory.vehiclePreparation.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700">• {item}</li>
                    )) : <li className="text-sm text-gray-700">{advisory.vehiclePreparation}</li>}
                  </ul>
                </div>
              )}

              {advisory.emergencyContacts && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3">Emergency Contacts Along Route</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{advisory.emergencyContacts}</p>
                </div>
              )}

              {advisory.itemsToCarry && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3">Items to Carry</h3>
                  <ul className="space-y-1">
                    {Array.isArray(advisory.itemsToCarry) ? advisory.itemsToCarry.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700">• {item}</li>
                    )) : <li className="text-sm text-gray-700">{advisory.itemsToCarry}</li>}
                  </ul>
                </div>
              )}

              {advisory.sections && advisory.sections.map((section, i) => (
                <div key={i} className="card">
                  <h3 className="font-semibold text-gray-900 mb-3">Section {i + 1}</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{section}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TravelAdvisory;
