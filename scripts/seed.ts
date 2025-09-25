import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      balance: 150,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      balance: 80,
    },
  });

  console.log(`Created users: `, user1, user2);

  // Create Audiences
  const audience1 = await prisma.audience.create({
    data: {
      name: 'Early Adopters - Tech',
      description: 'Users who are the first to try new technology products.',
      price: 50,
      ownerId: user1.id,
      isForSale: true,
    },
  });

  const audience2 = await prisma.audience.create({
    data: {
      name: 'Fitness Enthusiasts - Urban',
      description: 'City dwellers who frequently visit gyms and health food stores.',
      price: 75,
      ownerId: user1.id,
      isForSale: true,
    },
  });

  const audience3 = await prisma.audience.create({
    data: {
      name: 'Luxury Travelers - International',
      description: 'High-income individuals who travel abroad for leisure at least twice a year.',
      price: 200,
      ownerId: user2.id,
      isForSale: false, // Not for sale
    },
  });

  console.log(`Created audiences: `, audience1, audience2, audience3);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
