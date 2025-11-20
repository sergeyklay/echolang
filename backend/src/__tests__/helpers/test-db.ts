import { PrismaClient, Tone, ApiKey } from '@prisma/client';

/**
 * Clears all test database tables by deleting all records in the correct order
 * within a transaction. This ensures atomicity and handles foreign key
 * constraints properly.
 *
 * The deletion order is determined by foreign key relationships:
 * - Translation (has FK to Tone) must be deleted before Tone
 * - Tone can be deleted after Translation
 * - ApiKey (no FKs) can be deleted in any order
 *
 * @param prisma - Prisma client instance used to perform database operations
 * @returns Promise that resolves when all tables are cleared
 * @throws Error if the transaction fails
 * @sideEffect Deletes all translation, tone, and apiKey records from the
 * database
 */
export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete in order: child models first (with FKs), then parent models
      // Translation has FK to Tone, so delete Translation before Tone
      await tx.translation.deleteMany();
      await tx.tone.deleteMany();
      await tx.apiKey.deleteMany();
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to clean database', { cause: error });
    }
    throw new Error(`Failed to clean database: ${String(error)}`);
  }
}

/**
 * Creates test records in the database for use in tests.
 *
 * @param prisma - Prisma client instance used to perform database
 *   operations
 * @returns Promise resolving to an object containing:
 *   - tone: Tone record with name 'Test Tone', description 'Test
 *     description', and systemPrompt 'Test system prompt'
 *   - apiKey: ApiKey record with provider 'openai',
 *     encryptedKey 'test-encrypted-key', and isActive true
 */
export async function seedTestData(
  prisma: PrismaClient
): Promise<{ tone: Tone; apiKey: ApiKey }> {
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



