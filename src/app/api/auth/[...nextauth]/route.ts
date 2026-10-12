/**
 * ==============================================================================
 * NEXTAUTH ROUTE HANDLER (src/app/api/auth/[...nextauth]/route.ts)
 * ==============================================================================
 * Serves as the dynamic API route handler for all NextAuth authentication requests:
 * /api/auth/signin, /api/auth/signout, /api/auth/callback, /api/auth/session, etc.
 * ==============================================================================
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
