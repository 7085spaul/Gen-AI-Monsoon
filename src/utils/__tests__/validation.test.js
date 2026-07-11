import { describe, it, expect } from 'vitest';
import {
  validateLocation,
  validateFamilySize,
  sanitizeTextInput,
  validateEmail,
  validatePhone
} from '../validation';

describe('Validation Utils', () => {
  describe('validateLocation', () => {
    it('should validate correct location', () => {
      const result = validateLocation('Mumbai');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should reject empty location', () => {
      const result = validateLocation('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should reject too short location', () => {
      const result = validateLocation('M');
      expect(result.isValid).toBe(false);
    });

    it('should reject too long location', () => {
      const result = validateLocation('a'.repeat(101));
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('less than 100');
    });

    it('should reject invalid characters', () => {
      const result = validateLocation('Mumbai@123');
      expect(result.isValid).toBe(false);
    });

    it('should accept locations with commas and hyphens', () => {
      const result = validateLocation('New York, NY');
      expect(result.isValid).toBe(true);
    });

    it('should trim whitespace', () => {
      const result = validateLocation('  Mumbai  ');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFamilySize', () => {
    it('should validate correct family size', () => {
      const result = validateFamilySize(4);
      expect(result.isValid).toBe(true);
    });

    it('should accept min family size', () => {
      const result = validateFamilySize(1);
      expect(result.isValid).toBe(true);
    });

    it('should accept max family size', () => {
      const result = validateFamilySize(20);
      expect(result.isValid).toBe(true);
    });

    it('should reject zero', () => {
      const result = validateFamilySize(0);
      expect(result.isValid).toBe(false);
    });

    it('should reject negative numbers', () => {
      const result = validateFamilySize(-5);
      expect(result.isValid).toBe(false);
    });

    it('should reject size over 20', () => {
      const result = validateFamilySize(25);
      expect(result.isValid).toBe(false);
    });

    it('should reject non-numeric input', () => {
      const result = validateFamilySize('abc');
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeTextInput', () => {
    it('should handle normal text', () => {
      const result = sanitizeTextInput('Normal text');
      expect(result).toBe('Normal text');
    });

    it('should trim whitespace', () => {
      const result = sanitizeTextInput('  text  ');
      expect(result).toBe('text');
    });

    it('should remove HTML-like tags', () => {
      const result = sanitizeTextInput('Text <script>alert()</script>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should limit length to 500 characters', () => {
      const result = sanitizeTextInput('a'.repeat(600));
      expect(result.length).toBeLessThanOrEqual(500);
    });

    it('should handle empty input', () => {
      const result = sanitizeTextInput('');
      expect(result).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should reject email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
    });

    it('should reject email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
    });

    it('should reject invalid format', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone', () => {
      const result = validatePhone('1234567890');
      expect(result.isValid).toBe(true);
    });

    it('should accept formatted phone', () => {
      const result = validatePhone('(123) 456-7890');
      expect(result.isValid).toBe(true);
    });

    it('should accept phone with +', () => {
      const result = validatePhone('+91 9876543210');
      expect(result.isValid).toBe(true);
    });

    it('should reject too short phone', () => {
      const result = validatePhone('123');
      expect(result.isValid).toBe(false);
    });

    it('should reject empty phone', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
    });
  });
});
