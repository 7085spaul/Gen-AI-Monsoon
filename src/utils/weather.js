import axios from 'axios';

const weatherApiKey = import.meta.env.VITE_WEATHERAPI_KEY;
const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!weatherApiKey) {
  console.error('VITE_WEATHERAPI_KEY is not set in environment variables. Please set VITE_WEATHERAPI_KEY to your WeatherAPI.com key.');
}

if (!openWeatherApiKey) {
  console.warn('VITE_OPENWEATHER_API_KEY is not set. OpenWeather alerts will be disabled.');
}

const BASE_URL = 'https://api.weatherapi.com/v1';

export async function getCurrentWeather(location) {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: weatherApiKey,
        q: location,
        aqi: 'yes'
      }
    });
    
    // Transform WeatherAPI.com response to match our expected format
    const data = response.data;
    return {
      name: data.location.name,
      coord: { 
        lat: data.location.lat, 
        lon: data.location.lon 
      },
      weather: [{ 
        main: data.current.condition.text,
        description: data.current.condition.text.toLowerCase(),
        icon: data.current.condition.icon
      }],
      main: {
        temp: data.current.temp_c,
        feels_like: data.current.feelslike_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb
      },
      wind: {
        speed: data.current.wind_kph / 3.6, // Convert kph to m/s
        deg: data.current.wind_degree
      },
      sys: {
        country: data.location.country,
        sunrise: 0, // WeatherAPI doesn't provide this in current endpoint
        sunset: 0
      }
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Failed to fetch weather data. Please check the location and try again.');
  }
}

export async function getWeatherForecast(location, days = 5) {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: weatherApiKey,
        q: location,
        days: days,
        aqi: 'yes'
      }
    });
    
    // Transform WeatherAPI.com response to match our expected format
    const data = response.data;
    const forecastList = [];
    
    data.forecast.forecastday.forEach(day => {
      day.hour.forEach(hour => {
        forecastList.push({
          dt: hour.time_epoch,
          main: {
            temp: hour.temp_c,
            humidity: hour.humidity,
            pressure: hour.pressure_mb
          },
          weather: [{
            main: hour.condition.text,
            description: hour.condition.text.toLowerCase(),
            icon: hour.condition.icon
          }],
          wind: {
            speed: hour.wind_kph / 3.6, // Convert kph to m/s
            deg: hour.wind_degree
          }
        });
      });
    });
    
    return {
      list: forecastList,
      city: {
        name: data.location.name,
        country: data.location.country
      }
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw new Error('Failed to fetch weather forecast. Please try again.');
  }
}

export async function getWeatherAlerts(location) {
  if (!openWeatherApiKey) {
    return [];
  }

  try {
    // First get coordinates from location name
    const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: location,
        appid: openWeatherApiKey,
        limit: 1
      }
    });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lon } = geoResponse.data[0];

    // Get weather alerts using coordinates
    const response = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat: lat,
        lon: lon,
        appid: openWeatherApiKey,
        exclude: 'minutely,hourly'
      }
    });

    return response.data.alerts || [];
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    // Return empty array if alerts not available
    return [];
  }
}

export function getWeatherConditionIcon(weatherCode) {
  const iconMap = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
  };
  return iconMap[weatherCode] || '🌡️';
}

export function getWeatherSeverity(weatherData) {
  const condition = weatherData.weather[0].main.toLowerCase();
  const windSpeed = weatherData.wind.speed;
  const rainfall = weatherData.rain?.['3h'] || 0;

  if (condition.includes('thunderstorm') || windSpeed > 20 || rainfall > 50) {
    return 'severe';
  } else if (condition.includes('rain') || windSpeed > 10 || rainfall > 20) {
    return 'moderate';
  } else {
    return 'mild';
  }
}

export function getMonsoonRiskLevel(weatherData) {
  const humidity = weatherData.main.humidity;
  const condition = weatherData.weather[0].main.toLowerCase();
  const windSpeed = weatherData.wind.speed;

  let riskScore = 0;

  // Humidity factor (monsoon typically has high humidity)
  if (humidity > 80) riskScore += 3;
  else if (humidity > 60) riskScore += 2;
  else if (humidity > 40) riskScore += 1;

  // Weather condition factor
  if (condition.includes('rain') || condition.includes('drizzle')) riskScore += 3;
  else if (condition.includes('cloud')) riskScore += 2;
  else if (condition.includes('clear')) riskScore += 0;

  // Wind speed factor
  if (windSpeed > 15) riskScore += 2;
  else if (windSpeed > 8) riskScore += 1;

  if (riskScore >= 6) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
}
