import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

if (!geminiApiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

function getGeminiModel() {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY environment variable.');
  }
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

async function generateGeminiResponse(prompt) {
  try {
    if (!geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return parseGeminiResponse(text);
  } catch (error) {
    console.error('[v0] Gemini API error:', error);
    throw error;
  }
}

export async function generatePreparednessPlan(userProfile, weatherData) {
  try {
    const prompt = `As an emergency preparedness expert, create a personalized monsoon preparedness plan based on the following information:

User Profile:
- Location: ${userProfile.location}
- Family Size: ${userProfile.familySize}
- Has Children: ${userProfile.hasChildren}
- Has Elderly: ${userProfile.hasElderly}
- Has Pets: ${userProfile.hasPets}
- Housing Type: ${userProfile.housingType}
- Medical Conditions: ${userProfile.medicalConditions || 'None'}

Current Weather Conditions:
- Temperature: ${weatherData.main.temp}°C
- Humidity: ${weatherData.main.humidity}%
- Weather: ${weatherData.weather[0].description}
- Wind Speed: ${weatherData.wind.speed} m/s

Provide a comprehensive preparedness plan with:
1. Immediate actions needed
2. Emergency supplies checklist
3. Home preparation steps
4. Family communication plan
5. Evacuation routes if needed
6. Special considerations based on user profile

Format the response as structured JSON with clear categories.`;

    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Error generating preparedness plan:', error);
    throw new Error('Failed to generate preparedness plan. Please try again.');
  }
}

export async function generateEmergencyChecklist(scenario, userProfile) {
  try {
    const prompt = `Create a detailed emergency checklist for ${scenario} scenario.

User Context:
- Location: ${userProfile.location}
- Family Size: ${userProfile.familySize}
- Has Children: ${userProfile.hasChildren}
- Has Elderly: ${userProfile.hasElderly}
- Has Pets: ${userProfile.hasPets}

Provide a comprehensive checklist with:
1. Essential items (priority order)
2. Important documents
3. Medical supplies
4. Communication devices
5. Food and water requirements
6. Special items for children/elderly/pets

Format as structured JSON with categories and items with completion status.`;

    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Error generating emergency checklist:', error);
    throw new Error('Failed to generate emergency checklist. Please try again.');
  }
}

export async function generateTravelAdvisory(origin, destination, weatherData) {
  try {
    const prompt = `Provide travel advisory for journey from ${origin} to ${destination} during monsoon season.

Current Weather Conditions:
- Origin Weather: ${weatherData.origin?.weather[0]?.description || 'N/A'}
- Destination Weather: ${weatherData.destination?.weather[0]?.description || 'N/A'}
- Temperature: ${weatherData.origin?.main?.temp || 'N/A'}°C

Provide:
1. Travel risk assessment (Low/Medium/High)
2. Recommended departure times
3. Route suggestions
4. Vehicle preparation checklist
5. Emergency contacts along the route
6. Alternative transportation options
7. Items to carry

Format as structured JSON with clear sections.`;

    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Error generating travel advisory:', error);
    throw new Error('Failed to generate travel advisory. Please try again.');
  }
}

export async function generateSafetyRecommendations(weatherCondition, location) {
  try {
    const prompt = `Provide safety recommendations for ${weatherCondition} conditions in ${location}.

Include:
1. Immediate safety measures
2. Outdoor activity guidelines
3. Home safety precautions
4. Electrical safety tips
5. Water safety measures
6. Health precautions
7. When to evacuate

Format as structured JSON with priority levels (High/Medium/Low).`;

    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Error generating safety recommendations:', error);
    throw new Error('Failed to generate safety recommendations. Please try again.');
  }
}

export async function translateContent(content, targetLanguage) {
  try {
    const prompt = `Translate the following content to ${targetLanguage}. Maintain the structure and formatting:

${JSON.stringify(content)}

Return the translated content in the same JSON structure.`;

    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Error translating content:', error);
    throw new Error('Failed to translate content. Please try again.');
  }
}

export async function generateRealTimeAlert(weatherData, location) {
  try {
    const prompt = `Generate a real-time weather alert for ${location} based on current conditions:

Weather Data:
- Condition: ${weatherData.weather[0].description}
- Temperature: ${weatherData.main.temp}°C
- Humidity: ${weatherData.main.humidity}%
- Wind Speed: ${weatherData.wind.speed} m/s
- Pressure: ${weatherData.main.pressure} hPa

Provide:
1. Alert level (Green/Yellow/Orange/Red)
2. Alert title
3. Detailed description
4. Recommended actions
5. Timeline (when to expect changes)
6. Affected areas

Format as structured JSON.`;

    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Error generating real-time alert:', error);
    throw new Error('Failed to generate alert. Please try again.');
  }
}

export function parseGeminiResponse(text) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, return structured text
    return {
      rawResponse: text,
      sections: text.split('\n\n').filter(section => section.trim())
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      rawResponse: text,
      error: 'Failed to parse structured response'
    };
  }
}

export async function chatWithAI(message, context) {
  try {
    if (!geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    const model = getGeminiModel();
    
    const prompt = `You are a monsoon preparedness assistant. Answer the user's question based on the context.

Context: ${JSON.stringify(context)}

User Question: ${message}

Provide helpful, accurate, and actionable information about monsoon preparedness.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('[v0] AI chat error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}
