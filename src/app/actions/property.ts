"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProperty(formData: FormData) {
  // 1. Verify the user is an Admin or Agent
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "AGENT")) {
    throw new Error("Unauthorized: Only Admins and Agents can add properties.");
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
  
  // Image URLs (can be multiple)
  const images = formData.getAll("images") as string[];

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

  // 4. Tell Next.js to refresh the dashboard and homepage so the new property shows up instantly
  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function updateProperty(propertyId: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "AGENT")) {
    throw new Error("Unauthorized: Only Admins and Agents can edit properties.");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const propertyType = formData.get("propertyType") as string;
  const size = parseFloat(formData.get("size") as string);
  const address = formData.get("address") as string;
  
  const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
  const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;
  
  const images = formData.getAll("images") as string[];

  // Admins can update any property; Agents can only update their own
  const whereClause = session.user.role === "ADMIN" 
    ? { id: propertyId } 
    : { id: propertyId, userId: session.user.id };

  await prisma.property.update({
    where: whereClause,
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
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/properties/${propertyId}`);
}

export async function deleteProperty(propertyId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "AGENT")) {
    throw new Error("Unauthorized: Only Admins and Agents can delete properties.");
  }

  // Admins can delete any property; Agents can only delete their own
  const whereClause = session.user.role === "ADMIN"
    ? { id: propertyId }
    : { id: propertyId, userId: session.user.id };

  await prisma.property.delete({
    where: whereClause,
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
}
