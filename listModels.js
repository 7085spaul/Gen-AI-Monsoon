const fs = require("fs");
const https = require("https");
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/^VITE_GEMINI_API_KEY=(.+)$/m);
if (!match) {
  console.error('No VITE_GEMINI_API_KEY found in .env');
  process.exit(1);
}
const apiKey = match[1].trim();
const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: '/v1/models',
  method: 'GET',
  headers: {
    'x-goog-api-key': apiKey,
    'Content-Type': 'application/json'
  }
};
const req = https.request(options, res => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});
req.on('error', e => console.error('request error', e.message));
req.end();
