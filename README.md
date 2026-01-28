# Pastey

A minimal, correctness-critical pastebin application built with Next.js and PostgreSQL.

## Project Description

Pastey allows users to create text pastes and share them via unique URLs. Pastes can optionally include time-based expiry (TTL) and view count limits. Once a constraint is triggered, the paste becomes unavailable.

## How to Run Locally

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended for serverless deployment)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Pastey
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host/database
NEXT_PUBLIC_APP_URL=http://localhost:3000
TEST_MODE=1
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Persistence Layer

This application uses **PostgreSQL (Neon)** as the persistence layer. The database schema is automatically created on application startup using `CREATE TABLE IF NOT EXISTS` statements, ensuring no manual migrations are required.

### Database Schema

The application uses a single table `pastes` with the following structure:

- `id` (TEXT, PRIMARY KEY): Unique identifier for each paste
- `content` (TEXT, NOT NULL): The paste content
- `created_at` (TIMESTAMP): When the paste was created
- `expires_at` (TIMESTAMP, nullable): Optional expiry timestamp
- `max_views` (INTEGER, nullable): Optional maximum view count
- `current_views` (INTEGER, default 0): Current number of views

The schema includes:
- CHECK constraints to prevent negative view counts
- An index on `expires_at` for efficient expiry queries
- Atomic UPDATE operations for view counting to handle concurrent requests safely

## API Endpoints

- `GET /api/healthz` - Health check endpoint
- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch paste data (API, increments view count)
- `GET /p/:id` - View paste in browser (HTML, increments view count)

