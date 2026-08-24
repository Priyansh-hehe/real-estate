"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProperty(formData: FormData) {
  // 1. Verify the user is actually logged in
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized: You must be logged in to add a property.");
  }

  // 2. Extract the data from the form
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const propertyType = formData.get("propertyType") as string;
  const size = parseFloat(formData.get("size") as string);
  const address = formData.get("address") as string;
  
  // Maps coordinates
  const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
  const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;
  
  // Image URL (we will just take one for now)
  const imageUrl = formData.get("image") as string;
  const images = imageUrl ? [imageUrl] : [];

  // 3. Save to PostgreSQL database
  await prisma.property.create({
    data: {
      title,
      description,
      price,
      propertyType,
      size,
      address,
      latitude,
      longitude,
      images,
      userId: session.user.id,
    }
  });

  // 4. Tell Next.js to refresh the dashboard so the new property shows up instantly
  revalidatePath("/dashboard");
}

export async function deleteProperty(propertyId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  // Ensure they only delete their own properties
  await prisma.property.delete({
    where: {
      id: propertyId,
      userId: session.user.id
    }
  });

  revalidatePath("/dashboard");
}
