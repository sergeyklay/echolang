import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanDatabase } from './helpers/test-db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'file:./test.db';

// Suppress Prisma messages
process.env.PRISMA_HIDE_UPDATE_MESSAGE = '1';
process.env.PRISMA_HIDE_TIPS = '1';
process.env.PRISMA_SKIP_POSTINSTALL_GENERATE = '1';

let prisma: PrismaClient;
let dbInitialized = false;

beforeAll(async () => {
  // Set test database URL for this process
  process.env.DATABASE_URL = testDatabaseUrl;

  // Suppress dotenv messages
  const originalConsoleLog = console.log;
  console.log = (...args: unknown[]) => {
    const message = String(args[0] || '');
    if (
      !message.includes('Environment variables loaded') &&
      !message.includes('Prisma schema loaded') &&
      !message.includes('Datasource') &&
      !message.includes('migrations found') &&
      !message.includes('pending migrations')
    ) {
      originalConsoleLog(...args);
    }
  };

  // Only initialize database once
  if (!dbInitialized) {
    // Generate Prisma client (suppress output)
    execSync('npx prisma generate', {
      cwd: path.resolve(__dirname, '../..'),
      stdio: 'pipe',
      env: {
        ...process.env,
        PRISMA_HIDE_UPDATE_MESSAGE: '1',
        PRISMA_HIDE_TIPS: '1',
      },
    });

    // Create and migrate test database (suppress output)
    try {
      execSync(`npx prisma migrate deploy`, {
        cwd: path.resolve(__dirname, '../..'),
        env: {
          ...process.env,
          DATABASE_URL: testDatabaseUrl,
          PRISMA_HIDE_UPDATE_MESSAGE: '1',
          PRISMA_HIDE_TIPS: '1',
        },
        stdio: 'pipe',
      });
    } catch (error) {
      // If migrate deploy fails, try migrate dev to create the database
      execSync(`npx prisma migrate dev --name init --skip-seed`, {
        cwd: path.resolve(__dirname, '../..'),
        env: {
          ...process.env,
          DATABASE_URL: testDatabaseUrl,
          PRISMA_HIDE_UPDATE_MESSAGE: '1',
          PRISMA_HIDE_TIPS: '1',
        },
        stdio: 'pipe',
      });
    }
    dbInitialized = true;
  }

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
    log: [], // Disable Prisma query logging in tests
  });

  await prisma.$connect();
});

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };

