# JAMB CBT Practice Platform

A modern, fully-functional Computer-Based Testing (CBT) application for JAMB UTME preparation, built with React and powered by the ALOC API.

## Overview

This application provides a TestDriller-style CBT experience with smooth animations, modern UI, and comprehensive exam simulation features. It focuses exclusively on JAMB (Joint Admissions and Matriculation Board) exam preparation.

## Features

### Dashboard
- JAMB-only subjects display with 15+ subjects available
- Quick stats (practice sessions, exams taken, average score)
- Start Practice and Full Exam Mode action cards
- Recent activity tracking

### Practice Mode
- Select any single JAMB subject
- Choose specific year or random questions
- Configurable question count (10-50 questions)
- Optional timer with customizable duration
- Unlimited attempts

### Full Exam Mode (JAMB Style)
- **Mandatory Rules:**
  - 4 subjects total (English is compulsory)
  - English: 60 questions
  - Other 3 subjects: 40 questions each
  - Total: 180 questions
  - 2-hour duration (120 minutes)
- Subject tabs for easy navigation
- Question grid with color-coded status
- Mark for review functionality
- Auto-submit when time ends

### Exam Interface
- Timer display at the top
- Large, readable fonts
- Next/Previous navigation
- Question navigator grid
- Keyboard-friendly design
- Supports images and diagrams

### Results System
- Overall score with visual indicator
- Correct/Wrong/Unanswered breakdown
- Subject-wise performance analysis
- Time taken analysis
- Score distribution charts

### Review Mode
- Filter by all/correct/wrong/unanswered
- Shows user answer vs correct answer
- Explanations when available
- Navigation between questions

### Analytics
- Score progress over time
- Subject performance comparison
- Session distribution (practice vs full exam)
- Historical data visualization

### Settings
- Light/Dark theme toggle
- Font size options (small/medium/large)
- Timer on/off toggle
- Sound and vibration settings
- Data management (clear all data)

### Ilom AI Assistant
- Powered by xAI/Grok API
- Explains difficult concepts and JAMB questions
- Provides study tips for each subject
- Available from dashboard and review mode only
- **Disabled during practice/exam mode to prevent cheating**
- Responses cached for offline access

### Voice Reader
- Text-to-speech for questions and options
- Helps with pronunciation and comprehension
- Uses Web Speech API

## Technical Stack

- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand with persistence
- **Routing:** React Router v6
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API:** ALOC Questions API

## Project Structure

```
cbt-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Layout.jsx   # Main layout wrapper
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── PracticeSetup.jsx
│   │   ├── ExamSetup.jsx
│   │   ├── Exam.jsx
│   │   ├── Results.jsx
│   │   ├── Review.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── services/        # API services
│   │   └── api.js       # ALOC API wrapper
│   ├── store/           # State management
│   │   └── useStore.js  # Zustand store
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## Environment Variables

```
VITE_ALOC_API_URL=https://questions.aloc.com.ng/api/v2
VITE_ALOC_ACCESS_TOKEN=your_access_token_here
```

## Running Locally

1. Navigate to the cbt-app directory:
   ```bash
   cd cbt-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5000 in your browser

## Building for Production

```bash
cd cbt-app
npm run build
```

The build output will be in `cbt-app/dist/` directory.

## Deployment

### Replit
The app is configured for static deployment on Replit. Click the "Publish" button to deploy.

### Other Platforms

**Vercel:**
```bash
cd cbt-app
npm run build
# Deploy dist/ folder
```

**Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`

**Docker:**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY cbt-app/package*.json ./
RUN npm ci
COPY cbt-app/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Mobile App Conversion

This React app can be converted to a mobile app using:

1. **Capacitor** - Recommended for native iOS/Android
2. **React Native** - Reuse components with React Native Web
3. **PWA** - Add service worker for offline support

## API Reference

The app uses the ALOC Questions API:
- Documentation: https://questions.aloc.com.ng
- API Base: https://questions.aloc.com.ng/api/v2

Key endpoints:
- `GET /q?subject={subject}` - Get single question
- `GET /q/{count}?subject={subject}` - Get multiple questions
- `GET /m?subject={subject}` - Get bulk questions (40)

## User Preferences

Settings are persisted locally using localStorage:
- Theme preference (light/dark)
- Font size setting
- Timer enabled/disabled
- Sound and vibration preferences
- Practice and exam history

## Recent Changes

- Added Ilom AI Assistant (powered by xAI/Grok) - disabled during exams to prevent cheating
- Added Voice Reader for text-to-speech
- Initial release with complete CBT functionality
- JAMB-only dashboard (no WAEC/NECO)
- Full exam mode with 60/40/40/40 question distribution
- Modern TestDriller-style UI
- Dark/Light theme support
- Responsive design for all devices
