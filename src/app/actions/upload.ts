"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function uploadImageAction(formData: FormData) {
  // 1. Verify the user is an authorized admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized: Only admins can upload images.");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // 2. Initialize Supabase Admin Client
  // We use the Service Role key here to bypass RLS and upload securely from the backend.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // 3. Convert File to Buffer/Blob
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 4. Upload to Supabase
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("properties")
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase Backend Upload Error:", uploadError);
    throw new Error("Failed to upload image to Supabase.");
  }

  // 5. Get and Return Public URL
  const { data } = supabaseAdmin.storage.from("properties").getPublicUrl(filePath);

  return data.publicUrl;
}
