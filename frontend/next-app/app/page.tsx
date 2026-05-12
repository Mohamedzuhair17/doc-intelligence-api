'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Analyzer', href: '#analyzer' },
];

const HOW_IT_WORKS_STEPS = [
  { num: '01', title: 'Call Capture', desc: 'Incoming calls are captured via Twilio VoIP integration in real time.', icon: '📞' },
  { num: '02', title: 'Transcription', desc: 'Speech-to-text powered by OpenAI Whisper with 99% accuracy.', icon: '📝' },
  { num: '03', title: 'AI Analysis', desc: 'Our engine extracts intent, urgency, and business type instantly.', icon: '🤖' },
  { num: '04', title: 'Actionable Insight', desc: 'Results appear in your dashboard with recommended next actions.', icon: '📊' },
];

const USE_CASES = [
  {
    title: 'Auto Repair Shop',
    icon: '🚗',
    desc: 'Capture service requests automatically. Schedule appointments and follow-ups without missing a single call from worried car owners.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Restaurant',
    icon: '🍽️',
    desc: 'Handle reservation calls, takeout orders, and catering inquiries seamlessly — even during the dinner rush.',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Medical / Dental Clinic',
    icon: '🩺',
    desc: 'Triage patient calls by urgency, schedule appointments, and ensure no critical health inquiry goes unanswered.',
    color: 'from-green-500 to-emerald-500',
  },
];

const PRICING_PLANS = [
  { tier: 'Starter', price: '$29', period: '/mo', features: ['100 calls/month', 'Basic analytics dashboard', 'Email support', 'Single location'], popular: false },
  { tier: 'Growth', price: '$79', period: '/mo', features: ['500 calls/month', 'Advanced AI insights', 'Priority support', 'Up to 5 locations', 'CRM integration'], popular: true },
  { tier: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited calls', 'Custom AI models', 'Dedicated account manager', 'Unlimited locations', 'API access', 'SLA guarantee'], popular: false },
];

const FAQ_ITEMS = [
  { q: 'Is there a free trial?', a: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required.' },
  { q: 'Do you store call recordings?', a: 'Call recordings are stored securely and automatically deleted after 30 days unless you choose to keep them longer.' },
  { q: 'Can I integrate with my existing CRM?', a: 'Absolutely. We provide webhooks and native integrations for HubSpot, Salesforce, Zoho, and more. Custom integrations available on Enterprise plans.' },
  { q: 'What languages are supported?', a: 'Our AI currently supports English, Spanish, French, German, and Mandarin, with more languages being added quarterly.' },
  { q: 'What support is available?', a: '24/7 email support for all plans. Growth and Enterprise plans include priority phone support and a dedicated account manager.' },
];

export default function Home() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileNav, setMobileNav] = useState(false);

  // ✅ FIX: Prevents SSR/client hydration mismatch for theme-dependent rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAnalysis = async (message: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await fetchAnalysis(message);
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to analyze. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b-2 border-gray-300 dark:border-gray-700">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            VoiceAI
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* ✅ FIX: Render a consistent placeholder until mounted to avoid hydration mismatch */}
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {mounted ? (darkMode ? '☀️' : '🌙') : '🌙'}
            </button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileNav(!mobileNav)}
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileNav
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile nav dropdown */}
        {mobileNav && (
          <ul className="md:hidden bg-white dark:bg-gray-950 border-b-2 border-gray-300 dark:border-gray-700 px-6 pb-4 space-y-3 text-sm font-medium animate-fadeIn">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMobileNav(false)} className="block hover:text-indigo-600 dark:hover:text-indigo-400">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <main>
        {/* ─── Hero Section ─── */}
        <section id="hero" className="relative overflow-hidden py-24 md:py-36">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-10 dark:opacity-20 animate-gradient" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="transition-all duration-700 opacity-100 translate-y-0">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
                AI-Powered Voice Platform
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                Never Miss a<br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Customer Call Again
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                AI-powered Voice Assistant that records, transcribes, and analyzes every client interaction — so you can focus on running your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#analyzer"
                  id="cta-try-demo"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
                >
                  Try Demo →
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 border-2 border-gray-500 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white/70 dark:bg-gray-900/30 rounded-full font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">Four simple steps to transform your customer communications.</p>
            <div className="grid md:grid-cols-4 gap-8">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div key={step.num} className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-400 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <span className="text-xs font-bold text-indigo-500 tracking-wider">STEP {step.num}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Use Cases ─── */}
        <section id="use-cases" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Use Cases</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">Tailored solutions for businesses that depend on customer calls.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {USE_CASES.map((caseItem) => (
                <div key={caseItem.title} className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-400 dark:border-gray-600 hover:shadow-2xl transition-all duration-300">
                  <div className={`h-2 bg-gradient-to-r ${caseItem.color}`} />
                  <div className="p-8">
                    <div className="text-5xl mb-4">{caseItem.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{caseItem.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{caseItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">Start free. Scale as you grow. No hidden fees.</p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PRICING_PLANS.map((plan) => (
                <div key={plan.tier} className={`relative bg-white dark:bg-gray-800 p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-105' : 'border-gray-300 dark:border-gray-600'}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.tier}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/coming-soon"
                    className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {plan.tier === 'Enterprise' ? 'Contact Sales' : `Get ${plan.tier}`}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-14">Everything you need to know about VoiceAI.</p>
            <dl className="space-y-6">
              {FAQ_ITEMS.map((faq, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border-2 border-gray-400 dark:border-gray-600">
                  <dt className="font-semibold text-lg mb-2">{faq.q}</dt>
                  <dd className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── Mini AI Analyzer ─── */}
        <section id="analyzer" className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Mini AI Customer Message Analyzer</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-10">Enter a customer message and our AI will classify intent, business type, and urgency.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                id="analyzer-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='e.g. "My car won&#39;t start and I need help today."'
                className="w-full h-36 p-4 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-sm"
                maxLength={500}
                required
              />
              <button
                id="analyzer-submit"
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing…
                  </span>
                ) : 'Analyze Message'}
              </button>
            </form>

            {/* Result card */}
            {result && (
              <div id="analyzer-result" className="mt-8 animate-fadeIn">
                <h3 className="text-lg font-bold mb-4">Analysis Result:</h3>
                <div className="bg-[#0d1117] text-gray-300 p-6 rounded-xl border border-gray-800 shadow-2xl font-mono text-sm overflow-x-auto">
                  {'error' in result ? (
                    <div className="text-red-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{result.error}</span>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">
{`{
  "intent": "${result.intent}",
  "business_type": "${result.business_type}",
  "urgency": "${result.urgency}",
  "summary": "${result.summary}"
}`}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">VoiceAI</h3>
              <p className="text-sm leading-relaxed">AI-powered voice assistant platform for businesses. Never miss a customer call again.</p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#hero" className="hover:text-indigo-400 transition-colors">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a></li>
                <li><a href="#use-cases" className="hover:text-indigo-400 transition-colors">Use Cases</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
                <li><a href="#analyzer" className="hover:text-indigo-400 transition-colors">Demo</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:hello@voiceai.dev" className="hover:text-indigo-400 transition-colors">hello@voiceai.dev</a></li>
                <li><a href="#analyzer" className="hover:text-indigo-400 transition-colors">Request a Demo</a></li>
              </ul>
            </div>

            {/* External Resources */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.twilio.com/en-us/voice" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Twilio Voice API ↗</a></li>
                <li><a href="https://openai.com/research/whisper" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">OpenAI Whisper ↗</a></li>
                <li><a href="https://stripe.com/payments" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Stripe Payments ↗</a></li>
                <li><a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Google Business ↗</a></li>
                <li><a href="https://cloud.google.com/speech-to-text" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Google Speech-to-Text ↗</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} VoiceAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
