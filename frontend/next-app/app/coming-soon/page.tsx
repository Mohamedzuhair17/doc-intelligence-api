'use client';

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function ComingSoon() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-6 relative">
      {/* Dark mode toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Something Big is Coming
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10">
          We're currently polishing our dashboard and integration tools to give you the best experience possible. Stay tuned!
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
