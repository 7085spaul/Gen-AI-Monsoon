import React, { useState } from 'react';
import { Languages, Globe } from 'lucide-react';
import { translateContent } from '../utils/gemini';

function MultilingualSupport({ onLoadingChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [contentToTranslate, setContentToTranslate] = useState('');
  const [translatedContent, setTranslatedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { value: 'hindi', label: 'Hindi', native: 'हिंदी' },
    { value: 'spanish', label: 'Spanish', native: 'Español' },
    { value: 'french', label: 'French', native: 'Français' },
    { value: 'german', label: 'German', native: 'Deutsch' },
    { value: 'portuguese', label: 'Portuguese', native: 'Português' },
    { value: 'chinese', label: 'Chinese', native: '中文' },
    { value: 'japanese', label: 'Japanese', native: '日本語' },
    { value: 'arabic', label: 'Arabic', native: 'العربية' },
    { value: 'bengali', label: 'Bengali', native: 'বাংলা' },
    { value: 'tamil', label: 'Tamil', native: 'தமிழ்' },
    { value: 'telugu', label: 'Telugu', native: 'తెలుగు' },
    { value: 'marathi', label: 'Marathi', native: 'मराठी' }
  ];

  const sampleContent = {
    title: 'Monsoon Safety Tips',
    tips: [
      'Stay indoors during heavy rainfall',
      'Keep emergency supplies ready',
      'Avoid walking through flooded areas',
      'Stay away from electrical equipment',
      'Follow official weather updates'
    ],
    emergency: 'In case of emergency, call 108 for ambulance services'
  };

  const handleTranslate = async () => {
    const content = contentToTranslate || JSON.stringify(sampleContent);
    
    setLoading(true);
    onLoadingChange(true);
    setError(null);

    try {
      const translated = await translateContent(content, selectedLanguage);
      setTranslatedContent(translated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Translating content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Languages className="text-primary-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Multilingual Support</h2>
            <p className="text-gray-600">AI-powered translation for preparedness information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Target Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedLanguage === lang.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{lang.label}</div>
                  <div className="text-xs text-gray-500">{lang.native}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content to Translate (Optional)
            </label>
            <textarea
              value={contentToTranslate}
              onChange={(e) => setContentToTranslate(e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Enter text to translate, or leave empty to translate sample safety tips"
            />
          </div>

          <button
            onClick={handleTranslate}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Languages size={18} />
            Translate Content
          </button>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {translatedContent && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-primary-600" size={24} />
            <h3 className="font-semibold text-gray-900">Translated Content</h3>
          </div>

          {translatedContent.rawResponse ? (
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
              {translatedContent.rawResponse}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(translatedContent).map(([key, value]) => {
                if (key === 'rawResponse') return null;
                
                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    {Array.isArray(value) ? (
                      <ul className="space-y-1">
                        {value.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700">• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sample Content Display */}
      {!contentToTranslate && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Sample Content Being Translated</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">{sampleContent.title}</h4>
            <ul className="space-y-1">
              {sampleContent.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700">• {tip}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 italic">{sampleContent.emergency}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultilingualSupport;
