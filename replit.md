# JAMB CBT Practice App

## Overview
A modern Computer-Based Test (CBT) practice application for JAMB UTME preparation. Built with React + Vite, featuring AI-powered learning assistance via Google Gemini 2.5 Flash.

## Current State
Version 2.0.0 - AI-powered release with the following major features:
- Gemini 2.5 Flash AI integration with image understanding
- Persistent conversation memory for AI assistant
- Offline question storage via IndexedDB
- AI-generated flashcards based on JAMB syllabus
- Dynamic novel analysis generation for Literature

## Tech Stack
- Frontend: React 18 with Vite
- State Management: Zustand
- Styling: Tailwind CSS
- Animations: Framer Motion
- AI: Google Gemini 2.5 Flash API
- Offline Storage: IndexedDB
- Questions API: ALOC API

## Project Structure
```
cbt-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIAssistant.jsx  # AI chat interface with image upload
│   │   ├── Flashcards.jsx   # AI-generated flashcard system
│   │   ├── Dictionary.jsx   # Word lookup component
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── NovelPage.jsx    # Literature study with AI generation
│   │   ├── Settings.jsx     # App settings
│   │   └── ...
│   ├── services/            # API and service layers
│   │   ├── aiService.js     # Gemini AI integration
│   │   ├── api.js           # ALOC API for questions
│   │   └── offlineStorage.js # IndexedDB operations
│   ├── data/
│   │   └── jambSyllabus.js  # JAMB syllabus topics for all subjects
│   └── store/
│       └── useStore.js      # Zustand state management
└── vite.config.js           # Vite configuration
```

## Key Features

### AI Assistant (Ilom)
- Powered by Gemini 2.5 Flash with vision capabilities
- Supports image upload for diagram/graph analysis
- Maintains conversation history across sessions
- Provides detailed explanations with structured breakdowns
- Subject-specific study tips

### Offline Support
- Questions cached to IndexedDB (not browser cache)
- Works offline with previously cached questions
- Flashcards stored locally
- Novel analyses saved for offline access

### Flashcard System
- AI-generated flashcards based on JAMB syllabus topics
- Covers all 15 JAMB subjects
- Study mode with progress tracking
- Manual card creation supported

### Novel Analysis
- Dynamic generation via AI for any JAMB Literature text
- Generates: plot summary, chapters, characters, themes, literary devices
- Creates practice questions with explanations
- Replaces hardcoded content with flexible AI generation

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (stored as secret)

## JAMB Subjects Covered
English, Mathematics, Physics, Chemistry, Biology, Literature, Government, Commerce, Accounting, Economics, CRK, IRK, Geography, Agricultural Science, History

## Recent Changes (December 2025)
- Upgraded from Poe API to Gemini 2.5 Flash
- Added image analysis capability to AI assistant
- Implemented persistent AI conversation memory
- Created comprehensive JAMB syllabus data for flashcard generation
- Replaced hardcoded "Lekki Headmaster" with dynamic novel generation
- Removed all "Powered by ALOC" branding
- Enhanced offline storage with proper IndexedDB implementation
- Removed all code comments for cleaner production code

## Development
Run `npm run dev` in the cbt-app directory to start the development server on port 5000.

## User Preferences
- Dark theme by default
- No code comments in production code
- Clean, professional UI without external branding
