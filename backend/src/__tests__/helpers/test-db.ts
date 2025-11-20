import { PrismaClient } from '@prisma/client';

/**
 * Clears all test database tables by deleting all records.
 *
 * @param prisma - Prisma client instance used to perform database operations
 * @returns Promise that resolves when all tables are cleared
 * @sideEffect Deletes all translation, tone, and apiKey records from the database
 */
export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.translation.deleteMany();
  await prisma.tone.deleteMany();
  await prisma.apiKey.deleteMany();
}

/**
 * Creates test records in the database for use in tests.
 *
 * @param {PrismaClient} prisma - Prisma client instance used to perform database operations
 * @returns Promise resolving to an object containing:
 *   - tone: Tone record with name 'Test Tone', description 'Test description', and systemPrompt 'Test system prompt'
 *   - apiKey: ApiKey record with provider 'openai', encryptedKey 'test-encrypted-key', and isActive true
 */
export async function seedTestData(prisma: PrismaClient) {
  const tone = await prisma.tone.create({
    data: {
      name: 'Test Tone',
      description: 'Test description',
      systemPrompt: 'Test system prompt',
    },
  });

  const apiKey = await prisma.apiKey.create({
    data: {
      provider: 'openai',
      encryptedKey: 'test-encrypted-key',
      isActive: true,
    },
  });

  return { tone, apiKey };
}



