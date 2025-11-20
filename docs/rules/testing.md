# Testing

## Running Tests

Run tests before committing:

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# Run tests once (CI mode)
cd backend && npm run test:run
cd frontend && npm run test:run

# Open test UI
cd backend && npm run test:ui
cd frontend && npm run test:ui
```

## Test Structure

**Pattern**: All test files (`.test.ts`, `.test.tsx`) are co-located next to their source files. The `__tests__/` directory is only for shared test infrastructure (setup files, mocks, helpers), not for test files themselves.

### Backend Tests

- **Test Files** (co-located with source):
  - `src/services/encryption.service.test.ts` - Tests for `encryption.service.ts`
  - `src/controllers/translation.controller.test.ts` - Tests for `translation.controller.ts`
  - `src/routes/translation.routes.test.ts` - Tests for `translation.routes.ts`
- **Test Infrastructure** (in `__tests__/`):
  - `src/__tests__/setup.ts` - Global test setup (database, environment)
  - `src/__tests__/helpers/` - Test utilities and fixtures

### Frontend Tests

- **Test Files** (co-located with source):
  - `src/services/api.test.ts` - Tests for `api.ts`
  - `src/hooks/useLocalStorage.test.ts` - Tests for `useLocalStorage.ts`
- **Test Infrastructure** (in `__tests__/`):
  - `src/__tests__/setup.ts` - Global test setup (MSW, test environment)
  - `src/__tests__/mocks/` - MSW handlers for API mocking
  - `src/__tests__/helpers/test-utils.tsx` - React Testing Library utilities

## Testing Stack

- **Vitest**: Fast, Vite-native test runner for both backend and frontend
- **Supertest**: HTTP assertion library for backend API integration tests
- **React Testing Library**: Component and hook testing utilities
- **MSW**: Mock Service Worker for API mocking in frontend tests

## Programmatic Checks

Before submitting changes, ensure all checks pass:

```bash
# Lint frontend
cd frontend && npm run lint

# Type check (implicit via build)
cd backend && npm run build
cd frontend && npm run build
```
