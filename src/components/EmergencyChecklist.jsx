import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Download } from 'lucide-react';
import { generateEmergencyChecklist } from '../utils/gemini';

function EmergencyChecklist({ userProfile, onLoadingChange }) {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('flood');
  const [checkedItems, setCheckedItems] = useState({});

  const scenarios = [
    { value: 'flood', label: 'Flash Flood' },
    { value: 'cyclone', label: 'Cyclone/Storm' },
    { value: 'landslide', label: 'Landslide' },
    { value: 'power-outage', label: 'Extended Power Outage' },
    { value: 'water-shortage', label: 'Water Shortage' },
    { value: 'evacuation', label: 'Emergency Evacuation' }
  ];

  const generateChecklist = async () => {
    if (!userProfile) {
      setError('Please complete your profile first');
      return;
    }

    setLoading(true);
    onLoadingChange(true);
    setError(null);
    setCheckedItems({});

    try {
      // Add location if available
      const profileWithLocation = {
        ...userProfile,
        location: userProfile.location || 'Your location'
      };
      const generatedChecklist = await generateEmergencyChecklist(selectedScenario, profileWithLocation);
      setChecklist(generatedChecklist);
    } catch (err) {
      console.error('[v0] Error generating checklist:', err);
      setError(err.message || 'Failed to generate checklist. Please try again.');
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const toggleItem = (category, itemIndex) => {
    const key = `${category}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCompletionPercentage = () => {
    if (!checklist) return 0;
    let total = 0;
    let completed = 0;
    
    Object.keys(checklist).forEach(category => {
      if (Array.isArray(checklist[category])) {
        checklist[category].forEach((_, index) => {
          total++;
          if (checkedItems[`${category}-${index}`]) completed++;
        });
      }
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Generating emergency checklist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <CheckSquare className="text-primary-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Emergency Checklist</h2>
            <p className="text-gray-600">AI-generated checklist for various emergency scenarios</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Emergency Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="input-field"
            >
              {scenarios.map(scenario => (
                <option key={scenario.value} value={scenario.value}>
                  {scenario.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generateChecklist}
            className="btn-primary w-full"
            disabled={!userProfile}
          >
            Generate Checklist
          </button>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {checklist && (
        <>
          {/* Progress Bar */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Completion Progress</span>
              <span className="text-primary-600 font-semibold">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="card space-y-6">
            {checklist.rawResponse ? (
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                {checklist.rawResponse}
              </div>
            ) : (
              Object.entries(checklist).map(([category, items]) => {
                if (category === 'rawResponse' || !Array.isArray(items)) return null;
                
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={`${category}-${index}`}
                            checked={checkedItems[`${category}-${index}`] || false}
                            onChange={() => toggleItem(category, index)}
                            className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <label
                            htmlFor={`${category}-${index}`}
                            className={`text-sm cursor-pointer ${
                              checkedItems[`${category}-${index}`] ? 'line-through text-gray-400' : 'text-gray-700'
                            }`}
                          >
                            {item}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}

            {checklist.sections && checklist.sections.map((section, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Section {i + 1}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{section}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default EmergencyChecklist;
