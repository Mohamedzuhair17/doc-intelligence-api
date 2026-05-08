# Voice AI Startup Assignment

This repository contains a full-stack Voice AI landing page and a mini AI customer message analyzer.

## Project Structure
- `frontend/next-app/`: Next.js (App Router) + Tailwind CSS + TypeScript.
- `backend/`: Node.js (Express) + Body-parser.

## Features
- **Responsive Landing Page**: Hero, How It Works, Use Cases, Pricing, FAQ, Footer.
- **Mini AI Analyzer**: Message classification (Intent, Business Type, Urgency, Summary).
- **Persistent Dark Mode**: LocalStorage-based theme persistence across routes/refreshes.
- **SEO Ready**: Proper metadata, OpenGraph tags, Sitemap, and Robots.txt.
- **Premium UI**: Glassmorphism design with smooth transitions and animations.

## Setup Instructions

### 1. Backend (Node.js)
```bash
cd backend
npm install
node server.js
```
The server will run on `http://localhost:5000`.

### 2. Frontend (Next.js)
```bash
cd frontend/next-app
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## Test Prompts
- "My car won't start and I need help today."
- "I would like to see your dinner menu for tonight."
- "I have a severe toothache and need a dentist asap."

---

*Part of the Full Stack Intern Assignment for AugmentPath Strategy.*
