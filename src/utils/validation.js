/**
 * Validation utilities for user input
 */

/**
 * Validate location name
 * @param {string} location - Location to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateLocation(location) {
  if (!location || location.trim().length === 0) {
    return { isValid: false, error: 'Location cannot be empty' };
  }
  if (location.trim().length < 2) {
    return { isValid: false, error: 'Location must be at least 2 characters' };
  }
  if (location.trim().length > 100) {
    return { isValid: false, error: 'Location must be less than 100 characters' };
  }
  if (!/^[a-zA-Z\s,\-()]*$/.test(location)) {
    return { isValid: false, error: 'Location can only contain letters, spaces, commas, hyphens, and parentheses' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validate family size
 * @param {number} size - Family size to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateFamilySize(size) {
  const num = parseInt(size);
  if (isNaN(num)) {
    return { isValid: false, error: 'Family size must be a number' };
  }
  if (num < 1) {
    return { isValid: false, error: 'Family size must be at least 1' };
  }
  if (num > 20) {
    return { isValid: false, error: 'Family size must be 20 or less' };
  }
  return { isValid: true, error: '' };
}

/**
 * Sanitize text input
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeTextInput(text) {
  if (!text) return '';
  return text
    .trim()
    .slice(0, 500) // Limit to 500 chars
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

/**
 * Validate email (if needed for future features)
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email address' };
  }
  return { isValid: true, error: '' };
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return { isValid: false, error: 'Invalid phone number' };
  }
  return { isValid: true, error: '' };
}
