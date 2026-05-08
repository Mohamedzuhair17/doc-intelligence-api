// server.js - Express backend for message analysis
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route - fixes "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Doc Intelligence API is running',
    endpoints: {
      health: 'GET /health',
      analyze: 'POST /analyze or POST /api/analyze'
    }
  });
});

// Health check - useful for Render uptime monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple rule-based analyzer
function analyzeMessage(message) {
  const lower = message.toLowerCase();

  // Intent detection
  let intent = /help|issue|problem|support|repair|appointment/.test(lower)
    ? 'service_request'
    : 'inquiry';

  // Business type detection
  let business_type = 'general';
  if (/car|vehicle|engine|repair|tire|brake/.test(lower)) business_type = 'auto_repair';
  else if (/food|order|menu|restaurant|table|eat/.test(lower)) business_type = 'restaurant';
  else if (/dentist|doctor|clinic|medical|dental|health|sick/.test(lower)) business_type = 'medical';

  // Urgency detection
  let urgency = /now|immediately|urgent|today|asap|fast|quick/.test(lower) ? 'high' : 'medium';

  // Summary
  let summary = '';
  if (intent === 'service_request') {
    summary = `Customer needs ${urgency === 'high' ? 'urgent ' : ''}assistance for ${business_type.replace('_', ' ')} issue.`;
  } else {
    summary = `Customer is inquiring about ${business_type.replace('_', ' ')} services.`;
  }

  return { intent, business_type, urgency, summary };
}

function handleAnalyze(req, res) {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }
  const result = analyzeMessage(message.trim());
  return res.json(result);
}

app.post('/api/analyze', handleAnalyze);
app.post('/analyze', handleAnalyze);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ 
    error: `Route ${req.method} ${req.path} not found`,
    available: ['GET /', 'GET /health', 'POST /analyze', 'POST /api/analyze']
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});