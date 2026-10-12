/**
 * ==============================================================================
 * AUTHENTICATION SESSION PROVIDER (src/components/AuthProvider.tsx)
 * ==============================================================================
 * Client wrapper around NextAuth SessionProvider.
 * Provides client components access to `useSession()` for checking login state and roles.
 * ==============================================================================
 */

"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
