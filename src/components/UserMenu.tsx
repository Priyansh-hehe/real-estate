"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function UserMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
      >
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
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2 z-50">
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
            <p className="text-sm font-semibold truncate text-zinc-900 dark:text-white">{session.user?.name}</p>
            <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
