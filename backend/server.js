// server.js - Express backend for message analysis
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple rule‑based analyzer
function analyzeMessage(message) {
  const lower = message.toLowerCase();
  
  // Intent detection
  let intent = /help|issue|problem|support|repair|appointment/.test(lower) ? 'service_request' : 'inquiry';
  
  // Business type detection
  let business_type = 'general';
  if (/car|vehicle|engine|repair|tire|brake/.test(lower)) business_type = 'auto_repair';
  else if (/food|order|menu|restaurant|table|eat/.test(lower)) business_type = 'restaurant';
  else if (/dentist|doctor|clinic|medical|dental|health|sick/.test(lower)) business_type = 'medical';
  
  // Urgency detection
  let urgency = /now|immediately|urgent|today|asap|fast|quick/.test(lower) ? 'high' : 'medium';
  
  // Summary (more natural language)
  let summary = '';
  if (intent === 'service_request') {
    summary = `Customer needs ${urgency === 'high' ? 'urgent ' : ''}assistance for ${business_type.replace('_', ' ')} issue.`;
  } else {
    summary = `Customer is inquiring about ${business_type.replace('_', ' ')} services.`;
  }
  
  return { intent, business_type, urgency, summary };
}

app.post('/api/analyze', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  const result = analyzeMessage(message);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
