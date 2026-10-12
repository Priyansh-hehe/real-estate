/**
 * ==============================================================================
 * PRISMA CLIENT SINGLETON (src/lib/prisma.ts)
 * ==============================================================================
 * Instantiates and exports a singleton instance of PrismaClient using the pg adapter.
 * Prevents multiple duplicate database connection pools during Next.js hot-reloads in development.
 * ==============================================================================
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
