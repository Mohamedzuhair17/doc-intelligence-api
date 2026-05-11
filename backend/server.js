// server.js - Express backend for message analysis

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

const PORT = process.env.PORT || 10000;

const GROQ_MODEL =
  process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',

    message: 'Doc Intelligence API is running',

    ai_engine: GROQ_API_KEY
      ? `groq (${GROQ_MODEL})`
      : 'rule-based fallback',

    endpoints: {
      health: 'GET /health',
      analyze: 'POST /analyze or POST /api/analyze',
    },
  });
});

// Health route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

const groq = GROQ_API_KEY
  ? new Groq({
      apiKey: GROQ_API_KEY,
    })
  : null;

// ------------------------------
// Rule-based fallback analyzer
// ------------------------------

function analyzeRuleBased(message) {
  const lower = message.toLowerCase();

  // Intent
  let intent = 'inquiry';

  if (
    /help|repair|fix|support|urgent|problem|issue|broken|not working|appointment|need/i.test(
      lower
    )
  ) {
    intent = 'service_request';
  }

  // Business type
  let business_type = 'general';

  if (
    /car|vehicle|engine|battery|brake|tire|garage|repair/i.test(
      lower
    )
  ) {
    business_type = 'auto_repair';
  } else if (
    /food|restaurant|menu|table|eat|delivery|dinner/i.test(
      lower
    )
  ) {
    business_type = 'restaurant';
  } else if (
    /doctor|clinic|medical|dentist|hospital|health/i.test(
      lower
    )
  ) {
    business_type = 'medical';
  }

  // Urgency
  let urgency = 'medium';

  if (
    /urgent|asap|immediately|today|emergency|30 minutes|now/i.test(
      lower
    )
  ) {
    urgency = 'high';
  }

  if (
    /later|next week|sometime|whenever/i.test(lower)
  ) {
    urgency = 'low';
  }

  // Summary
  const summary =
    intent === 'service_request'
      ? `Customer needs ${urgency} priority assistance for ${business_type.replace(
          '_',
          ' '
        )} issue.`
      : `Customer is inquiring about ${business_type.replace(
          '_',
          ' '
        )} services.`;

  return {
    intent,
    business_type,
    urgency,
    summary,
    source: 'rule_based',
  };
}

// ------------------------------
// Validation
// ------------------------------

function normalizeAnalyzeResponse(raw) {
  const allowedIntents = new Set([
    'service_request',
    'inquiry',
    'complaint',
    'booking',
  ]);

  const allowedBusinessTypes = new Set([
    'auto_repair',
    'restaurant',
    'medical',
    'general',
  ]);

  const allowedUrgency = new Set([
    'high',
    'medium',
    'low',
  ]);

  const intent = allowedIntents.has(raw?.intent)
    ? raw.intent
    : 'inquiry';

  const business_type = allowedBusinessTypes.has(
    raw?.business_type
  )
    ? raw.business_type
    : 'general';

  const urgency = allowedUrgency.has(raw?.urgency)
    ? raw.urgency
    : 'medium';

  const summary =
    typeof raw?.summary === 'string' &&
    raw.summary.trim()
      ? raw.summary.trim()
      : `Customer is inquiring about ${business_type.replace(
          '_',
          ' '
        )} services.`;

  return {
    intent,
    business_type,
    urgency,
    summary,
    source: 'groq_ai',
  };
}

// ------------------------------
// Groq AI Analyzer
// ------------------------------

async function analyzeWithGroq(message) {
  if (!groq) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const completion =
    await groq.chat.completions.create({
      model: GROQ_MODEL,

      temperature: 0,

      response_format: {
        type: 'json_object',
      },

      messages: [
        {
          role: 'system',

          content: `
You are an AI business message analyzer.

Analyze customer messages and return ONLY strict JSON.

Schema:
{
  "intent": "",
  "business_type": "",
  "urgency": "",
  "summary": ""
}

Intent:
- service_request
- inquiry
- complaint
- booking

Business Types:
- auto_repair
- restaurant
- medical
- general

Urgency:
- high
- medium
- low

Rules:
- Broken car, repair help, support needed → service_request
- Restaurant/food/table/order → restaurant
- Doctor/clinic/medical/dental → medical
- Emergency, ASAP, immediately, deadlines → urgency high

Return ONLY JSON.
          `,
        },

        {
          role: 'user',
          content: message,
        },
      ],
    });

  const text =
    completion.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error('Groq returned empty response');
  }

  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  return normalizeAnalyzeResponse(parsed);
}

// ------------------------------
// Main Analyze Handler
// ------------------------------

async function handleAnalyze(req, res) {
  const { message } = req.body;

  if (
    !message ||
    typeof message !== 'string' ||
    !message.trim()
  ) {
    return res.status(400).json({
      error:
        'Message is required and must be a non-empty string',
    });
  }

  try {
    let result;

    // Try AI first
    if (groq) {
      try {
        result = await analyzeWithGroq(
          message.trim()
        );
      } catch (aiError) {
        console.error(
          'Groq failed, using fallback:',
          aiError.message
        );

        result = analyzeRuleBased(message.trim());
      }
    } else {
      // Direct fallback
      result = analyzeRuleBased(message.trim());
    }

    return res.json(result);
  } catch (error) {
    console.error('Analyze failed:', error.message);

    return res.status(500).json({
      error: 'Analysis failed',
      details: error.message,
    });
  }
}

// Routes
app.post('/api/analyze', handleAnalyze);

app.post('/analyze', handleAnalyze);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,

    available: [
      'GET /',
      'GET /health',
      'POST /analyze',
      'POST /api/analyze',
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Backend listening on http://localhost:${PORT}`
  );
});