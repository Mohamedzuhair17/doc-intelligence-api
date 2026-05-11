import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://voiceai.dev'),
  title: 'VoiceAI — Never Miss a Customer Call Again',
  description:
    'AI-powered Voice Assistant platform that records, transcribes, and analyzes customer calls for Auto Repair Shops, Restaurants, and Medical Clinics.',
  keywords: ['Voice AI', 'customer calls', 'AI assistant', 'auto repair', 'restaurant', 'medical clinic', 'call analytics'],
  openGraph: {
    title: 'VoiceAI — Never Miss a Customer Call Again',
    description:
      'AI-powered Voice Assistant platform that records, transcribes, and analyzes customer calls for businesses.',
    url: 'https://voiceai.dev',
    siteName: 'VoiceAI',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VoiceAI Platform' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceAI — Never Miss a Customer Call Again',
    description: 'AI-powered Voice Assistant platform for businesses.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

import { ThemeProvider } from './context/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('voiceai-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || (!saved && prefersDark);
                  document.documentElement.classList.toggle('dark', isDark);
                  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
