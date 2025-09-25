import { prisma } from "./prisma";

export async function getAudiencesForSale() {
  const audiences = await prisma.audience.findMany({
    where: {
      isForSale: true,
    },
    include: {
      owner: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  return audiences;
}
