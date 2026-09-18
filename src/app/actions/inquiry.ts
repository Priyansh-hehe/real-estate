"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitInquiryAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  const propertyId = formData.get("propertyId") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = (formData.get("email") as string) || null;
  const message = (formData.get("message") as string) || null;

  if (!propertyId || !name || !phone) {
    throw new Error("Missing required fields: property, name, and phone number.");
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      propertyId,
      name,
      phone,
      email,
      message,
      userId: session?.user?.id || null,
    },
  });

  revalidatePath(`/properties/${propertyId}`);
  revalidatePath("/dashboard");

  return { success: true, inquiryId: inquiry.id };
}
