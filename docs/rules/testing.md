# Testing

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
