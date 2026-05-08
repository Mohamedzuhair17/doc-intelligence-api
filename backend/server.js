// server.js - Express backend for message analysis
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const app = express();
const PORT = process.env.PORT || 10000;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

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
    ai_engine: GROQ_API_KEY ? `groq (${GROQ_MODEL})` : 'not configured (missing GROQ_API_KEY)',
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

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

function normalizeAnalyzeResponse(raw) {
  const allowedIntents = new Set(['service_request', 'inquiry']);
  const allowedBusinessTypes = new Set(['auto_repair', 'restaurant', 'medical', 'general']);
  const allowedUrgency = new Set(['high', 'medium', 'low']);

  const intent = allowedIntents.has(raw?.intent) ? raw.intent : 'inquiry';
  const business_type = allowedBusinessTypes.has(raw?.business_type) ? raw.business_type : 'general';
  const urgency = allowedUrgency.has(raw?.urgency) ? raw.urgency : 'medium';
  const summary = typeof raw?.summary === 'string' && raw.summary.trim()
    ? raw.summary.trim()
    : `Customer is inquiring about ${business_type.replace('_', ' ')} services.`;

  return { intent, business_type, urgency, summary };
}

async function analyzeWithGroq(message) {
  if (!groq) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You classify customer messages. Output must be strict JSON with keys: intent, business_type, urgency, summary.',
      },
      {
        role: 'user',
        content: `Analyze this customer message and return JSON only.

Message:
"${message}"

Use schema:
{
  "intent": "service_request" | "inquiry",
  "business_type": "auto_repair" | "restaurant" | "medical" | "general",
  "urgency": "high" | "medium" | "low",
  "summary": "short single sentence"
}`,
      },
    ],
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('Groq returned empty response');
  }
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(cleaned);
  return normalizeAnalyzeResponse(parsed);
}

async function handleAnalyze(req, res) {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
  }

  try {
    const result = await analyzeWithGroq(message.trim());
    return res.json(result);
  } catch (error) {
    console.error('Groq analyze failed:', error.message);
    return res.status(500).json({
      error: 'AI analysis failed',
      details: error.message,
    });
  }
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