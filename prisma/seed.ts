import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const breeds = [
  { name: 'Labrador Retriever', slug: 'labrador-retriever' },
  { name: 'Golden Retriever', slug: 'golden-retriever' },
  { name: 'Bulldog Frances', slug: 'bulldog-frances' },
  { name: 'Poodle', slug: 'poodle' },
  { name: 'Shih Tzu', slug: 'shih-tzu' },
  { name: 'Yorkshire Terrier', slug: 'yorkshire-terrier' },
  { name: 'Border Collie', slug: 'border-collie' },
  { name: 'Vira-lata', slug: 'vira-lata' },
];

async function main(): Promise<void> {
  for (const breed of breeds) {
    await prisma.breed.upsert({
      where: { slug: breed.slug },
      update: { name: breed.name },
      create: breed,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
