import React, { useState } from 'react';
import { Shield, AlertTriangle, Zap, Home, Droplets, Heart } from 'lucide-react';
import { generateSafetyRecommendations } from '../utils/gemini';
import { getCurrentWeather } from '../utils/weather';

function SafetyRecommendations({ userLocation, onLoadingChange }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('heavy-rain');

  const conditions = [
    { value: 'heavy-rain', label: 'Heavy Rain', icon: Droplets },
    { value: 'thunderstorm', label: 'Thunderstorm', icon: Zap },
    { value: 'flooding', label: 'Flooding', icon: Home },
    { value: 'high-winds', label: 'High Winds', icon: Shield },
    { value: 'landslide', label: 'Landslide Risk', icon: AlertTriangle }
  ];

  const generateRecommendations = async () => {
    if (!userLocation) {
      setError('Please set your location first');
      return;
    }

    setLoading(true);
    onLoadingChange(true);
    setError(null);

    try {
      const weatherData = await getCurrentWeather(userLocation);
      const generatedRecommendations = await generateSafetyRecommendations(selectedCondition, userLocation);
      setRecommendations(generatedRecommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-danger-500 bg-danger-50';
      case 'medium': return 'border-warning-500 bg-warning-50';
      case 'low': return 'border-success-500 bg-success-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-danger-500 text-white';
      case 'medium': return 'bg-warning-500 text-white';
      case 'low': return 'bg-success-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Generating safety recommendations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-primary-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Safety Recommendations</h2>
            <p className="text-gray-600">AI-powered safety tips for various weather conditions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Weather Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {conditions.map((condition) => {
                const Icon = condition.icon;
                return (
                  <button
                    key={condition.value}
                    onClick={() => setSelectedCondition(condition.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedCondition === condition.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={20} className="mx-auto mb-1" />
                    <span className="text-sm">{condition.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={generateRecommendations}
            className="btn-primary w-full"
            disabled={!userLocation}
          >
            Get Safety Recommendations
          </button>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {recommendations && (
        <div className="space-y-4">
          {recommendations.rawResponse ? (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Safety Recommendations</h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                {recommendations.rawResponse}
              </div>
            </div>
          ) : (
            <>
              {recommendations.immediateSafetyMeasures && (
                <div className={`card border-l-4 ${getPriorityColor('high')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertTriangle size={20} className="text-danger-600" />
                      Immediate Safety Measures
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('high')}`}>
                      HIGH PRIORITY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {Array.isArray(recommendations.immediateSafetyMeasures) 
                      ? recommendations.immediateSafetyMeasures.map((measure, i) => (
                          <li key={i} className="text-sm text-gray-700">• {measure}</li>
                        ))
                      : <li className="text-sm text-gray-700">{recommendations.immediateSafetyMeasures}</li>
                    }
                  </ul>
                </div>
              )}

              {recommendations.outdoorActivityGuidelines && (
                <div className={`card border-l-4 ${getPriorityColor('medium')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Outdoor Activity Guidelines</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('medium')}`}>
                      MEDIUM PRIORITY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {Array.isArray(recommendations.outdoorActivityGuidelines) 
                      ? recommendations.outdoorActivityGuidelines.map((guideline, i) => (
                          <li key={i} className="text-sm text-gray-700">• {guideline}</li>
                        ))
                      : <li className="text-sm text-gray-700">{recommendations.outdoorActivityGuidelines}</li>
                    }
                  </ul>
                </div>
              )}

              {recommendations.homeSafetyPrecautions && (
                <div className={`card border-l-4 ${getPriorityColor('high')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Home size={20} className="text-primary-600" />
                      Home Safety Precautions
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('high')}`}>
                      HIGH PRIORITY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {Array.isArray(recommendations.homeSafetyPrecautions) 
                      ? recommendations.homeSafetyPrecautions.map((precaution, i) => (
                          <li key={i} className="text-sm text-gray-700">• {precaution}</li>
                        ))
                      : <li className="text-sm text-gray-700">{recommendations.homeSafetyPrecautions}</li>
                    }
                  </ul>
                </div>
              )}

              {recommendations.electricalSafetyTips && (
                <div className={`card border-l-4 ${getPriorityColor('high')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Zap size={20} className="text-warning-600" />
                      Electrical Safety Tips
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('high')}`}>
                      HIGH PRIORITY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {Array.isArray(recommendations.electricalSafetyTips) 
                      ? recommendations.electricalSafetyTips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-700">• {tip}</li>
                        ))
                      : <li className="text-sm text-gray-700">{recommendations.electricalSafetyTips}</li>
                    }
                  </ul>
                </div>
              )}

              {recommendations.waterSafetyMeasures && (
                <div className={`card border-l-4 ${getPriorityColor('high')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Droplets size={20} className="text-blue-600" />
                      Water Safety Measures
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('high')}`}>
                      HIGH PRIORITY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {Array.isArray(recommendations.waterSafetyMeasures) 
                      ? recommendations.waterSafetyMeasures.map((measure, i) => (
                          <li key={i} className="text-sm text-gray-700">• {measure}</li>
                        ))
                      : <li className="text-sm text-gray-700">{recommendations.waterSafetyMeasures}</li>
                    }
                  </ul>
                </div>
              )}

              {recommendations.healthPrecautions && (
                <div className={`card border-l-4 ${getPriorityColor('medium')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Heart size={20} className="text-danger-600" />
                      Health Precautions
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('medium')}`}>
                      MEDIUM PRIORITY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {Array.isArray(recommendations.healthPrecautions) 
                      ? recommendations.healthPrecautions.map((precaution, i) => (
                          <li key={i} className="text-sm text-gray-700">• {precaution}</li>
                        ))
                      : <li className="text-sm text-gray-700">{recommendations.healthPrecautions}</li>
                    }
                  </ul>
                </div>
              )}

              {recommendations.whenToEvacuate && (
                <div className={`card border-l-4 ${getPriorityColor('high')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">When to Evacuate</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge('high')}`}>
                      HIGH PRIORITY
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{recommendations.whenToEvacuate}</p>
                </div>
              )}

              {recommendations.sections && recommendations.sections.map((section, i) => (
                <div key={i} className={`card border-l-4 ${getPriorityColor('medium')}`}>
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

export default SafetyRecommendations;
