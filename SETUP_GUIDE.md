# Setup Guide - Monsoon Preparedness AI

This guide will help you set up the Monsoon Preparedness AI application from scratch.

## Step 1: Get API Keys

### Google Gemini API Key
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Save it securely - you'll need it for setup

### OpenWeatherMap API Key
1. Visit https://openweathermap.org/api
2. Click "Sign Up" (free account)
3. Fill in your details and verify your email
4. Navigate to the "API keys" tab in your account
5. Your default API key will be displayed
6. Copy this key

### Firebase (Optional but Recommended)
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name (e.g., "monsoon-preparedness")
4. Disable Google Analytics (optional)
5. Click "Create project"
6. Once created, go to Project Settings
7. Scroll down to "Your apps" section
8. Click "Web" icon (</>)
9. Register app with a name (e.g., "Monsoon App")
10. Copy the firebaseConfig object

## Step 2: Install Dependencies

Open your terminal in the project directory:

```bash
cd c:/Users/NANDAGIRI\ MYTHRI/Downloads/GENAI
npm install
```

This will install all required packages including:
- React and React DOM
- Google Generative AI SDK
- Firebase SDK
- Axios for API calls
- TailwindCSS and dependencies
- Vitest for testing

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` in a text editor

3. Add your API keys:

```env
# Required APIs
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_OPENWEATHER_API_KEY=your_actual_openweather_api_key_here

# Optional Firebase (for full functionality)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Save the file

## Step 4: Run the Application

### Development Mode
```bash
npm run dev
```

The application will start at http://localhost:3000

### Production Build
```bash
npm run build
npm run preview
```

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser

2. **Set Location**: Enter your city name (e.g., "Mumbai", "Delhi")

3. **Complete Profile**: Click "Profile" and fill in:
   - Family size
   - Housing type
   - Whether you have children, elderly, or pets
   - Any medical conditions

4. **Test Features**:
   - **Weather Dashboard**: View current weather and forecast
   - **Preparedness Plan**: Generate a personalized plan
   - **Emergency Checklist**: Create checklists for different scenarios
   - **Travel Advisory**: Get travel recommendations
   - **Safety Tips**: View safety recommendations
   - **Real-time Alerts**: Monitor weather alerts
   - **Multilingual**: Test translation features
   - **AI Chat**: Ask questions about monsoon safety

## Step 6: Run Tests

```bash
npm test
```

This will run all unit tests and verify the application functionality.

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Ensure you've created the `.env` file
- Verify the API key is correctly set
- Restart the development server after creating `.env`

### "Failed to fetch weather data"
- Verify your OpenWeatherMap API key
- Check that you have a stable internet connection
- Ensure the location name is spelled correctly

### "Firebase Auth is not initialized"
- This is normal if you haven't set up Firebase
- The app will work without Firebase (data won't persist)
- Follow Firebase setup steps above for full functionality

### TailwindCSS styles not working
- Ensure you've run `npm install`
- Check that `postcss.config.js` and `tailwind.config.js` exist
- Restart the development server

## API Key Limits

### Google Gemini API
- Free tier: 15 requests per minute
- Monitor usage in Google AI Studio
- Upgrade if needed for higher usage

### OpenWeatherMap API
- Free tier: 1,000 calls/day
- Current weather and forecast endpoints
- Subscribe for higher limits if needed

## Next Steps

1. **Customize the UI**: Modify TailwindCSS classes in components
2. **Add More Languages**: Extend the multilingual support
3. **Enhance AI Prompts**: Improve prompt engineering in `gemini.js`
4. **Add More Features**: Extend with additional weather-related features
5. **Deploy**: Deploy to Vercel, Netlify, or Firebase Hosting

## Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Run: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the main README.md
3. Check API documentation links
4. Verify API key quotas and limits

---

**Ready to help communities stay safe during monsoon season!**
