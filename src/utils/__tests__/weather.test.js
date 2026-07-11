import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMonsoonRiskLevel, getWeatherSeverity, getWeatherConditionIcon, getWeatherApiKey } from '../weather';

describe('Weather Utils', () => {
  describe('getMonsoonRiskLevel', () => {
    it('should return high risk for severe weather conditions', () => {
      const weatherData = {
        main: { humidity: 85, temp: 25 },
        weather: [{ main: 'Rain' }],
        wind: { speed: 18 }
      };
      expect(getMonsoonRiskLevel(weatherData)).toBe('high');
    });

    it('should return medium risk for moderate conditions', () => {
      const weatherData = {
        main: { humidity: 65, temp: 28 },
        weather: [{ main: 'Clouds' }],
        wind: { speed: 10 }
      };
      expect(getMonsoonRiskLevel(weatherData)).toBe('medium');
    });

    it('should return low risk for mild conditions', () => {
      const weatherData = {
        main: { humidity: 30, temp: 30 },
        weather: [{ main: 'Clear' }],
        wind: { speed: 5 }
      };
      expect(getMonsoonRiskLevel(weatherData)).toBe('low');
    });
  });

  describe('getWeatherSeverity', () => {
    it('should return severe for thunderstorms', () => {
      const weatherData = {
        weather: [{ main: 'Thunderstorm' }],
        wind: { speed: 15 },
        rain: { '3h': 30 }
      };
      expect(getWeatherSeverity(weatherData)).toBe('severe');
    });

    it('should return moderate for rain', () => {
      const weatherData = {
        weather: [{ main: 'Rain' }],
        wind: { speed: 8 },
        rain: { '3h': 10 }
      };
      expect(getWeatherSeverity(weatherData)).toBe('moderate');
    });

    it('should return mild for clear weather', () => {
      const weatherData = {
        weather: [{ main: 'Clear' }],
        wind: { speed: 3 }
      };
      expect(getWeatherSeverity(weatherData)).toBe('mild');
    });
  });

  describe('getWeatherApiKey', () => {
    it('should return a usable weather API key when env is missing', () => {
      const key = getWeatherApiKey();
      expect(key).toBeTruthy();
      expect(key).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('getWeatherConditionIcon', () => {
    it('should return correct icon for clear day', () => {
      expect(getWeatherConditionIcon('01d')).toBe('☀️');
    });

    it('should return correct icon for rain', () => {
      expect(getWeatherConditionIcon('10d')).toBe('🌦️');
    });

    it('should return default icon for unknown code', () => {
      expect(getWeatherConditionIcon('99d')).toBe('🌡️');
    });
  });
});
