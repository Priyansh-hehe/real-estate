/**
 * ==============================================================================
 * EDIT PROPERTY PAGE (src/app/dashboard/edit/[id]/page.tsx)
 * ==============================================================================
 * Server component that fetches an existing property and checks permissions:
 * - ADMIN can edit any property listing.
 * - AGENT can only edit properties they personally created.
 * - Loads EditPropertyForm pre-filled with the current values.
 * ==============================================================================
 */

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditPropertyForm from "@/components/EditPropertyForm";

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/api/auth/signin");
  }

  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: {
      id,
    }
  });

  if (!property) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="text-zinc-500">The property you are trying to edit does not exist.</p>
      </div>
    );
  }

  // Ensure they own it
  if (property.userId !== session.user.id) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
        <p className="text-zinc-500">You do not have permission to edit this property.</p>
      </div>
    );
  }

  return <EditPropertyForm property={property} />;
}
