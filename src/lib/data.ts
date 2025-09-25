import { prisma } from './prisma'
import { Audience, User } from '@prisma/client'

export interface AudienceWithOwner extends Audience {
  owner: User
}

export async function getAudiencesForSale(): Promise<AudienceWithOwner[]> {
  return await prisma.audience.findMany({
    where: {
      isForSale: true
    },
    include: {
      owner: true
    },
    orderBy: {
      name: 'asc'
    }
  })
}