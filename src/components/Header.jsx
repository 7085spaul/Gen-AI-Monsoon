import React, { useState } from 'react';
import { Cloud, User, MapPin, Settings, LogIn } from 'lucide-react';

function Header({ userLocation, onLocationChange, userProfile, onProfileUpdate }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [locationInput, setLocationInput] = useState(userLocation || '');
  const [locationError, setLocationError] = useState('');
  const [profileData, setProfileData] = useState(userProfile || {
    familySize: 1,
    hasChildren: false,
    hasElderly: false,
    hasPets: false,
    housingType: 'apartment',
    medicalConditions: ''
  });

  // Validate location input
  const validateLocation = (location) => {
    if (!location || location.trim().length === 0) {
      setLocationError('Location cannot be empty');
      return false;
    }
    if (location.trim().length < 2) {
      setLocationError('Location must be at least 2 characters');
      return false;
    }
    if (location.trim().length > 100) {
      setLocationError('Location must be less than 100 characters');
      return false;
    }
    if (!/^[a-zA-Z\s,\-()]*$/.test(location)) {
      setLocationError('Location can only contain letters, spaces, commas, hyphens, and parentheses');
      return false;
    }
    setLocationError('');
    return true;
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    if (value) validateLocation(value);
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (validateLocation(locationInput)) {
      onLocationChange(locationInput.trim());
      setLocationError('');
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    // Validate family size
    if (profileData.familySize < 1 || profileData.familySize > 20) {
      alert('Family size must be between 1 and 20');
      return;
    }
    onProfileUpdate(profileData);
    setShowProfileModal(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Cloud className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Monsoon Preparedness AI</h1>
                <p className="text-sm text-gray-600">AI-Powered Weather Safety</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Location Input */}
              <form onSubmit={handleLocationSubmit} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                    <input
                      type="text"
                      value={locationInput}
                      onChange={handleLocationChange}
                      placeholder="Enter your city"
                      maxLength="100"
                      className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-48 ${
                        locationError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      aria-label="Location input"
                      aria-describedby={locationError ? 'location-error' : undefined}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    aria-label="Set location"
                    disabled={!locationInput.trim()}
                  >
                    Set
                  </button>
                </div>
                {locationError && (
                  <span id="location-error" className="text-xs text-red-600" role="alert">
                    {locationError}
                  </span>
                )}
              </form>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Open profile settings"
              >
                <User size={18} />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </div>
          </div>

          {userLocation && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-primary-600" />
              <span>Current Location: <strong>{userLocation}</strong></span>
            </div>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">User Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={profileData.familySize}
                    onChange={(e) => setProfileData({...profileData, familySize: parseInt(e.target.value)})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Housing Type
                  </label>
                  <select
                    value={profileData.housingType}
                    onChange={(e) => setProfileData({...profileData, housingType: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profileData.hasChildren}
                      onChange={(e) => setProfileData({...profileData, hasChildren: e.target.checked})}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Has Children</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profileData.hasElderly}
                      onChange={(e) => setProfileData({...profileData, hasElderly: e.target.checked})}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Has Elderly Members</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profileData.hasPets}
                      onChange={(e) => setProfileData({...profileData, hasPets: e.target.checked})}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Has Pets</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions (Optional)
                  </label>
                  <textarea
                    value={profileData.medicalConditions}
                    onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
                    className="input-field"
                    rows="3"
                    placeholder="Any specific medical conditions or requirements..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
