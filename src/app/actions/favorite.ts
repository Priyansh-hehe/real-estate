"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(propertyId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, isFavorited: false, requiresAuth: true };
  }

  const userId = session.user.id;

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });

    revalidatePath("/saved");
    revalidatePath(`/properties/${propertyId}`);
    return { success: true, isFavorited: false, requiresAuth: false };
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });

    revalidatePath("/saved");
    revalidatePath(`/properties/${propertyId}`);
    return { success: true, isFavorited: true, requiresAuth: false };
  }
}

export async function getUserFavoriteIdsAction(): Promise<string[]> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return [];
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { propertyId: true },
  });

  return favorites.map((f) => f.propertyId);
}
