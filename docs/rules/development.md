# Development Guide

This document provides detailed development instructions for the EchoLang project. Dependency management rules are described in [Dependency Management](./dependency-management.md), for testing guidelines, see [Testing](./testing.md), and security considerations, are described in [Security](./security.md).

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
