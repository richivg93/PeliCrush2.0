# PeliCrush - Movie Recommendation App

## Overview

PeliCrush is a full-stack movie recommendation application that uses AI (Cohere API) to provide personalized movie and TV show suggestions based on user queries. The app features a modern, dark-themed interface with a movie carousel and intelligent recommendation system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage
- **API Integration**: Cohere AI for movie recommendations

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **Schema Management**: Drizzle Kit for migrations
- **Fallback Storage**: In-memory storage for development
- **Session Store**: PostgreSQL-based session management

## Key Components

### Database Schema
- **Users Table**: User authentication with username/password
- **Recommendations Table**: Stores user queries and AI responses with timestamps
- **Schema Location**: `shared/schema.ts` with Zod validation

### AI Integration
- **Provider**: Cohere API for natural language processing
- **Model**: Command model for text generation
- **Functionality**: Converts user queries into structured movie recommendations
- **Response Format**: Structured list with title, year, genre, and descriptions

### UI Components
- **Logo Component**: Custom PeliCrush branding with search icon
- **Movie Carousel**: Auto-rotating showcase of featured movies
- **Search Section**: Text area for user input with AI processing
- **Recommendations Section**: Structured display of AI-generated suggestions
- **Toast System**: User feedback for actions and errors

### Authentication System
- **Method**: Session-based authentication
- **Storage**: PostgreSQL sessions via connect-pg-simple
- **Validation**: Zod schemas for input validation
- **Security**: Password hashing and secure session management

## Data Flow

1. **User Input**: User enters movie preferences in search form
2. **API Request**: Frontend sends query to `/api/recommendations` endpoint
3. **AI Processing**: Backend calls Cohere API with formatted prompt
4. **Data Storage**: Recommendation saved to PostgreSQL database
5. **Response Parsing**: Frontend parses structured AI response
6. **UI Update**: Recommendations displayed in organized card layout

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **zod**: Runtime type validation
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/**: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

### Development Tools
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Development server and build tool

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from built frontend directory

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **COHERE_API_KEY**: AI service authentication
- **NODE_ENV**: Environment configuration (development/production)

### Production Setup
- **Server**: Node.js Express server serving both API and static files
- **Database**: Neon PostgreSQL with connection pooling
- **Sessions**: PostgreSQL-based session storage for scalability

## Changelog
- June 27, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.