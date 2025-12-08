# JAMB CBT Practice Application

## Overview
A comprehensive JAMB CBT (Computer-Based Test) practice application built with React/Vite. The app provides multiple practice modes, offline support, and a modern user interface for Nigerian students preparing for UTME examinations.

## Recent Changes (December 2024)
- Added Study Mode with multi-subject selection, no timer, and instant answer feedback
- Implemented User Profile system with avatar upload (stored in IndexedDB), stats tracking, achievements
- Added Results Modal popup that appears after completing any exam/practice session
- Enhanced offline caching with improved IndexedDB storage and service worker
- Updated Analytics page to include study session history
- Enhanced UI/UX with TestDriller-like modern design

## Project Architecture
```
cbt-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx       # Main app layout with navigation
│   │   ├── Calculator.jsx   # Scientific calculator
│   │   ├── Dictionary.jsx   # Word lookup
│   │   ├── AIAssistant.jsx  # AI study helper
│   │   ├── VoiceReader.jsx  # Text-to-speech
│   │   ├── Notifications.jsx # Toast notifications
│   │   └── ResultsModal.jsx # Post-exam results popup
│   ├── pages/
│   │   ├── Dashboard.jsx    # Home page with mode selection
│   │   ├── Study.jsx        # Study mode practice
│   │   ├── StudySetup.jsx   # Study mode configuration
│   │   ├── Profile.jsx      # User profile management
│   │   ├── Exam.jsx         # Exam/practice interface
│   │   ├── Results.jsx      # Detailed results view
│   │   ├── Analytics.jsx    # Performance tracking
│   │   └── ...
│   ├── store/
│   │   └── useStore.js      # Zustand state management
│   ├── services/
│   │   └── api.js           # ALOC API integration with offline caching
│   └── App.jsx              # Main app with routes
├── public/
│   ├── sw.js                # Service worker for PWA/offline
│   └── manifest.json        # PWA manifest
└── vite.config.js           # Vite config (port 5000)
```

## Key Features
1. **Practice Mode** - Timed practice for single subjects
2. **Full Exam Mode** - 4-subject JAMB simulation (180 mins)
3. **Study Mode** - No timer, instant feedback, show answer button
4. **User Profiles** - Local profiles with avatar, stats, achievements
5. **Offline Support** - Questions cached in IndexedDB
6. **Analytics** - Score tracking, progress charts
7. **Bookmarks** - Save questions for later review

## API Integration
- Uses ALOC (African Library of Concepts) API for JAMB questions
- API URL: https://questions.aloc.com.ng/api/v2
- Access Token stored in environment variables
- Fallback to cached questions when offline

## Development
- Framework: React 18 with Vite
- Styling: Tailwind CSS
- State Management: Zustand with persist middleware
- Animations: Framer Motion
- Charts: Recharts
- Icons: Lucide React

## Deployment
- Target: Autoscale
- Build: `cd cbt-app && npm run build`
- Run: `cd cbt-app && npx serve -s dist -l 5000`

## User Preferences
- Dark theme by default
- Multiple font size options
- Calculator toggle for math subjects
- Sound and vibration feedback options
