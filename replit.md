# ALOC Questions API & JAMB CBT Practice App

## Overview

This repository contains two main applications:

1. **ALOC Questions API (Backend)** - A Laravel 8 PHP application that provides API access to over 6,000 Nigerian past examination questions (UTME, WASSCE, POST-UTME). This serves as an open-source database for educational content.

2. **JAMB CBT Practice App (Frontend)** - A modern React 19 single-page application built with Vite that provides a computer-based testing (CBT) practice interface for JAMB UTME preparation. Located in the `cbt-app/` directory.

The platform aims to gamify academic practice, making exam preparation engaging for students seeking university admission in Nigeria.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture (Laravel)

**Framework**: Laravel 8.x with PHP 7.3+/8.0

**Key Components**:
- Standard Laravel MVC architecture with models, controllers, and views
- Eloquent ORM for database interactions
- Custom helper functions loaded via `app/functions.php`
- API-first design exposing endpoints at `questions.aloc.com.ng/api/v2`

**Third-Party Packages**:
- `guzzlehttp/guzzle` - HTTP client for external API calls
- `laracasts/flash` - Flash messaging for user notifications
- `stevebauman/location` - IP geolocation services
- `fruitcake/laravel-cors` - Cross-origin resource sharing

**Asset Compilation**: Laravel Mix with Webpack for JS/CSS bundling

### Frontend Architecture (React CBT App)

**Location**: `cbt-app/` directory

**Framework**: React 19 with Vite 7 as build tool

**State Management**: Zustand with persistence middleware for local storage

**Styling**: Tailwind CSS 4 with custom theme configuration including:
- Custom color palettes (primary blue, secondary green)
- Dark mode support via CSS class toggle
- Custom animations (fade-in, slide-up, slide-down)
- Plus Jakarta Sans as primary font

**UI Libraries**:
- Headless UI - Accessible UI components
- Framer Motion - Animations and transitions
- Lucide React - Icon library
- Recharts - Data visualization/charts

**Key Services**:
- `api.js` - Axios-based API client with IndexedDB caching for offline support
- `aiService.js` - AI integration with Poe API for question explanations (with caching)
- `voiceService.js` - Text-to-speech functionality for accessibility

**PWA Features**:
- Service worker (`public/sw.js`) for offline caching
- Web manifest for installable app experience
- Static asset and API response caching strategies

### Data Flow

1. Frontend makes requests to ALOC API (`questions.aloc.com.ng/api/v2`)
2. API responses are cached in IndexedDB for offline access
3. User progress and preferences stored locally via Zustand persist
4. AI explanations fetched from Poe API and cached for 24 hours

### Store Structure (Zustand)

The main store (`useStore.js`) manages:
- Theme and display preferences
- Subject configurations (15 JAMB subjects with metadata)
- User profile and progress tracking
- Practice session state
- Achievement system

## External Dependencies

### Backend (Laravel)

**Database**: MySQL/MariaDB (configured via `.env` file with `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)

**External Services**:
- No external API dependencies; this IS the API provider

### Frontend (React)

**APIs**:
- ALOC Questions API (`https://questions.aloc.com.ng/api/v2`) - Primary data source with access token authentication
- Dictionary API (`api.dictionaryapi.dev`) - Word definitions
- Poe API (`api.poe.com/v1`) - AI-powered question explanations using Grok-4 model

**Environment Variables**:
- `VITE_ALOC_API_URL` - API base URL (default: `https://questions.aloc.com.ng/api/v2`)
- `VITE_ALOC_ACCESS_TOKEN` - API access token (default provided)
- `VITE_POE_API_KEY` - Poe API key for AI features (configured)

**Browser APIs**:
- IndexedDB - Offline question caching
- Web Speech API - Text-to-speech for questions
- Service Worker API - PWA functionality

### Development Tools

**Backend**:
- PHPUnit for testing
- Laravel Sail for Docker development
- Faker for database seeding

**Frontend**:
- ESLint with React hooks plugin
- PostCSS with Autoprefixer
- Vite dev server on port 5000