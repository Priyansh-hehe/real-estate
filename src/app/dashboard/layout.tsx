import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import SignOutSidebarButton from "@/components/SignOutSidebarButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 🛑 The Security Wall: If not logged in, kick them back to login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-zinc-500">Welcome, {session.user?.name}</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            My Properties
          </Link>
          <Link href="/dashboard/add" className="px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            + Add Property
          </Link>
          
          <div className="mt-auto pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link href="/" className="px-4 py-2 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block">
              View Live Site
            </Link>
            <SignOutSidebarButton />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
