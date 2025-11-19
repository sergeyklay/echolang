# Development Guide

This document provides detailed development instructions for the EchoLang project. For agent-specific guidance, see [AGENTS.md](../AGENTS.md).

## Environment Setup

### Prerequisites

- Node.js v24 or higher
- npm
- SQLite (included with Node.js)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment template:
```bash
cp .env.example .env
```

4. Generate encryption key:
```bash
openssl rand -base64 32
```

5. Update `.env` with your encryption key:
```env
ENCRYPTION_KEY="your-generated-key-here"
DATABASE_URL="file:./dev.db"
PORT=3000
```

6. Generate Prisma client:
```bash
npm run prisma:generate
```

7. Run database migrations:
```bash
npm run prisma:migrate
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment template:
```bash
cp .env.example .env
```

4. Update `.env` with backend URL (if different from default):
```env
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` (or next available port)

### Database Management

**Prisma Studio (Database GUI):**
```bash
cd backend
npm run prisma:studio
```

**Create new migration:**
```bash
cd backend
npm run prisma:migrate
```

**Seed database:**
```bash
cd backend
npm run prisma:seed
```

## Code Quality

### Linting

Frontend uses ESLint:
```bash
cd frontend
npm run lint
```

### Type Checking

Type checking happens automatically during build:
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## Project Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for:
- Detailed project structure
- API endpoint specifications
- Database schema
- Security design

## Common Tasks

### Adding a New LLM Provider

1. Create service file in `backend/src/services/llm/`
2. Implement the LLM service interface
3. Register in `llm.service.ts`
4. Update API key settings to support the new provider

### Adding a New API Endpoint

1. Create controller in `backend/src/controllers/`
2. Create route in `backend/src/routes/`
3. Add validation schema using Zod
4. Register route in `backend/src/app.ts`
5. Update frontend API service if needed

### Database Changes

1. Update `backend/prisma/schema.prisma`
2. Create migration: `npm run prisma:migrate`
3. Regenerate Prisma client: `npm run prisma:generate`

## Troubleshooting

### Database Issues

- If migrations fail, check `backend/prisma/migrations/` for conflicts
- Reset database (development only): Delete `backend/dev.db` and run migrations again

### Port Conflicts

- Backend port: Change `PORT` in `backend/.env`
- Frontend port: Vite will automatically use next available port

### Type Errors

- Ensure Prisma client is generated: `npm run prisma:generate`
- Clear TypeScript cache and rebuild

