/**
 * ==============================================================================
 * DASHBOARD SIDEBAR SIGN-OUT BUTTON (src/components/SignOutSidebarButton.tsx)
 * ==============================================================================
 * Clean client component button placed in the admin/agent dashboard sidebar:
 * - Invokes NextAuth signOut and redirects user back to the homepage ('/').
 * ==============================================================================
 */

"use client";

import { signOut } from "next-auth/react";

export default function SignOutSidebarButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-4 py-2 w-full text-left rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium mt-2"
    >
      Sign Out
    </button>
  );
}
