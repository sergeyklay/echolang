import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultTones = [
    {
      name: 'Default',
      description: 'Standard translation with neutral tone',
      systemPrompt: 'You are a professional translator. Translate the text accurately while preserving the original meaning and tone. Maintain natural language flow and cultural appropriateness.',
    },
    {
      name: 'Professional',
      description: 'Formal and professional tone suitable for business and official documents',
      systemPrompt: 'You are a professional translator specializing in formal and business communications. Translate the text in a formal, professional manner. Use appropriate business terminology and maintain a respectful, polished tone. Ensure accuracy and clarity suitable for official documents and professional correspondence.',
    },
  ];

  for (const tone of defaultTones) {
    const existing = await prisma.tone.findUnique({
      where: { name: tone.name },
    });

    if (existing) {
      console.log(`Tone "${tone.name}" already exists, skipping...`);
    } else {
      const created = await prisma.tone.create({
        data: tone,
      });
      console.log(`Created tone: ${created.name}`);
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

