# Troubleshooting

## Database Issues

- If migrations fail, check `backend/prisma/migrations/` for conflicts
- Reset database (development only): Delete `backend/dev.db` and run migrations again

## Port Conflicts

- Backend port: Change `PORT` in `backend/.env`
- Frontend port: Vite will automatically use next available port

## Type Errors

- Ensure Prisma client is generated: `npm run prisma:generate`
- Clear TypeScript cache and rebuild
