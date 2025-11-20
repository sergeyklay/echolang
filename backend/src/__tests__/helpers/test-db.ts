import { PrismaClient } from '@prisma/client';

export async function cleanDatabase(prisma: PrismaClient) {
  await prisma.translation.deleteMany();
  await prisma.tone.deleteMany();
  await prisma.apiKey.deleteMany();
}

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



