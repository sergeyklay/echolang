# AGENTS.md

This file provides guidance for AI coding agents working on the EchoLang project. The main developer documentation lives in the `docs` directory. For detailed architecture and API documentation, see [ARCHITECTURE.md](ARCHITECTURE.md). For development setup and workflows, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Project Overview

EchoLang is a minimal web-based LLM Translator for single-user local deployment. It enables translation using various LLM providers (OpenAI, Anthropic, Gemini, or local LLMs) with customizable tones and styles.

**Key Technologies:**
- Backend: Node.js v24, TypeScript, Express.js, SQLite with Prisma ORM
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Package Manager: **npm only** (no yarn, pnpm, or bun)

## Setup Commands

For initial setup, follow the instructions in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Code Style

For detailed coding standards including TypeScript, React, and dependency management rules, see [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md).

**Quick reference:**
- TypeScript strict mode, Airbnb style guide, 100 character line limit
- React functional components with hooks
- **ONLY use npm** - alternative package managers are forbidden

## Testing

Run tests before committing:

```bash
# Backend (when tests are added)
cd backend && npm test

# Frontend (when tests are added)
cd frontend && npm test
```

## Programmatic Checks

Before submitting changes, ensure all checks pass:

```bash
# Lint frontend
cd frontend && npm run lint

# Type check (implicit via build)
cd backend && npm run build
cd frontend && npm run build
```

## Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed project structure and API specifications.

Key directories:
- `backend/src/` - Backend source code
- `frontend/src/` - Frontend source code
- `backend/prisma/` - Database schema and migrations
- `docs/` - Project documentation

## Security Considerations

- API keys are encrypted at rest using AES-256-GCM
- Never commit `.env` files or encryption keys
- Master encryption key stored in `ENCRYPTION_KEY` environment variable
- All API endpoints validate input using Zod schemas
- See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed security design

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Ensure all tests pass
- Run linting and type checks before submitting
- Include clear description of changes
- Reference related issues if applicable

## Documentation References

- **Architecture & API**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Development Workflow**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Coding Standards**: [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)
- **Project History**: [docs/HISTORY.md](docs/HISTORY.md)
- **Getting Started**: [README.md](README.md)

