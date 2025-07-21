# DigiFarmacy - AI-Enhanced Health Companion

## Overview

DigiFarmacy is a comprehensive full-stack web application designed for the Sri Lankan healthcare ecosystem. It serves as an AI-enhanced health companion that connects patients with verified pharmacies and laboratories through intelligent technology. The platform offers prescription analysis, drug information, pharmacy mapping, voice assistance, and commission-based business transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA (Single Page Application) mode
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed design system
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router for client-side navigation
- **Mobile-First**: Responsive design with dedicated mobile navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with structured route organization
- **Development**: Hot reload with tsx for TypeScript execution

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Connection**: Neon serverless with WebSocket support

### Authentication and Authorization
- **Provider**: Supabase Auth for user management
- **Role-Based Access**: Multi-role system (customer, pharmacy, laboratory, admin, developer_admin)
- **Profile Management**: Extended user profiles with business details for service providers
- **Status Tracking**: User verification workflow with pending/verified/suspended states

## Key Components

### Core Features
1. **Pharmacy Map Integration**: Interactive map with Mapbox for locating verified pharmacies
2. **Prescription Upload & Analysis**: AI-powered prescription scanning and medication extraction
3. **Voice Assistant**: Multi-language voice interaction with speech recognition
4. **Drug Information System**: Comprehensive medication database with safety information
5. **Laboratory Booking**: Home visit and walk-in appointment scheduling
6. **Commission System**: Transaction tracking for pharmacy and laboratory partnerships

### Business Logic Components
- **Commission Tracking**: Automated percentage-based earnings for platform and service providers
- **QR Payment System**: Payment request generation and proof of payment handling
- **Verification Workflow**: Document upload and admin approval process for pharmacies/labs
- **Multi-language Support**: English, Sinhala, and Tamil language options

### Security Features
- **PDPA Compliance**: Sri Lankan Personal Data Protection Act adherence
- **Secure File Upload**: Document verification with cloud storage
- **API Key Management**: Centralized configuration for external services
- **Admin Controls**: Restricted admin access with secret key authentication

## Data Flow

### User Journey Flow
1. **Discovery**: Users search for pharmacies/laboratories via map or location search
2. **Prescription Upload**: Users upload prescriptions to selected pharmacies
3. **AI Processing**: Prescription analysis extracts medication information
4. **Commission Generation**: Successful transactions generate commission records
5. **Payment Processing**: QR-based payment system for service provider settlements

### Data Pipeline
- **Frontend** → API calls → **Express Server** → **Drizzle ORM** → **PostgreSQL Database**
- **File Uploads** → **Supabase Storage** → **URL References** → **Database Records**
- **External APIs** → **Server Middleware** → **Client Applications**

## External Dependencies

### Required API Services
- **Mapbox**: Location services, geocoding, and interactive maps
- **Supabase**: Authentication, file storage, and real-time features
- **Google Gemini**: AI-powered prescription analysis and drug information
- **Neon Database**: Serverless PostgreSQL hosting

### Optional Enhancement Services
- **ElevenLabs**: Premium voice synthesis for multi-language text-to-speech
- **OpenAI**: Advanced AI chatbot and voice assistance capabilities

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **Replit Cartographer**: Development environment integration
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle Kit manages schema migrations

### Environment Configuration
- **Development**: `NODE_ENV=development` with tsx for TypeScript execution
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- Static file serving capability for React build
- Environment variable support for API keys and database credentials

### Performance Considerations
- **Code Splitting**: Vite automatically handles chunk optimization
- **Database Pooling**: Neon serverless connection pooling
- **API Caching**: React Query provides client-side caching
- **Image Optimization**: Supabase storage with CDN delivery

The application is designed for scalability with a clear separation of concerns, comprehensive error handling, and mobile-first responsive design to serve Sri Lanka's diverse healthcare ecosystem.

## Recent Changes

### January 21, 2025
- ✅ **Multi-Language Support**: Created LanguageSelector component with English, Sinhala, and Tamil dropdown in PageLayout header
- ✅ **Comprehensive Workflow Diagram**: Created WorkflowDiagram component showing complete user journey from pharmacy discovery to medicine delivery
- ✅ **Complete FarmaFinder → DigiFarmacy Rebranding**: Fixed all remaining instances across Privacy, TermsOfService, HowToUse, Footer, and storage files
- ✅ **Workflow Page Creation**: Added dedicated /workflow route displaying complete application workflow with interactive diagram
- ✅ **Dropdown Menu Component**: Implemented shadcn/ui dropdown-menu component for language selector functionality
- ✅ **Enhanced Header Navigation**: Added language selector to PageLayout header with proper responsive design

### January 20, 2025
- ✅ **Database Migration**: Successfully migrated from problematic Neon WebSocket connections to reliable in-memory storage
- ✅ **Footer Routing Fixed**: Created all missing pages (PrescriptionScanner, VoiceAssistant, DrugInfo, Privacy) and fixed 404 errors
- ✅ **Sample Data Enhancement**: Added authentic Sri Lankan pharmacies and laboratories with real addresses
- ✅ **Authentication System**: Implemented localStorage-based auth system for demo purposes
- ✅ **API Optimization**: All endpoints now respond quickly with comprehensive sample data
- ✅ **UI Consistency**: Maintained white/#7aebcf gradient theme across all new pages
- ✅ **PageLayout Integration**: All Quick Links pages now have consistent footer and back button navigation
- ✅ **Sri Lankan Medicine Database**: Implemented comprehensive dropdown search with local medicine data
- ✅ **Enhanced Prescription Upload**: Added "No Pharmacy Found" message for better UX
- ✅ **Laboratory Booking Enhancement**: Added Mapbox integration with interactive laboratory locations
- ✅ **Button Styling Updates**: Replaced glassmorphism effects with solid #00bfff/green gradient colors for improved visibility
- ✅ **Branding Update**: Changed from "FarmaFinder" to "DigiFarmacy" throughout the application
- ✅ **NMRA Drug Database**: Implemented comprehensive drug database with detailed NMRA-licensed medicines
- ✅ **Advanced Drug Search**: Added dropdown suggestions for 3+ character searches with comprehensive drug information
- ✅ **GPS Location Integration**: Implemented GPS location finder with Mapbox integration for city/town search
- ✅ **DrugBank API Removal**: Removed external DrugBank API dependency, now using local NMRA database
- ✅ **Enhanced Drug Details**: Added contraindications, interactions, dosage, storage, and pharmacology information
- ✅ **Smart Search Features**: Implemented intelligent search with autocomplete for both drug and location searches
- ✅ **NMRA Comprehensive Database**: Integrated authentic NMRA registered drugs from official file with 6000+ medicines
- ✅ **Enhanced Drug Search Description**: Updated to specify "medications approved by National Medicines Regulatory Authority (NMRA)"
- ✅ **Real NMRA Data Integration**: Parsed and integrated official Sri Lankan drug registration data including Strepsils, Zerodol, and other registered medicines

### January 18, 2025
- ✅ **Migration Completed**: Successfully migrated from Supabase to Neon PostgreSQL
- ✅ **Syntax Fixes**: Resolved critical syntax errors in Index.tsx and LabBooking.tsx files
- ✅ **API Integration**: Created missing queryClient.ts file for proper API request handling
- ✅ **UI Enhancement**: Applied white/#7aebcf gradient theme throughout the application
- ✅ **Feature Updates**: Enhanced Sri Lankan medicine database with dropdown search functionality
- ✅ **Laboratory Services**: Added Laboratory Home Visits pricing cards (LKR 2,500-7,500)
- ✅ **Voice Assistant**: Improved Voice Assistant with comprehensive medical responses
- ✅ **Database Integration**: All components now use server-side API calls instead of direct Supabase client calls