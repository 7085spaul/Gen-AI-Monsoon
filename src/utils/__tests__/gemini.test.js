import { describe, it, expect, vi } from 'vitest';
import { parseGeminiResponse } from '../gemini';

describe('Gemini Utils', () => {
  describe('parseGeminiResponse', () => {
    it('should parse JSON response correctly', () => {
      const jsonResponse = '{"key": "value", "number": 42}';
      const result = parseGeminiResponse(jsonResponse);
      expect(result).toEqual({ key: 'value', number: 42 });
    });

    it('should extract JSON from mixed text', () => {
      const mixedResponse = 'Some text before {"key": "value"} some text after';
      const result = parseGeminiResponse(mixedResponse);
      expect(result).toEqual({ key: 'value' });
    });

    it('should handle non-JSON response', () => {
      const textResponse = 'This is plain text response';
      const result = parseGeminiResponse(textResponse);
      expect(result).toHaveProperty('rawResponse', textResponse);
      expect(result).toHaveProperty('sections');
    });

    it('should handle empty response', () => {
      const result = parseGeminiResponse('');
      expect(result).toHaveProperty('rawResponse', '');
    });
  });
});
