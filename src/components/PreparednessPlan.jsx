import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { generatePreparednessPlan } from '../utils/gemini';
import { getCurrentWeather } from '../utils/weather';
import { savePreparednessPlan } from '../utils/firebase';

function PreparednessPlan({ userLocation, userProfile, onLoadingChange }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const generatePlan = async () => {
    if (!userLocation) {
      setError('Please set your location first');
      return;
    }

    if (!userProfile) {
      setError('Please complete your profile first');
      return;
    }

    setLoading(true);
    onLoadingChange(true);
    setError(null);
    setSaved(false);

    try {
      const weatherData = await getCurrentWeather(userLocation);
      const generatedPlan = await generatePreparednessPlan(userProfile, weatherData);
      setPlan(generatedPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const savePlan = async () => {
    if (!plan) return;

    try {
      // In a real app, you'd get the actual user ID from auth
      const userId = 'guest-user';
      await savePreparednessPlan(userId, {
        location: userLocation,
        plan: plan,
        profile: userProfile
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving plan:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Generating your personalized preparedness plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-primary-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personalized Preparedness Plan</h2>
            <p className="text-gray-600">AI-generated plan based on your location and profile</p>
          </div>
        </div>

        {!plan && (
          <div className="text-center py-8">
            <Shield size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-4">
              Generate a comprehensive monsoon preparedness plan tailored to your specific needs
            </p>
            <button
              onClick={generatePlan}
              className="btn-primary"
              disabled={!userLocation || !userProfile}
            >
              Generate Preparedness Plan
            </button>
            {error && (
              <p className="mt-4 text-danger-600 text-sm">{error}</p>
            )}
          </div>
        )}

        {plan && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <button
                onClick={generatePlan}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Regenerate
              </button>
              <button
                onClick={savePlan}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={18} />
                {saved ? 'Saved!' : 'Save Plan'}
              </button>
            </div>

            {/* Display the plan */}
            <div className="space-y-4">
              {plan.rawResponse ? (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Your Preparedness Plan</h3>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                    {plan.rawResponse}
                  </div>
                </div>
              ) : (
                <>
                  {plan.immediateActions && (
                    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                      <h3 className="font-semibold text-danger-800 mb-2 flex items-center gap-2">
                        <AlertCircle size={20} />
                        Immediate Actions
                      </h3>
                      <ul className="space-y-1">
                        {Array.isArray(plan.immediateActions) ? plan.immediateActions.map((action, i) => (
                          <li key={i} className="text-sm text-danger-700">• {action}</li>
                        )) : <li className="text-sm text-danger-700">{plan.immediateActions}</li>}
                      </ul>
                    </div>
                  )}

                  {plan.emergencySupplies && (
                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                      <h3 className="font-semibold text-warning-800 mb-2 flex items-center gap-2">
                        <CheckCircle size={20} />
                        Emergency Supplies Checklist
                      </h3>
                      <ul className="space-y-1">
                        {Array.isArray(plan.emergencySupplies) ? plan.emergencySupplies.map((item, i) => (
                          <li key={i} className="text-sm text-warning-700">• {item}</li>
                        )) : <li className="text-sm text-warning-700">{plan.emergencySupplies}</li>}
                      </ul>
                    </div>
                  )}

                  {plan.homePreparation && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <h3 className="font-semibold text-primary-800 mb-2">Home Preparation</h3>
                      <ul className="space-y-1">
                        {Array.isArray(plan.homePreparation) ? plan.homePreparation.map((step, i) => (
                          <li key={i} className="text-sm text-primary-700">• {step}</li>
                        )) : <li className="text-sm text-primary-700">{plan.homePreparation}</li>}
                      </ul>
                    </div>
                  )}

                  {plan.communicationPlan && (
                    <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                      <h3 className="font-semibold text-success-800 mb-2">Family Communication Plan</h3>
                      <ul className="space-y-1">
                        {Array.isArray(plan.communicationPlan) ? plan.communicationPlan.map((item, i) => (
                          <li key={i} className="text-sm text-success-700">• {item}</li>
                        )) : <li className="text-sm text-success-700">{plan.communicationPlan}</li>}
                      </ul>
                    </div>
                  )}

                  {plan.specialConsiderations && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-800 mb-2">Special Considerations</h3>
                      <ul className="space-y-1">
                        {Array.isArray(plan.specialConsiderations) ? plan.specialConsiderations.map((item, i) => (
                          <li key={i} className="text-sm text-purple-700">• {item}</li>
                        )) : <li className="text-sm text-purple-700">{plan.specialConsiderations}</li>}
                      </ul>
                    </div>
                  )}

                  {plan.sections && plan.sections.map((section, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Section {i + 1}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{section}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreparednessPlan;
