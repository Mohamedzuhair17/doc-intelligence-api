# VoiceAI - AI-Powered Customer Communication Platform

A production-ready full-stack Voice AI platform that analyzes customer messages to extract intent, business type, and urgency. Built for businesses like auto repair shops, restaurants, and medical clinics.

## 🚀 Live Demo

- **Frontend**: Deployed on Vercel
- **Backend API**: Deployed on Render
- **AI Engine**: Groq AI with rule-based fallback

## ✨ Features

### 🎯 Smart Message Analysis
- **Intent Detection**: service_request, inquiry, complaint, booking
- **Business Classification**: auto_repair, restaurant, medical, general
- **Urgency Assessment**: high, medium, low priority
- **Natural Language Summaries**: Human-readable analysis results

### 🎨 Modern Web Application
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: System-aware theme with smooth transitions
- **Interactive UI**: Loading states, error handling, animations
- **SEO Optimized**: Complete metadata, Open Graph tags, structured data

### 🏗️ Production Architecture
- **Microservices**: Separated frontend and backend
- **Reliability**: Dual AI engine with intelligent fallback
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized API calls, input validation, caching

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks, Context API
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **AI Integration**: Groq SDK (Llama 3.3 70B)
- **Fallback Engine**: Custom rule-based analysis
- **Deployment**: Render

## 📁 Project Structure

```
hackathon/
├── frontend/
│   └── next-app/
│       ├── app/
│       │   ├── page.tsx          # Main landing page
│       │   ├── layout.tsx         # Root layout with metadata
│       │   └── context/
│       │       └── ThemeContext.tsx  # Dark mode management
│       ├── package.json
│       └── tsconfig.json
├── backend/
│   ├── server.js                 # Express API server
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Add your GROQ_API_KEY
npm start
```
Backend runs on `http://localhost:10000`

### 2. Frontend Setup
```bash
cd frontend/next-app
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=10000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:10000
```

## 📡 API Documentation

### Analyze Message
**Endpoint**: `POST /api/analyze` or `POST /analyze`

**Request**:
```json
{
  "message": "My car won't start and I need help today."
}
```

**Response**:
```json
{
  "intent": "service_request",
  "business_type": "auto_repair", 
  "urgency": "high",
  "summary": "Customer needs urgent assistance for auto repair issue.",
  "source": "groq_ai"
}
```

### Health Check
**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧠 AI Analysis Engine

### Primary: Groq AI
- **Model**: Llama 3.3 70B Versatile
- **Temperature**: 0 (consistent results)
- **Format**: Structured JSON output
- **Context**: Optimized prompts for business message analysis

### Fallback: Rule-Based System
- **Pattern Matching**: Regex-based keyword detection
- **Intent Rules**: Service requests, inquiries, complaints, bookings
- **Business Rules**: Auto repair, restaurant, medical classification
- **Urgency Rules**: Time-based and emergency keyword detection

## 🎯 Use Cases

### Auto Repair Shops
- Service requests and appointment scheduling
- Urgency detection for breakdown situations
- Customer inquiry triage

### Restaurants
- Reservation and order management
- Delivery and takeout requests
- Customer service automation

### Medical Clinics
- Patient triage by urgency
- Appointment scheduling
- Medical inquiry classification

## 🔒 Security & Reliability

### Input Validation
- Message length limits (500 characters)
- Content sanitization
- Type checking and validation

### Error Handling
- API request failure recovery
- Graceful degradation to fallback engine
- User-friendly error messages
- Comprehensive logging

### Performance
- Response time optimization
- Efficient regex patterns
- Minimal API payload sizes
- Frontend loading states

## 📱 Responsive Design

- **Mobile**: Optimized for phones and tablets
- **Desktop**: Enhanced experience on larger screens
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: Optimized images, lazy loading, minimal bundle size

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend/next-app
npm run build
vercel --prod
```

### Backend (Render)
- Connected to GitHub repository
- Auto-deployment on main branch push
- Environment variables configured in Render dashboard

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Best Practices**: Modern React patterns, error boundaries

### Browser Compatibility
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement

## 📈 Future Enhancements

- **Real-time Voice**: WebRTC integration for live call analysis
- **Advanced AI**: Custom model fine-tuning for specific industries
- **Multi-language**: Support for international customers
- **CRM Integration**: HubSpot, Salesforce, Zoho connectors
- **Analytics Dashboard**: Detailed insights and reporting
- **Mobile App**: React Native companion application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Mohamed Zuhair**
- Full Stack Developer
- VoiceAI Platform Developer
- [GitHub](https://github.com/Mohamedzuhair17)

---

**Built with ❤️ for modern businesses that never want to miss a customer call again.**
