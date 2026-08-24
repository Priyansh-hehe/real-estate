import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let connectionString = process.env.DATABASE_URL || "";

// If we are using the local Prisma dev server, we need to decode the direct connection string
if (connectionString.startsWith("prisma+postgres://")) {
  const urlObj = new URL(connectionString);
  const apiKey = urlObj.searchParams.get("api_key");
  if (apiKey) {
    const decoded = Buffer.from(apiKey, "base64").toString("utf-8");
    connectionString = JSON.parse(decoded).databaseUrl;
  }
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
