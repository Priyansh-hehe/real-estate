import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white">
        Paliwal Properties<span className="text-blue-600">.</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition-colors">
          Home
        </Link>
        
        {session ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-semibold hover:text-blue-600 transition-colors bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full"
            >
              Dashboard
            </Link>
            {session.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "User Avatar"} 
                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {session.user?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/login" 
            className="text-sm font-semibold hover:text-blue-600 transition-colors bg-black dark:bg-white dark:text-black text-white px-5 py-2 rounded-full shadow-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
