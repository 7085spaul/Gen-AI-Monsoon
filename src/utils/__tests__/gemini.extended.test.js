import { describe, it, expect, vi } from 'vitest';
import { parseGeminiResponse } from '../gemini';

describe('Gemini Utils Extended', () => {
  describe('parseGeminiResponse', () => {
    it('should parse valid JSON response correctly', () => {
      const jsonResponse = '{"key": "value", "number": 42}';
      const result = parseGeminiResponse(jsonResponse);
      expect(result).toEqual({ key: 'value', number: 42 });
    });

    it('should extract JSON from mixed text response', () => {
      const mixedResponse = 'Some text before {"key": "value"} some text after';
      const result = parseGeminiResponse(mixedResponse);
      expect(result).toEqual({ key: 'value' });
    });

    it('should handle nested JSON structures', () => {
      const response = '{"plan": {"steps": [{"action": "prepare"}]}}';
      const result = parseGeminiResponse(response);
      expect(result.plan).toBeDefined();
      expect(result.plan.steps).toBeInstanceOf(Array);
    });

    it('should handle arrays in JSON', () => {
      const response = '{"items": ["a", "b", "c"], "count": 3}';
      const result = parseGeminiResponse(response);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.count).toBe(3);
    });

    it('should provide sections for non-JSON text', () => {
      const response = 'Section 1\n\nSection 2\n\nSection 3';
      const result = parseGeminiResponse(response);
      expect(result).toHaveProperty('rawResponse');
      expect(result).toHaveProperty('sections');
      expect(result.sections.length).toBeGreaterThan(0);
    });

    it('should handle empty strings gracefully', () => {
      const result = parseGeminiResponse('');
      expect(result).toHaveProperty('rawResponse', '');
    });

    it('should handle malformed JSON without crashing', () => {
      const result = parseGeminiResponse('This is {not valid json');
      expect(result).toHaveProperty('rawResponse');
    });

    it('should preserve special characters in JSON', () => {
      const response = '{"title": "Prepare for monsoon", "icon": "🌧️"}';
      const result = parseGeminiResponse(response);
      expect(result.title).toBe('Prepare for monsoon');
      expect(result.icon).toBe('🌧️');
    });

    it('should handle complex nested structures', () => {
      const response = '{"data": {"level1": {"level2": {"level3": "value"}}}}';
      const result = parseGeminiResponse(response);
      expect(result.data.level1.level2.level3).toBe('value');
    });

    it('should extract first valid JSON object', () => {
      const response = 'Text {"first": "obj"} more text';
      const result = parseGeminiResponse(response);
      expect(result).toHaveProperty('first');
    });
  });
});
