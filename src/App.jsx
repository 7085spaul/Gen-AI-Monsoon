import React, { useState, useEffect } from 'react';
import { Cloud, Shield, Navigation, AlertTriangle, MessageSquare, Menu, X, Home } from 'lucide-react';
import WeatherDashboard from './components/WeatherDashboard';
import PreparednessPlan from './components/PreparednessPlan';
import EmergencyChecklist from './components/EmergencyChecklist';
import TravelAdvisory from './components/TravelAdvisory';
import SafetyRecommendations from './components/SafetyRecommendations';
import RealTimeAlerts from './components/RealTimeAlerts';
import MultilingualSupport from './components/MultilingualSupport';
import AIChat from './components/AIChat';
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userLocation, setUserLocation] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedLocation = localStorage.getItem('userLocation');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);

  const handleLocationChange = (location) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', location);
  };

  const handleProfileUpdate = (profile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const tabs = [
    { id: 'dashboard', label: 'Weather Dashboard', icon: Cloud },
    { id: 'preparedness', label: 'Preparedness Plan', icon: Shield },
    { id: 'checklist', label: 'Emergency Checklist', icon: AlertTriangle },
    { id: 'travel', label: 'Travel Advisory', icon: Navigation },
    { id: 'safety', label: 'Safety Tips', icon: Shield },
    { id: 'alerts', label: 'Real-time Alerts', icon: AlertTriangle },
    { id: 'multilingual', label: 'Multilingual', icon: MessageSquare },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header 
        userLocation={userLocation}
        onLocationChange={handleLocationChange}
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />

      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label={tab.label}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!userLocation && (
          <div className="card max-w-md mx-auto text-center">
            <Cloud size={48} className="mx-auto mb-4 text-primary-600" />
            <h2 className="text-xl font-semibold mb-2">Welcome to Monsoon Preparedness AI</h2>
            <p className="text-gray-600 mb-4">Please enter your location to get started with personalized weather alerts and preparedness plans.</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <WeatherDashboard 
            userLocation={userLocation}
            userProfile={userProfile}
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'preparedness' && (
          <PreparednessPlan 
            userLocation={userLocation}
            userProfile={userProfile}
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'checklist' && (
          <EmergencyChecklist 
            userProfile={userProfile}
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'travel' && (
          <TravelAdvisory 
            userLocation={userLocation}
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyRecommendations 
            userLocation={userLocation}
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'alerts' && (
          <RealTimeAlerts 
            userLocation={userLocation}
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'multilingual' && (
          <MultilingualSupport 
            onLoadingChange={setIsLoading}
          />
        )}

        {activeTab === 'chat' && (
          <AIChat 
            userLocation={userLocation}
            userProfile={userProfile}
            onLoadingChange={setIsLoading}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>Monsoon Preparedness AI - Powered by Google Gemini & OpenWeatherMap</p>
          <p className="text-sm mt-1">Real-time weather alerts and AI-powered preparedness guidance</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
