import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  await prisma.transaction.deleteMany()
  await prisma.audience.deleteMany()
  await prisma.user.deleteMany()

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      balance: 100
    }
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      balance: 100
    }
  })

  const audienceData = [
    {
      name: 'Tech Enthusiasts',
      description: 'A vibrant community of early adopters passionate about cutting-edge technology, gadgets, and software innovations.',
      price: 50,
      ownerId: alice.id,
      isForSale: true
    },
    {
      name: 'Fitness Fanatics',
      description: 'Health-conscious individuals dedicated to workouts, nutrition, and achieving peak physical performance.',
      price: 35,
      ownerId: alice.id,
      isForSale: true
    },
    {
      name: 'Bookworms Club',
      description: 'Avid readers who devour literature across all genres and love discussing plot twists and character development.',
      price: 25,
      ownerId: bob.id,
      isForSale: false
    }
  ]

  for (const data of audienceData) {
    await prisma.audience.create({ data })
  }

  console.log('Seed completed successfully!')
  console.log(`Created 2 users: ${alice.name} and ${bob.name}`)
  console.log('Created 3 audiences (2 for sale, 1 not for sale)')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })